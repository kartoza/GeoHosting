"""
GeoHosting.

.. note:: User serializer.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from geohosting.models import UserProfile, UserBillingInformation
from geohosting.serializer.billing_information import (
    BillingInformationSerializer
)

User = get_user_model()


class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class UserProfileSerializer(serializers.ModelSerializer):
    """User Profile serializer."""

    class Meta:  # noqa: D106
        model = UserProfile
        exclude = ('erpnext_code', 'reset_token', 'user', 'id')


class UserBillingInformationSerializer(BillingInformationSerializer):
    """User UserBillingInformation serializer."""

    class Meta:  # noqa: D106
        model = UserBillingInformation
        exclude = ('id',)


class UserSerializer(serializers.ModelSerializer):
    """User serializer."""

    profile = serializers.SerializerMethodField()
    billing_information = serializers.SerializerMethodField()

    def get_profile(self, user: User):
        """Return profile."""
        return UserProfileSerializer(user.userprofile).data

    def get_billing_information(self, user: User):
        """Return UserBillingInformation."""
        country_name = ""
        try:
            billing_information = user.userbillinginformation
        except UserBillingInformation.DoesNotExist:
            billing_information = UserBillingInformation.objects.create(
                user=user
            )
        try:
            country_name = billing_information.country.name
        except Exception as e:
            pass
        billing_information = UserBillingInformationSerializer(
            billing_information
        ).data
        billing_information['country_name'] = country_name
        return billing_information

    class Meta:  # noqa: D106
        model = User
        fields = (
            'first_name', 'last_name', 'email', 'profile',
            'billing_information'
        )
