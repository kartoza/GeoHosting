from rest_framework import mixins, viewsets

from geohosting.models.sales_order import SalesOrder
from geohosting.serializer.sales_order import (
    SalesOrderSerializer, SalesOrderDetailSerializer
)


class SalesOrderSetView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SalesOrderDetailSerializer
        return SalesOrderSerializer

    def get_queryset(self):
        """Return querysets."""
        if self.request.user.id:
            return SalesOrder.objects.filter(customer_id=self.request.user.id)
        return SalesOrder.objects.none()

    def get_object(self):
        """Get object."""
        obj = super().get_object()
        obj.update_payment_status()
        return obj
