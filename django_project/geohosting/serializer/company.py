"""
GeoHosting.

.. note:: User serializer.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from geohosting.models import CompanyBillingInformation, Company
from geohosting.serializer.billing_information import (
    BillingInformationSerializer
)

User = get_user_model()


class CompanyBillingInformationSerializer(BillingInformationSerializer):
    """Company UserBillingInformation serializer."""

    tax_number = serializers.CharField(required=True)

    class Meta:  # noqa: D106
        model = CompanyBillingInformation
        exclude = ('id',)


class CompanyBillingInformationCheckerSerializer(
    CompanyBillingInformationSerializer
):
    """Company UserBillingInformation serializer for checking."""

    class Meta:  # noqa: D106
        model = CompanyBillingInformation
        exclude = ('id', 'company')


class CompanySerializer(serializers.ModelSerializer):
    """Company serializer."""

    email = serializers.EmailField(required=True)

    class Meta:  # noqa: D106
        model = Company
        fields = ('id', 'name', 'email')


class CompanyDetailSerializer(serializers.ModelSerializer):
    """Company serializer."""

    billing_information = serializers.SerializerMethodField()

    def get_billing_information(self, company: Company):
        """Return CompanyBillingInformation."""
        country_name = ""
        try:
            billing_information = company.companybillinginformation
        except CompanyBillingInformation.DoesNotExist:
            billing_information = CompanyBillingInformation.objects.create(
                user=company
            )
        try:
            country_name = billing_information.country.name
        except Exception as e:
            pass
        billing_information = CompanyBillingInformationSerializer(
            billing_information
        ).data
        billing_information['country_name'] = country_name
        return billing_information

    class Meta:  # noqa: D106
        model = Company
        fields = (
            'id', 'name', 'email', 'billing_information'
        )
