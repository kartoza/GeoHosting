from datetime import timedelta, datetime

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.timezone import now

from geohosting.models.company import Company
from geohosting.models.data_types import PaymentMethod
from geohosting.models.erp_model import ErpModel
from geohosting.models.instance import Instance
from geohosting.models.region import Region
from geohosting.models.subscription import Subscription
from geohosting.models.user_profile import UserProfile
from geohosting.utils.erpnext import (
    add_erp_next_comment, download_erp_file, post_to_erpnext,
    get_erpnext_data
)
from geohosting.utils.payment import (
    PaymentGateway, StripePaymentGateway, PaystackPaymentGateway
)
from geohosting.validators import name_validator, app_name_validator
from geohosting_event.models.log import LogTracker

stripe.api_key = settings.STRIPE_SECRET_KEY
User = get_user_model()


def get_default_delivery_date():
    return now() + timedelta(days=1)


class _SalesOrderStatusObject:
    """SalesOrderStatus."""

    def __init__(
            self, key, billing_status, erp_status, percent_billed,
            doc_status
    ):
        self.key = key
        self.billing_status = billing_status
        self.erp_status = erp_status
        self.percent_billed = percent_billed
        self.doc_status = doc_status


class SalesOrderStatus:
    """Order Status."""

    WAITING_PAYMENT = _SalesOrderStatusObject(
        'Waiting Payment',
        'Not Billed',
        'To Bill',
        0,
        0
    )
    WAITING_CONFIGURATION = _SalesOrderStatusObject(
        'Waiting Configuration',
        'Fully Billed',
        'On Hold',
        100,
        0
    )
    WAITING_DEPLOYMENT = _SalesOrderStatusObject(
        'Waiting Deployment',
        'Fully Billed',
        'To Deliver',
        100,
        1
    )
    DEPLOYED = _SalesOrderStatusObject(
        'Deployed',
        'Fully Billed',
        'Completed',
        100,
        1
    )

    @staticmethod
    def sales_order_status_object_attributes() -> list[
        _SalesOrderStatusObject
    ]:
        output = []
        for prop in dir(SalesOrderStatus):
            attr = getattr(SalesOrderStatus, prop)
            if isinstance(attr, _SalesOrderStatusObject):
                output.append(attr)
        return output

    @staticmethod
    def obj_by_key(key: str) -> _SalesOrderStatusObject:
        """Return object status from key."""
        for attr in SalesOrderStatus.sales_order_status_object_attributes():
            if attr.key == key:
                return attr
        return SalesOrderStatus.WAITING_PAYMENT

    @staticmethod
    def key_in_tuple() -> tuple:
        output = ()
        for attr in SalesOrderStatus.sales_order_status_object_attributes():
            output += ((attr.key, attr.key),)
        return output


class SalesOrder(ErpModel):
    """Sales Order."""

    doc_type = "Sales Order"
    package = models.ForeignKey(
        'geohosting.Package',
        null=False,
        blank=False,
        on_delete=models.CASCADE,
        related_name='sales_orders',
        verbose_name='Package'
    )

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sales_orders',
        verbose_name='Customer'
    )

    date = models.DateTimeField(
        default=now,
        verbose_name='Order Date'
    )

    delivery_date = models.DateTimeField(
        default=get_default_delivery_date,
        verbose_name='Delivery Date'
    )

    # For checkout status
    order_status = models.CharField(
        default=SalesOrderStatus.WAITING_PAYMENT.key,
        choices=SalesOrderStatus.key_in_tuple(),
        max_length=256,
        help_text='The status of order.'
    )

    # Payment detail
    payment_method = models.CharField(
        default=PaymentMethod.default_choice,
        choices=PaymentMethod.choices,
        max_length=256,
        help_text='The status of order.'
    )
    payment_id = models.CharField(
        blank=True,
        null=True,
        help_text='Checkout id on the payment gateway.'
    )
    invoice = models.FileField(
        upload_to='invoices/',
        blank=True,
        null=True,
    )

    # This is configuration for application
    app_name = models.CharField(
        blank=True,
        null=True,
        help_text=(
            'App name that would be used for instance.'
            'It will also be used for sub domain.'
        ),
        validators=[name_validator, app_name_validator]
    )
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text=(
            'Keep blank if purchase for individual capacity..'
        )
    )
    instance = models.ForeignKey(
        Instance, on_delete=models.SET_NULL,
        null=True, blank=True, editable=False
    )

    # This is what subscription for this instance
    subscription = models.ForeignKey(
        Subscription, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text=(
            'Subscription of the instance.'
        )
    )
    is_main_invoice = models.BooleanField(
        default=True
    )
    invoice_id = models.CharField(
        blank=True,
        null=True,
        help_text='Invoice id on the payment gateway.'
    )

    # Discounts
    discount_code = models.CharField(
        max_length=256,
        null=True, blank=True
    )
    discount_amount = models.IntegerField(
        null=True, blank=True,
        help_text='Discount amount if not using percentage.'
    )
    discount_percentage = models.IntegerField(
        null=True, blank=True,
        help_text='Discount percentage.'
    )

    class Meta:
        verbose_name = 'Sales order'
        verbose_name_plural = 'Sales orders'

    @property
    def payment_gateway(self) -> PaymentGateway:
        """Return payment gateway."""
        if self.payment_method == PaymentMethod.STRIPE:
            return StripePaymentGateway(self.payment_id)
        if self.payment_method == PaymentMethod.PAYSTACK:
            return PaystackPaymentGateway(self.payment_id)
        return None

    def __str__(self):
        return (
            f"SalesOrder {self.id} for "
            f"{self.customer.username} - "
            f"{self.package.name}"
        )

    def save(self, *args, **kwargs):
        """Save model."""
        super(SalesOrder, self).save(*args, **kwargs)
        # Push to erp
        result = self.post_to_erpnext()
        if result['status'] != 'success':
            return

        # Check if order status is waiting configuration
        order_status_obj = self.sales_order_status_obj
        if order_status_obj == SalesOrderStatus.WAITING_CONFIGURATION:
            self.auto_deploy()

    def post_to_erpnext(self):
        """Post data to erpnext."""
        result = super().post_to_erpnext()
        order_status_obj = self.sales_order_status_obj
        if order_status_obj.doc_status == 1:
            invoice = self.salesorderinvoice_set.all().first()
            if not invoice:
                # Create sales invoice if sales order is not already invoiced
                SalesOrderInvoice.objects.create(
                    sales_order=self
                )
            else:
                invoice.post_to_erpnext()
        return result

    def add_comment(self, comment, is_error=False):
        """Add comment."""
        if is_error:
            LogTracker.error(self, comment)
        else:
            LogTracker.success(self, comment)

        if self.erpnext_code:
            add_erp_next_comment(
                self.customer, self.doc_type, self.erpnext_code, comment
            )

    @property
    def erp_company(self):
        """Return erp company."""
        from geohosting.models.erp_company import ErpCompany
        try:
            return ErpCompany.objects.get(
                payment_method=self.payment_method
            )
        except ErpCompany.DoesNotExist:
            pass
        return None

    @property
    def erp_payload_for_create(self):
        """ERP Payload for create request."""
        from geohosting.models.erp_company import TaxesAndCharges
        user_profile = UserProfile.objects.get(
            user=self.customer
        )
        order_status_obj = self.sales_order_status_obj
        customer = user_profile.erpnext_code
        try:
            if self.company.erpnext_code:
                customer = self.company.erpnext_code
        except Exception:
            pass

        _company = self.erp_company
        company = None
        taxes_and_charges = None
        if _company:
            taxes_and_charges = _company.taxesandcharges_set.filter(
                is_active=True
            ).first()
            company = _company.erpnext_code

        payload = {
            # status is not billed
            'billing_status': order_status_obj.billing_status,
            # Status waiting bill
            'status': order_status_obj.erp_status,
            # Percent billed
            'per_billed': order_status_obj.percent_billed,

            # For other information
            "doctype": self.doc_type,
            'customer': customer,
            'date': self.date.strftime('%Y-%m-%d'),
            'selling_price_list': self.package.price_list,
            'price_list_currency': self.package.currency,
            'currency': self.package.currency,
            'items': [
                {
                    'name': self.package.erpnext_code,
                    'item_code': self.package.erpnext_item_code,
                    'delivery_date': (
                        self.delivery_date.strftime('%Y-%m-%d')
                    ),
                    'qty': 1.0,
                    'uom': 'Month'
                }
            ],
            'company': company
        }
        if taxes_and_charges:
            payload['taxes_and_charges'] = taxes_and_charges.erpnext_code
            payload['tax_category'] = taxes_and_charges.tax_category
            data = get_erpnext_data(
                TaxesAndCharges.doc_type,
                taxes_and_charges.erpnext_code
            )
            taxes = data['data']['taxes']
            for tax in taxes:
                tax['included_in_print_rate'] = 1
                tax['included_in_paid_amount'] = 1
            payload['taxes'] = data['data']['taxes']
        return payload

    @property
    def erp_payload_for_edit(self):
        """ERP Payload for edit request."""
        order_status_obj = self.sales_order_status_obj
        payload = {
            # status is not billed
            'billing_status': order_status_obj.billing_status,
            # Status waiting bill
            'status': order_status_obj.erp_status,
            # Percent billed
            'per_billed': order_status_obj.percent_billed,
            # Docstatus
            'docstatus': order_status_obj.doc_status
        }

        # Payload for discount
        if self.discount_amount:
            payload['discount_amount'] = self.discount_amount
        if self.discount_percentage:
            payload[
                'additional_discount_percentage'
            ] = self.discount_percentage
        return payload

    @property
    def sales_order_status_obj(self) -> _SalesOrderStatusObject:
        """Return sales order status object."""
        return SalesOrderStatus.obj_by_key(self.order_status)

    def set_order_status(self, new: _SalesOrderStatusObject):
        """Set order status from _SalesOrderStatusObject."""
        if new.key == SalesOrderStatus.WAITING_DEPLOYMENT.key:
            # If order status is waiting payment,
            # We need to check the discount
            self.sync_subscription()
            if self.subscription:
                pass
        self.order_status = new.key
        self.save()

    def update_payment_status(self):
        """Update payment status based on the checkout detail from payment."""
        if (
                self.sales_order_status_obj == SalesOrderStatus.WAITING_PAYMENT
                and self.payment_id
        ):
            if self.payment_gateway.payment_verification():
                self.sync_subscription()
                self.set_order_status(
                    SalesOrderStatus.WAITING_CONFIGURATION
                )

    @property
    def invoice_url(self):
        """Return invoice url when the status is not payment anymore."""
        if self.sales_order_status_obj != SalesOrderStatus.WAITING_PAYMENT:
            if (
                    self.erp_company and
                    self.erp_company.invoice_from_sales_invoice
            ):
                # Return using invoice from the sales order invoice
                invoice = self.salesorderinvoice_set.first()
                if invoice:
                    return invoice.invoice_url

            # Return using invoice from the sales order
            if self.invoice:
                return self.invoice.url
            else:
                image_file = download_erp_file(
                    '/api/method/frappe.utils.print_format.download_pdf'
                    f'?doctype=Sales%20Order&name={self.erpnext_code}',
                    folder='invoices',
                    filename=f'{self.erpnext_code}.pdf'
                )
                if image_file:
                    self.invoice = image_file
                    self.save()
                    return self.invoice.url
        return None

    def auto_deploy(self):
        """Change status to deployment and do deployment."""
        from geohosting.forms.activity.create_instance import (
            CreateInstanceForm
        )
        # Check if order status is waiting configuration
        if self.app_name and self.erpnext_code:
            if self.order_status != SalesOrderStatus.WAITING_CONFIGURATION:
                self.add_comment(f"App name : {self.app_name}")
            self.set_order_status(SalesOrderStatus.WAITING_DEPLOYMENT)

            # TODO:
            #  When we have multi region, we will change below
            #  Link region to sales order
            form = CreateInstanceForm(
                {
                    'region': Region.default_region(),
                    'app_name': self.app_name,
                    'package': self.package,
                    'sales_order': self
                }
            )
            form.user = self.customer
            if not form.is_valid():
                errors = []
                for key, val in form.errors.items():
                    errors += val
                self.add_comment(
                    f'AUTO DEPLOY ERROR: {", ".join(errors)}',
                    is_error=True
                )
            else:
                form.save()

    def sync_subscription(self):
        """Sync subscription."""
        from geohosting.models.coupon import CouponCode
        if not self.subscription:
            subscription = self.payment_gateway.subscription(
                self.customer
            )
            if subscription:
                detail = subscription.detail
                self.subscription = subscription
                try:
                    self.discount_code = detail.get('discount_code')
                    if self.discount_code:
                        code = CouponCode.objects.get(code=self.discount_code)
                        code.code_used_on_paystack = True
                        code.save()
                    self.discount_amount = detail.get('discount_amount')
                    self.discount_percentage = detail.get(
                        'discount_percentage'
                    )
                except KeyError:
                    pass
                self.save()
                self.subscription.sync_subscription()

        # Sync instance subscription
        if self.instance:
            self.instance.sync_subscription()

        if self.subscription:
            self.subscription.sync_subscription()


class SalesOrderInvoice(ErpModel):
    """Sales Order."""

    doc_type = "Sales Invoice"
    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE
    )
    invoice = models.FileField(
        upload_to='invoices/',
        blank=True,
        null=True,
    )

    def post_to_erpnext(self):
        """Post data to erpnext."""
        from geohosting.models.erp_model import ErpPaymentTermTemplate
        if not self.sales_order.erpnext_code:
            return
        if not self.erpnext_code:
            # Create template
            result = post_to_erpnext(
                {
                    "source_name": self.sales_order.erpnext_code,
                },
                self.doc_type,
                url_input=(
                    'api/method/erpnext.selling.doctype.'
                    'sales_order.sales_order.make_sales_invoice'
                )
            )
            if result['status'] == 'success':
                message = result['response_data']['message']
                erp_company = self.sales_order.erp_company
                if erp_company:

                    # Add cost center
                    cost_center = erp_company.costcenter_set.filter(
                        is_active=True).first()
                    if cost_center:
                        message['cost_center'] = cost_center.erpnext_code

                    # Add payment schedule
                    term = ErpPaymentTermTemplate.objects.filter(
                        is_active=True
                    ).first()
                    if term:
                        data = get_erpnext_data(
                            ErpPaymentTermTemplate.doc_type,
                            term.erpnext_code
                        )
                        terms = data['data']['terms']
                        for term in terms:
                            term['due_date'] = datetime.now().strftime(
                                '%Y-%m-%d')
                        message['payment_schedule'] = terms

                result = post_to_erpnext(
                    message, self.doc_type
                )
                if result['status'] == 'success':
                    self.erpnext_code = result[self.id_field_in_erpnext]
                    self.save()

    @property
    def invoice_url(self):
        """Return invoice url when the status is not payment anymore."""
        if (
                self.sales_order.sales_order_status_obj !=
                SalesOrderStatus.WAITING_PAYMENT
        ):
            if self.invoice:
                return self.invoice.url
            else:
                image_file = download_erp_file(
                    '/api/method/frappe.utils.print_format.download_pdf'
                    f'?doctype=Sales%20Invoice&name={self.erpnext_code}',
                    folder='invoices',
                    filename=f'{self.erpnext_code}.pdf'
                )
                if image_file:
                    self.invoice = image_file
                    self.save()
                    return self.invoice.url
        return None
