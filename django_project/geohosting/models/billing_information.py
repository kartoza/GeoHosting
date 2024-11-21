from django.db import models

from geohosting.models.country import Country
from geohosting.models.erp_model import ErpModel


class BillingInformation(ErpModel):
    """Billing information model."""

    name = models.TextField(
        blank=True, null=True
    )
    address = models.TextField(
        blank=True, null=True
    )
    postal_code = models.CharField(
        max_length=256,
        blank=True, null=True
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL, blank=True, null=True
    )
    city = models.CharField(
        max_length=256,
        blank=True, null=True
    )
    region = models.CharField(
        max_length=256,
        blank=True, null=True
    )
    tax_number = models.CharField(
        max_length=256,
        blank=True, null=True
    )

    class Meta:  # noqa: D106
        abstract = True
