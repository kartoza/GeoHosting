# coding=utf-8
"""
Geohosting.

.. note:: Factory classes for Product
"""
import factory
from factory.django import DjangoModelFactory

from core.factories import UserFactory
from geohosting.factories.package import PackageFactory
from geohosting.models import SalesOrder
from geohosting.models.sales_order import SalesOrderErpCompany


class SalesOrderFactory(DjangoModelFactory):
    """Factory class for SalesOrder model."""

    class Meta:  # noqa
        model = SalesOrder

    package = factory.SubFactory(PackageFactory)
    customer = factory.SubFactory(UserFactory)


class SalesOrderErpCompanyFactory(DjangoModelFactory):
    """Factory class for SalesOrderErpCompany model."""

    class Meta:  # noqa
        model = SalesOrderErpCompany

    erp_company = factory.Sequence(
        lambda n: f'observation-type-{n}'
    )
