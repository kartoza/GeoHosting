from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.utils.timezone import make_aware

from core.models.preferences import Preferences
from geohosting.models.subscription import Subscription
from geohosting.utils.paystack import (
    cancel_subscription as cancel_paystack_subscription,
    get_subscription as get_paystack_subscription_detail,
    get_payment_method_detail as get_paystack_payment_method_detail
)
from geohosting.utils.stripe import (
    cancel_subscription as cancel_stripe_subscription,
    get_subscription as get_stripe_subscription_detail,
    get_payment_method_detail as get_stripe_payment_method_detail
)

User = get_user_model()


class CardDetail:
    """Card Detail."""

    def __init__(
            self,
            last4: str,
            exp_month: int,
            exp_year: int,
            brand: str
    ):
        self.last4 = last4
        self.exp_month = exp_month
        self.exp_year = exp_year
        self.brand = brand

    @property
    def json(self):
        return {
            'last4': self.last4,
            'exp_month': self.exp_month,
            'exp_year': self.exp_year,
            'brand': self.brand
        }


class AddressDetail:
    """Address Detail."""

    def __init__(
            self,
            city: str,
            country: str,
            line1: float,
            line2: float,
            postal_code: float,
            state: float,
    ):
        self.city = city
        self.country = country
        self.line1 = line1
        self.line2 = line2
        self.postal_code = postal_code
        self.state = state

    @property
    def json(self):
        return {
            'city': self.city,
            'country': self.country,
            'line1': self.line1,
            'line2': self.line2,
            'postal_code': self.postal_code,
            'state': self.state,
        }


class BillingDetail:
    """Billing data."""

    name: str = None
    email: str = None
    billing_type: str = None
    address: AddressDetail = None
    card: CardDetail = None

    def __init__(self, email: str, name: str):
        self.name = name
        self.email = email

    def set_billing_detail_type_card(
            self,
            city, country, line1, line2, postal_code, state,
            last4, exp_month, exp_year, brand
    ):
        self.billing_type = 'card'
        self.address = AddressDetail(
            city=city,
            country=country,
            line1=line1,
            line2=line2,
            postal_code=postal_code,
            state=state,
        )
        self.card = CardDetail(
            last4=last4,
            exp_month=exp_month,
            exp_year=exp_year,
            brand=brand
        )

    @property
    def json(self):
        return {
            'name': self.name,
            'email': self.email,
            'billing_type': self.billing_type,
            'address': (
                self.address.json if self.address else None
            ),
            'card': (
                self.card.json if self.card else None
            )
        }


class SubscriptionData:
    """Subscription data."""

    billing_detail: BillingDetail = None

    def __init__(
            self,
            id: str,
            customer_id: str,
            current_period_start: float,
            current_period_end: float,
            canceled: bool,
            currency: str,
            period: str,
            amount: int
    ):
        self.id = id
        self.customer_id = customer_id
        self.current_period_start = current_period_start
        self.current_period_end = current_period_end
        self.canceled = canceled
        self.currency = currency
        self.period = period
        self.amount = amount / 100

        pref = Preferences.load()
        self.current_expiry_at = datetime.fromtimestamp(
            self.current_period_end
        ) + timedelta(
            days=pref.grace_period_days
        )

    @property
    def json(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'current_period_start': datetime.fromtimestamp(
                self.current_period_start
            ).strftime(
                '%Y-%m-%d %H:%M:%S %Z'
            ),
            'current_period_end': datetime.fromtimestamp(
                self.current_period_end
            ).strftime(
                '%Y-%m-%d %H:%M:%S %Z'
            ),
            'current_expiry_at': self.current_expiry_at.strftime(
                '%Y-%m-%d %H:%M:%S %Z'
            ),
            'canceled': self.canceled,
            'billing_detail': (
                self.billing_detail.json if self.billing_detail else None
            ),
            'currency': self.currency.upper(),
            'period': self.period.capitalize(),
            'amount': self.amount,
        }


class SubscriptionGateway:
    """Subscription Gateway."""

    def __init__(self, subscription_id):
        self.subscription_id = subscription_id

    def payment_method(self) -> str:
        """Subscription method."""
        raise NotImplementedError

    def cancel_subscription(self):
        """Get subscription id."""
        raise NotImplementedError

    def _get_subscription_data(
            self, return_payment: bool = None
    ) -> SubscriptionData | None:
        """Get subscription data."""
        raise NotImplementedError

    def save_to_subscription(
            self, subscription_data: SubscriptionData, subscriber: User = None
    ):
        """Save to subscription."""
        current_period_start = make_aware(
            datetime.fromtimestamp(
                subscription_data.current_period_start
            )
        )
        current_period_end = make_aware(
            datetime.fromtimestamp(
                subscription_data.current_period_end
            )
        )
        subscription, _ = Subscription.objects.get_or_create(
            subscription_id=subscription_data.id,
            defaults={
                'customer': subscriber,
                'customer_payment_id': subscription_data.customer_id,
                'payment_method': self.payment_method(),
                'current_period_start': current_period_start,
                'current_period_end': current_period_end,
                'is_active': not subscription_data.canceled
            }
        )
        subscription.customer_payment_id = subscription_data.customer_id
        subscription.current_period_start = current_period_start
        subscription.current_period_end = current_period_end
        subscription.is_active = not subscription_data.canceled
        subscription.save()
        return subscription

    def subscription(self, subscriber: User) -> Subscription | None:
        """Get subscription id."""
        subscription_data = self._get_subscription_data()
        if not subscription_data:
            return None
        return self.save_to_subscription(subscription_data, subscriber)

    def get_subscription_data(self) -> SubscriptionData | None:
        """Get subscription data."""
        subscription_data = self._get_subscription_data(return_payment=True)
        if not subscription_data:
            return None
        self.save_to_subscription(subscription_data)
        return subscription_data


class StripeSubscriptionGateway(SubscriptionGateway):
    """Stripe Subscription Gateway."""

    def payment_method(self) -> str:
        """Subscription method."""
        from geohosting.models.data_types import PaymentMethod
        return PaymentMethod.STRIPE

    def cancel_subscription(self):
        """Cancel subscription."""
        cancel_stripe_subscription(self.subscription_id)

    def _get_subscription_data(
            self, return_payment: bool = None
    ) -> SubscriptionData | None:
        """Get subscription data."""
        subscription = get_stripe_subscription_detail(self.subscription_id)
        if not subscription:
            return None
        subscription_data = SubscriptionData(
            id=subscription['id'],
            customer_id=subscription['customer'],
            current_period_start=subscription['current_period_start'],
            current_period_end=subscription['current_period_end'],
            canceled=True if subscription['canceled_at'] else False,
            currency=subscription['plan']['currency'],
            period=subscription['plan']['interval'],
            amount=subscription['plan']['amount']
        )
        if return_payment:
            try:
                payment_method_detail = get_stripe_payment_method_detail(
                    subscription
                )
                if payment_method_detail['type'] == 'card':
                    billing_detail = payment_method_detail['billing_details']
                    address = billing_detail['address']
                    card = payment_method_detail['card']
                    billing_detail = BillingDetail(
                        name=billing_detail['name'],
                        email=billing_detail['email']
                    )
                    billing_detail.set_billing_detail_type_card(
                        city=address['city'],
                        country=address['country'],
                        line1=address['line1'],
                        line2=address['line2'],
                        postal_code=address['postal_code'],
                        state=address['state'],
                        last4=card['last4'],
                        exp_month=card['exp_month'],
                        exp_year=card['exp_year'],
                        brand=card['brand']
                    )
                    subscription_data.billing_detail = billing_detail
            except Exception:
                pass
        return subscription_data


class PaystackSubscriptionGateway(SubscriptionGateway):
    """Paystack Subscription Gateway."""

    def payment_method(self) -> str:
        """Subscription method."""
        from geohosting.models.data_types import PaymentMethod
        return PaymentMethod.PAYSTACK

    def cancel_subscription(self):
        """Cancel subscription."""
        cancel_paystack_subscription(self.subscription_id)

    def _get_subscription_data(
            self, return_payment: bool = None
    ) -> SubscriptionData | None:
        """Get subscription data."""
        subscription = get_paystack_subscription_detail(self.subscription_id)
        if not subscription:
            return None
        current_period_start = datetime.fromisoformat(
            subscription['createdAt'].replace('Z', '+00:00')
        ).timestamp()
        current_period_end = datetime.fromisoformat(
            subscription['next_payment_date'].replace('Z', '+00:00')
        ).timestamp()
        status = subscription['status']

        subscription_data = SubscriptionData(
            id=subscription['id'],
            customer_id=subscription['customer']['customer_code'],
            current_period_start=current_period_start,
            current_period_end=current_period_end,
            canceled=(
                    status in ['cancel', 'cancelled', 'non-renewing']
            ),
            amount=subscription['plan']['amount'],
            currency=subscription['plan']['currency'],
            period=subscription['plan']['interval'],
        )
        if return_payment:
            try:
                card = get_paystack_payment_method_detail(
                    self.subscription_id
                )
                name = []
                if subscription['customer']['first_name']:
                    name.append(subscription['customer']['first_name'])
                if subscription['customer']['first_name']:
                    name.append(subscription['customer']['first_name'])
                billing_detail = BillingDetail(
                    name=' '.join(name),
                    email=subscription['customer']['email']
                )
                billing_detail.set_billing_detail_type_card(
                    city='',
                    country='',
                    line1='',
                    line2='',
                    postal_code='',
                    state='',
                    last4=card['last4'],
                    exp_month=card['exp_month'],
                    exp_year=card['exp_year'],
                    brand=card['card_type']
                )
                subscription_data.billing_detail = billing_detail
            except Exception:
                pass
        return subscription_data
