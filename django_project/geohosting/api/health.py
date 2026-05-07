"""Health check APIs."""
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models.preferences import Preferences


class BaseHealthView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser)

    def result(self, value: str):
        ok = value == 'OK'
        return Response(
            {'status': value},
            status=200 if ok else 503
        )


class ErpHealthView(BaseHealthView):
    def get(self, request):
        return self.result(Preferences.load().erp_next_test)


class ProxyHealthView(BaseHealthView):
    def get(self, request):
        return self.result(Preferences.load().proxy_test)


class StripeHealthView(BaseHealthView):
    def get(self, request):
        return self.result(Preferences.load().stripe_test)


class PaystackHealthView(BaseHealthView):
    def get(self, request):
        return self.result(Preferences.load().paystack_test)


class VaultHealthView(BaseHealthView):
    def get(self, request):
        return self.result(Preferences.load().vault_test)