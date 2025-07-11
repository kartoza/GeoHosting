from rest_framework import serializers

from geohosting.models import Country


class BillingInformationSerializer(serializers.ModelSerializer):
    """User UserBillingInformation serializer."""

    country = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        required=True  # or False if optional
    )
    name = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    postal_code = serializers.CharField(required=True)
