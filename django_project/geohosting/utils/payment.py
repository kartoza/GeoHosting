from geohosting.utils.paystack import (
    verify_paystack_payment,
    cancel_subscription as cancel_paystack_subscription
)
from geohosting.utils.stripe import (
    get_checkout_detail, cancel_subscription as cancel_stripe_subscription,
    get_subscription_detail as get_stripe_subscription_detail
)


class Subscription:
    """Subscription status."""

    id = None
    current_period_start = None
    current_period_end = None
    canceled_at = None

    def __init__(
            self, id, current_period_start, current_period_end, canceled_at
    ):
        """Initialize Payment Status."""
        self.id = id
        self.current_period_start = current_period_start
        self.current_period_end = current_period_end
        self.canceled_at = canceled_at

    @property
    def json(self):
        """Return json."""
        return {
            'id': self.id,
            'current_period_start': self.current_period_start,
            'current_period_end': self.current_period_end,
            'canceled_at': self.canceled_at,
        }


class PaymentGateway:
    """Payment Gateway."""

    def __init__(self, payment_id):
        """Initialize payment gateway."""
        self.payment_id = payment_id

    def payment_verification(self):
        """Payment verification."""
        raise NotImplementedError

    def cancel_subscription(self):
        """Get subscription id."""
        raise NotImplementedError

    def subscription(self) -> Subscription:
        """Get subscription id."""
        raise NotImplementedError


class StripePaymentGateway(PaymentGateway):
    """Stripe Payment Gateway."""

    def payment_verification(self) -> bool:
        """Payment verification."""
        detail = get_checkout_detail(self.payment_id)
        if not detail:
            return False
        if detail.invoice:
            return True
        return False

    def cancel_subscription(self):
        """Get subscription id."""
        cancel_stripe_subscription(self.payment_id)

    def subscription(self):
        """Return subscription status."""
        subscription = get_stripe_subscription_detail(self.payment_id)
        if not subscription:
            return None
        return Subscription(
            id=subscription['id'],
            current_period_start=subscription['current_period_start'],
            current_period_end=subscription['current_period_end'],
            canceled_at=subscription['canceled_at']
        ).json


class PaystackPaymentGateway(PaymentGateway):
    """Paystack Payment Gateway."""

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

    def cancel_subscription(self):
        """Get subscription id."""
        cancel_paystack_subscription(self.payment_id)

    def subscription(self):
        """Return subscription status."""
        return None
