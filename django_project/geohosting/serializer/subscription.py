# serializers.py
from rest_framework import serializers

from geohosting.models.subscription import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    """Subscription serializer."""

    class Meta:
        model = Subscription
        fields = '__all__'
