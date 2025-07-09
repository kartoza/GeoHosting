from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils.timezone import make_aware

from geohosting.models.subscription import Subscription
from geohosting.utils.paystack import (
    verify_paystack_payment,
    get_subscription_detail_from_payment as get_paystack_subscription_detail
)
from geohosting.utils.stripe import (
    get_checkout_detail,
    get_subscription_detail_from_payment as get_stripe_subscription_detail
)

User = get_user_model()


class SubscriptionType:
    """Subscription status."""

    def __init__(
            self, id: str,
            current_period_start: float,
            current_period_end: float,
            canceled: bool
    ):
        self.id = id
        self.current_period_start = current_period_start
        self.current_period_end = current_period_end
        self.canceled = canceled


class PaymentGateway:
    """Payment Gateway."""

    def __init__(self, payment_id):
        self.payment_id = payment_id

    def payment_method(self) -> str:
        """Payment method."""
        raise NotImplementedError

    def payment_verification(self):
        """Payment verification."""
        raise NotImplementedError

    def _get_subscription_data(self) -> SubscriptionType | None:
        """Get subscription data."""
        raise NotImplementedError

    def subscription(self, subscriber: User) -> Subscription | None:
        """Get subscription id."""
        subscription_data = self._get_subscription_data()
        if not subscription_data:
            return None
        subscription, _ = Subscription.objects.update_or_create(
            subscription_id=subscription_data.id,
            defaults={
                'customer': subscriber,
                'payment_method': self.payment_method(),
                'current_period_start': make_aware(
                    datetime.fromtimestamp(
                        subscription_data.current_period_start
                    )
                ),
                'current_period_end': make_aware(
                    datetime.fromtimestamp(
                        subscription_data.current_period_end
                    )
                ),
                'is_active': not subscription_data.canceled
            }
        )
        return subscription


class StripePaymentGateway(PaymentGateway):
    """Stripe Payment Gateway."""

    def payment_method(self) -> str:
        """Payment method."""
        from geohosting.models.data_types import PaymentMethod
        return PaymentMethod.STRIPE

    def payment_verification(self) -> bool:
        """Payment verification."""
        detail = get_checkout_detail(self.payment_id)
        if not detail:
            return False
        if detail.invoice:
            return True
        return False

    def _get_subscription_data(self) -> SubscriptionType | None:
        """Get subscription data."""
        subscription = get_stripe_subscription_detail(self.payment_id)
        if not subscription:
            return None
        return SubscriptionType(
            id=subscription['id'],
            current_period_start=subscription['current_period_start'],
            current_period_end=subscription['current_period_end'],
            canceled=True if subscription['canceled_at'] else False
        )


class PaystackPaymentGateway(PaymentGateway):
    """Paystack Payment Gateway."""

    def payment_method(self) -> str:
        """Payment method."""
        from geohosting.models.data_types import PaymentMethod
        return PaymentMethod.PAYSTACK

    def payment_verification(self) -> bool:
        """Payment verification."""
        response = verify_paystack_payment(self.payment_id)
        if not response:
            return False
        try:
            if response['data']['status'] == 'success':
                return True
        except KeyError:
            return False

    def _get_subscription_data(self) -> SubscriptionType | None:
        """Get subscription data."""
        subscription = get_paystack_subscription_detail(self.payment_id)
        if not subscription:
            return None
        current_period_start = datetime.fromisoformat(
            subscription['createdAt'].replace('Z', '+00:00')
        ).timestamp()
        current_period_end = datetime.fromisoformat(
            subscription['next_payment_date'].replace('Z', '+00:00')
        ).timestamp()
        status = subscription['status']
        return SubscriptionType(
            id=subscription['id'],
            current_period_start=current_period_start,
            current_period_end=current_period_end,
            canceled=(
                    status in ['cancel', 'cancelled', 'non-renewing']
            )
        )
