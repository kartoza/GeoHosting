# models.py
from datetime import datetime

from django.contrib.auth.models import User
from django.db import models

from core.models.preferences import Preferences
from geohosting.models import UserProfile
from geohosting.models.erp_model import ErpModel
from geohosting.utils.erpnext import (
    fetch_erpnext_data, upload_attachment_to_erp
)

status_erp = {
    'Open': 'open',
    'On Hold': 'pending',
    'Replied': 'pending',
    'Closed': 'closed',
    'Resolved': 'resolved',
}


class Ticket(ErpModel):
    """Ticket model."""

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    ]
    ISSUE_CHOICES = [
        ('Bug', 'Bug'),
        ('Feature Request', 'Feature Request'),
        ('Support', 'Support'),
    ]

    customer = models.EmailField()
    subject = models.CharField(max_length=255)
    details = models.TextField()
    status = models.CharField(
        max_length=8, choices=STATUS_CHOICES, default='open'
    )
    issue_type = models.CharField(
        max_length=15, choices=ISSUE_CHOICES, default='Support'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True
    )

    @property
    def doc_type(self):
        """Doctype for this model."""
        return 'Issue'

    @property
    def erp_payload_for_create(self):
        """ERP Payload for create request."""
        pref = Preferences.load()
        payload = {
            "doctype": "Issue",
            "raised_by": self.customer,
            "owner": self.customer,
            "subject": self.subject,
            "description": self.details,
            "status": 'Open',
            "issue_type": self.issue_type,
            "project": pref.erpnext_project_code
        }
        if (
                self.user and self.user.userprofile and
                self.user.userprofile.erpnext_code
        ):
            payload['customer'] = self.user.userprofile.erpnext_code

        return payload

    @property
    def erp_payload_for_edit(self):
        """ERP Payload for edit request."""
        return {
            "subject": self.subject,
            "description": self.details,
        }

    @classmethod
    def sync_data(cls):
        """Sync data from erpnext to django that has erpnext code."""
        pref = Preferences.load()
        filters = [
            ["project", "=", pref.erpnext_project_code],
        ]
        try:
            erp_tickets = fetch_erpnext_data(
                doctype="Issue", filters=filters,
                fields=[
                    "name", "subject", "description", "status", "owner",
                    "modified", "customer", "raised_by"
                ]
            )
            if not isinstance(erp_tickets, list):
                raise ValueError("Failed to fetch data from ERPNext")

            for erp_ticket in erp_tickets:
                django_status = status_erp.get(
                    erp_ticket.get('status'), 'open'
                )
                customer = erp_ticket.get('customer')
                user = None
                if customer:
                    try:
                        user = UserProfile.objects.get(
                            erpnext_code=customer
                        ).user
                    except UserProfile.DoesNotExist:
                        pass
                if erp_ticket.get('name'):
                    ticket, _ = Ticket.objects.update_or_create(
                        erpnext_code=erp_ticket.get('name'),
                        defaults={
                            'user': user,
                            'customer': erp_ticket.get('raised_by'),
                            'status': django_status,
                            'subject': erp_ticket.get('subject'),
                            'details': erp_ticket.get('description'),
                            'updated_at': datetime.strptime(
                                erp_ticket.get('modified'),
                                "%Y-%m-%d %H:%M:%S.%f"
                            ),
                        }
                    )
        except Exception as e:
            print(f"Error fetching or updating tickets from ERPNext: {e}")


class Attachment(models.Model):
    """Attachment model."""

    ticket = models.ForeignKey(
        Ticket, related_name='attachments', on_delete=models.CASCADE
    )
    file = models.FileField(upload_to='ticket_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def post_to_erpnext(self):
        """Post the attachment to erp."""
        return upload_attachment_to_erp(
            doctype=self.ticket.doc_type,
            id=self.ticket.erpnext_code,
            file=self.file.file
        )
