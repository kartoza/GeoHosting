"""Utility functions for working with paystack."""
from decimal import Decimal

from django.conf import settings
from paystackapi.paystack import Paystack
from paystackapi.plan import Plan
from paystackapi.subscription import Subscription
from paystackapi.transaction import Transaction

paystack = Paystack(secret_key=settings.PAYSTACK_SECRET_KEY)


def test_connection():
    """Test connection to Paystack API."""
    response = Plan.list()
    if not response['status']:
        raise ConnectionError(response['message'])


def create_paystack_price(
        name: str, currency: str, amount: Decimal, interval: str,
        features: list, metadata: dict = None
) -> str:
    """Create a paystack object.

    :rtype: str
    :return: Paystack price id
    """
    plans = [
        plan for plan in Plan.list()['data'] if
        not plan['is_deleted'] and not plan['is_archived']
    ]
    for plan in plans:
        if plan['name'] == name:
            return plan

    price = float(amount * 100)
    if metadata:
        price = metadata["discounted_amount"]
    response = Plan.create(
        name=name,
        description=f'Features: {features}',
        amount=price,
        interval=interval,
        currency=currency
    )
    if not response['status']:
        raise Exception(response['message'])
    return response['data']


def verify_paystack_payment(reference):
    """Return if the reference is valid."""
    return Transaction.verify(reference)


def get_subscription_detail_from_payment(reference):
    """Get subscription."""
    try:
        transaction = verify_paystack_payment(reference)
        customer = transaction['data']['customer']['id']
        plan = transaction['data']['plan_object']['id']
        authorization_code = transaction['data']['authorization'][
            'authorization_code'
        ]
        # Fetch subscriptions for the customer
        subscriptions = Subscription.list(
            customer=customer, plan=plan
        )

        for subscription in subscriptions['data']:
            if subscription['authorization'][
                'authorization_code'] == authorization_code:
                return subscription
        return None
    except Exception:
        return None


def get_subscription(subscription_id):
    """Get subscription."""
    from geohosting.models.sales_order import SalesOrder
    subscription = Subscription.fetch(subscription_id)
    if not subscription:
        raise AttributeError('Subscription not found')
    data = subscription['data']
    try:
        transaction = {}
        try:
            sales_order = SalesOrder.objects.get(
                subscription__subscription_id=subscription_id
            )
            if float(sales_order.package.price) * 100 != data[
                'plan']['amount']:
                transaction = Transaction.verify(
                    sales_order.payment_id
                )['data']
        except SalesOrder.DoesNotExist:
            transaction = Transaction.list(
                perPage=1, plan=data['plan']['plan_code']
            )['data'][0]
        if transaction["metadata"]:
            data["metadata"] = transaction["metadata"]
    except (KeyError, IndexError):
        pass
    return data


def get_payment_method_detail(subscription_id):
    """Payment method detail."""
    subscription = Subscription.fetch(subscription_id)
    return subscription['data']['authorization']


def cancel_subscription(subscription_id):
    """Cancel subscription."""
    subscription = get_subscription(subscription_id)
    Subscription.disable(
        code=subscription['subscription_code'],
        token=subscription['email_token'],
    )
