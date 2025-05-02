"""Utility functions for working with stripe."""
from decimal import Decimal

import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


def test_connection():
    """Test connection to Stripe API."""
    stripe.Customer.list()['data']


def create_stripe_price(
        name: str, currency: str, amount: Decimal, interval: str,
        features: list
) -> str:
    """Create a stripe object.

    :rtype: str
    :return: Stripe price id
    """
    prices = stripe.Price.list(limit=3, lookup_keys=[name]).data
    try:
        price = prices[0]
    except IndexError:
        price = stripe.Price.create(
            currency=currency,
            unit_amount_decimal=amount * 100,
            lookup_key=name,
            recurring={
                "interval": interval
            },
            product_data={
                "name": name
            },
        )

    try:
        for feature in features:
            if not feature:
                continue
            try:
                feature = stripe.entitlements.Feature.list(
                    lookup_key=feature
                ).data[0]
            except IndexError:
                feature = stripe.entitlements.Feature.create(
                    name=feature,
                    lookup_key=feature
                )
            try:
                stripe.Product.create_feature(
                    price.product,
                    entitlement_feature=feature,
                )
            except stripe._error.InvalidRequestError:
                pass
    except (KeyError, ValueError):
        pass
    return price.id


def get_checkout_detail(checkout_id):
    """Return checkout checkout detail."""
    try:
        return stripe.checkout.Session.retrieve(checkout_id)
    except Exception:
        return None


def get_subscription_detail_from_payment(checkout_id):
    """Return subscription detail."""
    try:
        session = stripe.checkout.Session.retrieve(checkout_id)
        return stripe.Subscription.retrieve(session['subscription'])
    except Exception:
        return None


def get_subscription(subscription_id):
    """Get subscription."""
    subscription = stripe.Subscription.retrieve(
        subscription_id
    )
    if not subscription:
        raise AttributeError('Subscription not found')
    return subscription


def get_payment_method_detail(subscription):
    """Payment method detail."""
    customer = stripe.Customer.retrieve(subscription['customer'])

    # This is if customer has default payment method
    if customer.invoice_settings.default_payment_method:
        payment_method = stripe.PaymentMethod.retrieve(
            customer.invoice_settings.default_payment_method
        )
        payment_method.billing_details.name = customer.name
        payment_method.billing_details.email = customer.email
        return payment_method

    # This just check last invoice
    invoice = stripe.Invoice.retrieve(subscription.latest_invoice)
    payment_intent = stripe.PaymentIntent.retrieve(invoice.payment_intent)
    return stripe.PaymentMethod.retrieve(payment_intent.payment_method)


def cancel_subscription(subscription_id):
    """Cancel subscription."""
    stripe.Subscription.modify(
        subscription_id, cancel_at_period_end=True
    )
