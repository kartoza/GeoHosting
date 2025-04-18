# serializers.py
from django.utils.timezone import localtime
from rest_framework import serializers

from geohosting.models.subscription import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    """Subscription serializer."""

    current_period_start = serializers.SerializerMethodField()
    current_period_end = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_current_period_start(self, obj: Subscription):
        """Return current_period_start."""
        return localtime(obj.current_period_start).strftime(
            '%Y-%m-%d %H:%M:%S %Z'
        )

    def get_current_period_end(self, obj: Subscription):
        """Return current_period_end."""
        return localtime(obj.current_period_end).strftime(
            '%Y-%m-%d %H:%M:%S %Z'
        )
