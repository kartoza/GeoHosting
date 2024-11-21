from django.db import models

from geohosting.models._data_types import CUSTOMER_GROUP
from geohosting.models.billing_information import BillingInformation
from geohosting.models.erp_model import ErpModel
from geohosting.models.user_profile import UserProfile


class Company(ErpModel):
    """Company profile model."""
    name = models.CharField(
        max_length=255,
    )
    avatar = models.ImageField(
        upload_to='avatars/', blank=True, null=True
    )

    @property
    def doc_type(self):
        """Doctype for this model."""
        return 'Customer'

    @property
    def erp_payload_for_create(self):
        """ERP Payload for create request."""
        return {
            "doctype": self.doc_type,
            "customer_name": self.name,
            "customer_type": "Company",
            "customer_group": CUSTOMER_GROUP,
            "territory": "All Territories",
            "tax_category": "VAT"
        }

    @property
    def erp_payload_for_edit(self):
        """ERP Payload for edit request."""
        return {
            "doctype": self.doc_type,
            "customer_name": self.name,
            "customer_group": CUSTOMER_GROUP
        }

    def post_to_erpnext(self):
        """Post data to erp."""
        super().post_to_erpnext()

    def __str__(self):
        return self.name


class CompanyBillingInformation(BillingInformation):
    """Company billing information model."""

    company = models.OneToOneField(
        Company, on_delete=models.CASCADE
    )

    @property
    def customer_name(self):
        """Return customer name."""
        return self.company.name


class CompanyContact(ErpModel):
    """Company profile model."""

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE
    )
