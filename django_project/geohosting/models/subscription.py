from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from core.models.preferences import Preferences
from geohosting.models.data_types import PaymentMethod
from geohosting_event.models.log import LogTracker

User = get_user_model()


class Subscription(models.Model):
    """Subscription model."""

    subscription_id = models.CharField(
        help_text='Subscription id on the payment gateway.'
    )
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    customer_payment_id = models.TextField(
        blank=True, null=True
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

    # Payment id
    payment_id = models.CharField(
        help_text='Payment id on the payment gateway, it needs for paystack.',
        null=True, blank=True
    )

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
        raise NotImplementedError(
            'No payment gateway found for this payment method.'
        )

    def cancel_subscription(self):
        """Cancel subscription."""
        self.payment_gateway.cancel_subscription()
        self.sync_subscription()

    def sync_subscription(self):
        """Sync subscription."""
        self.update_payment()
        self.payment_gateway.subscription(self.customer)

        for instance in self.instance_set.all():
            instance.is_expired  # noqa

    @property
    def current_expiry_at(self):
        """Return hard deadline time."""
        pref = Preferences.load()
        return self.current_period_end + timedelta(
            days=pref.grace_period_days
        )

    @property
    def is_waiting_payment(self) -> bool:
        """Is instance is in waiting payment."""
        return timezone.now() > self.current_period_end

    @property
    def is_expired(self) -> bool:
        """Is instance is expired."""
        if not self.is_waiting_payment:
            return False
        return timezone.now() >= self.current_expiry_at

    @property
    def detail(self) -> bool:
        """Remote detail data."""
        if self.payment_gateway.get_subscription_data():
            return self.payment_gateway.get_subscription_data().json
        else:
            return {}

    def update_payment(self):
        """Update payment for paystack."""
        from paystackapi.subscription import (
            Subscription as PaystackSubscription
        )
        from geohosting.utils.paystack import (
            get_subscription_detail_from_payment
        )

        from geohosting.utils.paystack import verify_paystack_payment
        if self.payment_id and self.payment_method == PaymentMethod.PAYSTACK:
            try:
                # Update subscription
                transaction = verify_paystack_payment(self.payment_id)['data']
                if not transaction:
                    raise Exception('No transaction found')
                paystack_subscription = get_subscription_detail_from_payment(
                    self.payment_id
                )
                if not paystack_subscription:
                    authorization_code = transaction['authorization'][
                        'authorization_code'
                    ]
                    customer_code = transaction['customer']['customer_code']
                    paystack_subscription = PaystackSubscription.fetch(
                        self.subscription_id
                    )
                    plan_code = paystack_subscription[
                        'data']['plan']['plan_code']
                    self.cancel_subscription()
                    paystack_subscription = PaystackSubscription.create(
                        customer=customer_code,
                        authorization=authorization_code,
                        plan=plan_code
                    )['data']
                if paystack_subscription['id']:
                    self.subscription_id = paystack_subscription['id']
                    self.payment_id = None
                    self.save()
                    self.sync_subscription()
            except Exception as e:
                LogTracker.error(self, f'{e}')


# This is for saving customer id of payment gateway
@receiver(post_save, sender=Subscription)
def create_name(sender, instance: Subscription, created, **kwargs):
    from geohosting.models import UserPaymentGatewayId
    customer = instance.customer
    if customer:
        try:
            customer.userpaymentgatewayid
        except UserPaymentGatewayId.DoesNotExist:
            UserPaymentGatewayId.objects.create(user=customer)

        user_payment_id = customer.userpaymentgatewayid
        if instance.payment_method == PaymentMethod.PAYSTACK:
            if not user_payment_id.paystack:
                user_payment_id.paystack = instance.customer_payment_id
                user_payment_id.save()
        elif instance.payment_method == PaymentMethod.STRIPE:
            if not user_payment_id.stripe:
                user_payment_id.stripe = instance.customer_payment_id
                user_payment_id.save()
