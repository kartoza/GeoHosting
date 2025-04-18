from datetime import timedelta

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.timezone import now

from geohosting.models.company import Company
from geohosting.models.erp_model import ErpModel
from geohosting.models.instance import Instance
from geohosting.models.log import LogTracker
from geohosting.models.region import Region
from geohosting.models.user_profile import UserProfile
from geohosting.utils.erpnext import (
    add_erp_next_comment, download_erp_file
)
from geohosting.utils.payment import (
    PaymentGateway, StripePaymentGateway, PaystackPaymentGateway
)
from geohosting.validators import name_validator, app_name_validator

stripe.api_key = settings.STRIPE_SECRET_KEY
User = get_user_model()


def get_default_delivery_date():
    return now() + timedelta(days=1)


class _SalesOrderStatusObject:
    """SalesOrderStatus."""

    def __init__(self, key, billing_status, erp_status, percent_billed):
        """Initiate SalesOrderStatusObject."""
        self.key = key
        self.billing_status = billing_status
        self.erp_status = erp_status
        self.percent_billed = percent_billed


class SalesOrderStatus:
    """Order Status."""

    WAITING_PAYMENT = _SalesOrderStatusObject(
        'Waiting Payment',
        'Not Billed',
        'To Bill',
        0
    )
    WAITING_CONFIGURATION = _SalesOrderStatusObject(
        'Waiting Configuration',
        'Fully Billed',
        'On Hold',
        100
    )
    WAITING_DEPLOYMENT = _SalesOrderStatusObject(
        'Waiting Deployment',
        'Fully Billed',
        'To Deliver',
        100
    )
    DEPLOYED = _SalesOrderStatusObject(
        'Deployed',
        'Fully Billed',
        'Completed',
        100
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


class SalesOrderPaymentMethod:
    """Order payment method."""

    STRIPE = 'Stripe'
    PAYSTACK = 'Paystack'


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

    payment_method = models.CharField(
        default=SalesOrderPaymentMethod.STRIPE,
        choices=(
            (
                SalesOrderPaymentMethod.STRIPE,
                SalesOrderPaymentMethod.STRIPE
            ),
            (
                SalesOrderPaymentMethod.PAYSTACK,
                SalesOrderPaymentMethod.PAYSTACK
            )
        ),
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

    class Meta:
        verbose_name = 'Sales Order'
        verbose_name_plural = 'Sales Orders'

    @property
    def payment_gateway(self) -> PaymentGateway:
        """Return payment gateway."""
        if self.payment_method == SalesOrderPaymentMethod.STRIPE:
            return StripePaymentGateway(self.payment_id)
        if self.payment_method == SalesOrderPaymentMethod.PAYSTACK:
            return PaystackPaymentGateway(self.payment_id)

    def save(self, *args, **kwargs):
        """Save model."""
        super(SalesOrder, self).save(*args, **kwargs)
        # Push to erp
        result = self.post_to_erpnext()
        if result['status'] != 'success':
            raise Exception(result['message'])

        # Check if order status is waiting configuration
        order_status_obj = self.sales_order_status_obj
        if order_status_obj == SalesOrderStatus.WAITING_CONFIGURATION:
            self.auto_deploy()

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

    def __str__(self):
        return (
            f"SalesOrder {self.id} for "
            f"{self.customer.username} - "
            f"{self.package.name}"
        )

    @property
    def erp_payload_for_create(self):
        """ERP Payload for create request."""
        from geohosting.models.erp_company import ErpCompany
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

        company = None
        try:
            company = ErpCompany.objects.get(
                payment_method=self.payment_method
            ).erpnext_code
        except ErpCompany.DoesNotExist:
            pass

        return {
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
                }
            ],
            'company': company
        }

    @property
    def erp_payload_for_edit(self):
        """ERP Payload for edit request."""
        order_status_obj = self.sales_order_status_obj
        return {
            # status is not billed
            'billing_status': order_status_obj.billing_status,
            # Status waiting bill
            'status': order_status_obj.erp_status,
            # Percent billed
            'per_billed': order_status_obj.percent_billed
        }

    @property
    def sales_order_status_obj(self) -> _SalesOrderStatusObject:
        """Return sales order status object."""
        return SalesOrderStatus.obj_by_key(self.order_status)

    def set_order_status(self, new: _SalesOrderStatusObject):
        """Set order status from _SalesOrderStatusObject."""
        self.order_status = new.key
        self.save()

    def update_payment_status(self):
        """Update payment status based on the checkout detail from payment."""
        if (
                self.sales_order_status_obj == SalesOrderStatus.WAITING_PAYMENT
                and self.payment_id
        ):
            if self.payment_gateway.payment_verification():
                self.set_order_status(
                    SalesOrderStatus.WAITING_CONFIGURATION
                )

    @property
    def invoice_url(self):
        """Return invoice url when the status is not payment anymore."""
        if self.sales_order_status_obj != SalesOrderStatus.WAITING_PAYMENT:
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

    def cancel_subscription(self):
        """Cancel subscription."""
        if not self.payment_id:
            return
        self.payment_gateway.cancel_subscription()

    @property
    def subscription(self):
        """Return subscription."""
        return self.payment_gateway.subscription()
