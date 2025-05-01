from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from core.api import FilteredAPI
from geohosting.models.subscription import Subscription
from geohosting.serializer.subscription import (
    SubscriptionSerializer
)


class SubscriptionSetView(
    FilteredAPI,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    permission_classes = (IsAuthenticated,)
    default_query_filter = []

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SubscriptionSerializer
        return SubscriptionSerializer

    def get_queryset(self):
        """Return querysets."""
        query = Subscription.objects.filter(customer_id=self.request.user.id)
        return self.filter_query(self.request, query).order_by(
            '-current_period_end'
        )
