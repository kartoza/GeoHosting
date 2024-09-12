# coding=utf-8
"""
Geohosting.

.. note:: Factory classes for Package
"""
import factory
from factory.django import DjangoModelFactory

from geohosting.factories.product import ProductFactory
from geohosting.models import Package


class PackageFactory(DjangoModelFactory):
    """Factory class for Package model."""

    class Meta:  # noqa
        model = Package

    product = factory.SubFactory(ProductFactory)
    name = factory.Sequence(
        lambda n: f'package-{n}'
    )
    price = 100
