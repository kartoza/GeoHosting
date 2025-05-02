from rest_framework import serializers

from geohosting.models import Instance
from geohosting.serializer.product import (
    ProductPackageSerializer,
    ProductDetailSerializer
)


class InstanceSerializer(serializers.ModelSerializer):
    """Sales instance serializer."""

    url = serializers.SerializerMethodField()
    package = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()

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

    def get_subscription(self, obj: Instance):
        """Return subscription."""
        from geohosting.serializer.subscription import (
            SubscriptionSerializer
        )
        if not obj.subscription:
            return None

        return SubscriptionSerializer(obj.subscription).data
