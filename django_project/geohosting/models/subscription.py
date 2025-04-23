from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from core.models.preferences import Preferences
from geohosting.models.data_types import PaymentMethod

User = get_user_model()


class Subscription(models.Model):
    """Subscription model."""

    subscription_id = models.CharField(
        help_text='Subscription id on the payment gateway.'
    )
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE
    )

    payment_method = models.CharField(
        default=PaymentMethod.default_choice,
        choices=PaymentMethod.choices,
        max_length=256,
        help_text='The status of order.'
    )
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        """Return subscription id."""
        return self.subscription_id

    @property
    def payment_gateway(self):
        """Return payment gateway."""
        from geohosting.utils.subscription import (
            StripeSubscriptionGateway, PaystackSubscriptionGateway
        )
        if self.payment_method == PaymentMethod.STRIPE:
            return StripeSubscriptionGateway(self.subscription_id)
        if self.payment_method == PaymentMethod.PAYSTACK:
            return PaystackSubscriptionGateway(self.subscription_id)

    def cancel_subscription(self):
        """Cancel subscription."""
        self.payment_gateway.cancel_subscription()

    def sync_subscription(self):
        """Sync subscription."""
        self.payment_gateway.subscription(self.customer)

    @property
    def is_waiting_payment(self) -> bool:
        """Is instance is in waiting payment."""
        self.sync_subscription()
        self.refresh_from_db()
        return timezone.now() > self.current_period_end

    @property
    def is_expired(self) -> bool:
        """Is instance is expired."""
        pref = Preferences.load()
        if not self.is_waiting_payment:
            return False
        return timezone.now() > (
                self.current_period_end + timedelta(
            days=pref.grace_period_days)
        )
