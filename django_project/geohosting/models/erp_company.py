from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from geohosting.models.data_types import PaymentMethod
from geohosting.models.erp_model import ErpModel
from geohosting.utils.erpnext import (
    fetch_erpnext_data
)


class ErpCompany(ErpModel):
    """Company that is coming from ERP."""

    id_field_in_erpnext = 'name'
    name = models.CharField(max_length=255)
    default_currency = models.CharField(
        max_length=256,
        blank=True, null=True
    )
    email = models.EmailField(
        blank=True, null=True
    )

    # Based on payment
    payment_method = models.CharField(
        default=PaymentMethod.default_choice,
        choices=PaymentMethod.choices,
        max_length=256,
        help_text='The status of order.'
    )
    invoice_from_sales_invoice = models.BooleanField(
        default=False,
        help_text=(
            'If checked, invoices will be generated from sales invoices.'
            'If not, it will be generated from the sales order.'
        )
    )

    @property
    def doc_type(self):
        """Doctype for this model."""
        return 'Company'

    def __str__(self):
        return self.erpnext_code

    class Meta:  # noqa: D106
        ordering = ('name',)
        verbose_name_plural = 'Erp companies'


@receiver(post_save, sender=ErpCompany)
def erp_company_post_save(sender, instance, created, **kwargs):
    """Signal receiver for ErpCompany post save."""
    if instance.erpnext_code:
        # Taxes and charges
        rows = fetch_erpnext_data(
            TaxesAndCharges.doc_type, {"company": instance.erpnext_code}
        )
        for row in rows:
            TaxesAndCharges.objects.get_or_create(
                company=instance,
                erpnext_code=row['name'],
                defaults={
                    "tax_category": row['tax_category'],
                }
            )

        # Cost centers
        rows = fetch_erpnext_data(
            CostCenter.doc_type, {"company": instance.erpnext_code}
        )
        for row in rows:
            CostCenter.objects.get_or_create(
                company=instance,
                erpnext_code=row['name']
            )


class TaxesAndCharges(ErpModel):
    """Sales and charge."""

    doc_type = "Sales Taxes and Charges Template"
    company = models.ForeignKey(
        ErpCompany,
        on_delete=models.CASCADE
    )
    tax_category = models.CharField(
        max_length=256, null=True, blank=True
    )
    is_active = models.BooleanField(
        default=False,
        help_text='If checked, this tax and charges is going to be used.'
    )


class CostCenter(ErpModel):
    """Cost center model."""

    doc_type = "Cost Center"
    company = models.ForeignKey(
        ErpCompany,
        on_delete=models.CASCADE
    )
    is_active = models.BooleanField(
        default=False,
        help_text='If checked, this cost center is going to be used.'
    )
