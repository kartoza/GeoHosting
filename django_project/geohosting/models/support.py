# models.py
from datetime import datetime

from django.db import models

from geohosting.models.erp_model import ErpModel
from geohosting.utils.erpnext import (
    fetch_erpnext_data, put_to_erpnext
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

    @property
    def doc_type(self):
        """Doctype for this model."""
        return 'Issue'

    @property
    def erp_payload_for_create(self):
        """ERP Payload for create request."""
        return {
            "doctype": "Issue",
            "raised_by": self.customer,
            "owner": self.customer,
            "subject": self.subject,
            "description": self.details,
            "status": 'Open'
        }

    @property
    def erp_payload_for_edit(self):
        """ERP Payload for edit request."""
        return {
            "subject": self.subject,
            "description": self.details,
        }

    @staticmethod
    def fetch_ticket_from_erp(user_email, ids=None):
        """Fetch ticket from erp."""
        filters = [
            ["raised_by", "=", user_email]
        ]
        if ids:
            filters.append(
                ["name", "in", ids]
            )

        try:
            erp_tickets = fetch_erpnext_data(
                doctype="Issue", filters=filters,
                fields=[
                    "name", "subject", "description", "status", "owner",
                    "modified"
                ]
            )
            if not isinstance(erp_tickets, list):
                raise ValueError("Failed to fetch data from ERPNext")

            for erp_ticket in erp_tickets:
                django_status = status_erp.get(
                    erp_ticket.get('status'), 'open'
                )
                if erp_ticket.get('name'):
                    Ticket.objects.update_or_create(
                        customer=user_email,
                        erpnext_code=erp_ticket.get('name'),
                        defaults={
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
        put_to_erpnext(
            {},
            self.ticket.doc_type,
            self.ticket.erpnext_code,
            file=self.file.file.read()
        )
