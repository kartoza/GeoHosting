# coding=utf-8
"""
GeoHosting.

.. note:: Instance model.
"""

from django.core.mail import EmailMessage
from django.db import models
from django.utils import timezone

from core.settings.base import DEFAULT_FROM_EMAIL


class EmailCategory:
    """Email category."""

    INSTANCE_NOTIFICATION = 'Instance Notification'
    SUBSCRIPTION_REMINDER = 'Subscription Remainder'


class EmailEvent(models.Model):
    """Email event model."""

    sent_at = models.DateTimeField(
        default=timezone.now,
        editable=False
    )
    from_email = models.EmailField()
    to = models.JSONField()
    subject = models.TextField()
    body = models.TextField()

    # This is for grouping
    category = models.CharField(max_length=255)
    tags = models.JSONField(null=True, blank=True)

    class Meta:  # noqa
        ordering = ('-sent_at',)

    def send(self):
        """Send the email."""
        # Create the email message
        email = EmailMessage(
            subject=self.subject,
            body=self.body,
            from_email=DEFAULT_FROM_EMAIL,
            to=self.to
        )
        email.content_subtype = 'html'
        email.send()

    @staticmethod
    def send_email(
            subject, body, to, category, tags=None,
            from_email=DEFAULT_FROM_EMAIL
    ):
        event = EmailEvent.objects.create(
            sent_at=timezone.now(),
            subject=subject,
            body=body,
            to=to,
            from_email=from_email,
            category=category,
            tags=tags
        )
        event.send()
