"""Payment API."""

import stripe
from django.conf import settings
from django.http import HttpResponseServerError, JsonResponse
from django.shortcuts import get_object_or_404
from paystackapi.paystack import Paystack
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from geohosting.models import Instance
from geohosting.models.sales_order import PaymentMethod
from geohosting_event.models.log import LogTracker

paystack = Paystack(secret_key=settings.PAYSTACK_SECRET_KEY)


class PaymentChangeAPI(APIView):
    """API for updating payment details."""

    permission_classes = (IsAuthenticated,)

    @property
    def payment_method(self):
        """Return payment method."""
        raise NotImplemented

    def create_payload(
            self, email, instance: Instance, callback_url
    ) -> (int, str):
        """Create payload of data from gateway.

        Return id of payment and string of challenge.
        """
        raise NotImplemented

    def post(self, request, pk):
        """Post to create checkout session."""
        instance = get_object_or_404(Instance, pk=pk)
        if not instance.subscription:
            return HttpResponseServerError(
                'This instance does not have subscription, '
                'please check with admin'
            )

        try:
            _id, payload = self.create_payload(
                request.user.email, instance, request.data['url']
            )
            return JsonResponse({
                "url": payload,
                "success_url": request.data['url']
            })
        except Exception as e:
            LogTracker.error(instance, f'{e}')
            return HttpResponseServerError(f'{e}')


class PaymentStripeChangeAPI(PaymentChangeAPI):
    """API creating stripe change payment session."""

    payment_method = PaymentMethod.STRIPE

    def create_payload(
            self, email, instance: Instance, callback_url
    ) -> (int, str):
        """Create payload of data from gateway.

        Return id of payment and string of challenge.
        """
        session = stripe.billing_portal.Session.create(
            customer=instance.subscription.customer_payment_id,
            return_url=callback_url,
        )
        return session.id, session.url
