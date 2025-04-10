from rest_framework import serializers

from geohosting.models.sales_order import SalesOrder


class PaymentSerializer(serializers.ModelSerializer):
    """Payment serializer."""

    class Meta:
        model = SalesOrder
        fields = '__all__'
