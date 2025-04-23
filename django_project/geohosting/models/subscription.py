from django.contrib.auth import get_user_model
from django.db import models

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
