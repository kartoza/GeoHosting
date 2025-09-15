# coding=utf-8
"""
GeoHosting Controller.

.. note:: Load data
"""

from django.core.management.base import BaseCommand

from core.models.preferences import Preferences, SiteType
from geohosting.models import (
    ErpCompany, Product, Cluster, PackageGroup, Package, Country
)
from geohosting.models.data_types import PaymentMethod
from geohosting.views.products import fetch_products_from_erpnext


class Command(BaseCommand):
    """Command to load data."""

    help = 'Load all data'

    def handle(self, *args, **options):
        """Handle load data."""
        # ERP Company
        ErpCompany.sync_data()
        try:
            ErpCompany.objects.filter(
                erpnext_code__icontains='(Pty) Ltd').update(
                payment_method=PaymentMethod.PAYSTACK
            )
        except ErpCompany.DoesNotExist:
            pass

        # Product
        fetch_products_from_erpnext()
        for product in Product.objects.all():
            product.sync_media()
        for product in Product.objects.all():
            if product.name.lower() == 'geoserver':
                product.vault_path = '/geohosting/geoserver/geoserver-creds-'
            elif product.name.lower() == 'geonode':
                product.vault_path = '/geohosting/geonode/geonode-creds-'
            elif product.name.lower() == 'g3w':
                product.vault_path = '/geohosting/g3wsuite/g3wsuite-creds-'
            product.save()

        # Update cluster
        preferences = Preferences.load()
        cluster = Cluster.objects.first()
        if preferences.site_type == SiteType.PRODUCTION:
            cluster.vault_url = 'https://vault.do.kartoza.com/v1/apps/data/prd'
        elif preferences.site_type == SiteType.STAGING:
            cluster.vault_url = 'https://vault.do.kartoza.com/v1/apps/data/sta'
        cluster.save()

        # Update package group
        for group in PackageGroup.objects.all():
            if group.package_code and group.conf_github_path:
                continue

            name = group.name.lower()
            config_path = ''
            if 'geoserver' in name:
                config_path += 'gs-instance/gs-'
            elif 'geonode' in name:
                config_path += 'gn-instance/gn-'
            elif 'g3w' in name:
                config_path += 'gw-instance/gw-'

            if config_path:
                if preferences.site_type == SiteType.PRODUCTION:
                    config_path += 'prd-'
                elif preferences.site_type == SiteType.STAGING:
                    config_path += 'sta-'

                if 'small' in name:
                    group.package_code = '1'
                    config_path += '1-'
                elif 'medium' in name:
                    group.package_code = '2'
                    config_path += '2-'
                elif 'large' in name:
                    group.package_code = '3'
                    config_path += '3-'

                config_path += 'env.json'
                group.conf_github_path = config_path
                group.save()

        for package in Package.objects.all():
            if 'geohosting' not in package.price_list.lower():
                package.enabled = False
                package.save()

        Country.sync_data()
