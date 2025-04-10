from rest_framework import serializers

from geohosting.models import Instance, SalesOrder
from geohosting.models.activity import Activity
from geohosting.serializer.payment import PaymentSerializer
from geohosting.serializer.product import (
    ProductPackageSerializer,
    ProductDetailSerializer
)


class InstanceSerializer(serializers.ModelSerializer):
    """Sales instance serializer."""

    url = serializers.SerializerMethodField()
    package = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()

    class Meta:
        model = Instance
        fields = '__all__'

    def get_url(self, obj: Instance):
        """Return url."""
        return obj.url

    def get_package(self, obj: Instance):
        """Return package."""
        return ProductPackageSerializer(obj.price).data

    def get_product(self, obj: Instance):
        """Return product."""
        return ProductDetailSerializer(obj.price.product).data


class InstanceDetailSerializer(InstanceSerializer):
    """Sales instance detail serializer."""

    sales_order = serializers.SerializerMethodField()

    def get_sales_order(self, obj: Instance):
        """Return sales_order."""
        # We update sales order
        for activity in Activity.objects.filter(
                sales_order__instance__isnull=True
        ):
            activity.update_sales_order()

        try:
            return PaymentSerializer(
                obj.salesorder_set.all().first()
            ).data
        except SalesOrder.DoesNotExist:
            return None
