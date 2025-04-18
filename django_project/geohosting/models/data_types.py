CUSTOMER_GROUP = 'GeoHosting'


class PaymentMethod:
    """Payment method."""

    STRIPE = 'Stripe'
    PAYSTACK = 'Paystack'

    choices = (
        (STRIPE, STRIPE),
        (PAYSTACK, PAYSTACK)
    )
    default_choice = STRIPE
