"""Subscription API."""

import stripe
from django.conf import settings
from django.http import (
    HttpResponseServerError, JsonResponse, HttpResponseForbidden
)
from django.shortcuts import get_object_or_404
from paystackapi.paystack import Paystack
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from geohosting.models import Subscription
from geohosting_event.models.log import LogTracker

paystack = Paystack(secret_key=settings.PAYSTACK_SECRET_KEY)


class SubscriptionChangeAPI(APIView):
    """API for updating Subscription details."""

    permission_classes = (IsAuthenticated,)

    def create_payload(
            self, subscription: Subscription, callback_url
    ) -> (int, str):
        """Create payload of data from gateway.

        Return id of Subscription and string of challenge.
        """
        raise NotImplemented

    def post(self, request, pk):
        """Post to create checkout session."""
        subscription = get_object_or_404(Subscription, pk=pk)
        if subscription.customer != request.user:
            return HttpResponseForbidden()
        try:
            _id, payload = self.create_payload(
                subscription, request.data['url']
            )
            return JsonResponse({
                "url": payload,
                "success_url": request.data['url']
            })
        except Exception as e:
            LogTracker.error(subscription, f'{e}')
            return HttpResponseServerError(f'{e}')


class SubscriptionStripeChangeAPI(SubscriptionChangeAPI):
    """API creating stripe change Subscription session."""

    def create_payload(
            self, subscription: Subscription, callback_url
    ) -> (int, str):
        """Create payload of data from gateway.

        Return id of subscription and string of challenge.
        """
        session = stripe.billing_portal.Session.create(
            customer=subscription.customer_payment_id,
            return_url=callback_url,
        )
        return session.id, session.url
