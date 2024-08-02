"""Checkout API."""

import stripe
from django.http import HttpResponseServerError, HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from geohosting.models import Package
from geohosting.models.sales_order import SalesOrder


class CheckoutStripeSessionAPI(APIView):
    """API creating stripe checkout session."""

    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        """Post to create checkout session."""
        package = get_object_or_404(Package, pk=pk)
        price_id = package.get_stripe_price_id()
        domain = request.build_absolute_uri('/')
        try:
            order = SalesOrder.objects.create(
                package=package,
                customer=request.user
            )
            checkout_session = stripe.checkout.Session.create(
                customer_email=request.user.email,
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=(
                    f'{domain}#/dashboard/orders/{order.id}'
                ),
                cancel_url=f'{domain}#/checkout'
            )
            order.stripe_id = checkout_session.id
            order.save()
            return HttpResponse(checkout_session.url)
        except Exception as e:
            return HttpResponseServerError(f'{e}')
