import json

from core.settings.utils import absolute_path
from geohosting.models.cluster import Cluster
from geohosting.models.region import Region


def get_jenkin_activity_types() -> dict:
    """Return jenkins activity types by product name."""
    return json.loads(
        open(
            absolute_path(
                'geohosting_controller', 'default_data',
                'jenkins_activity_type.json'
            )
        ).read()
    )


def get_regions() -> dict:
    """Return regions."""
    return json.loads(
        open(
            absolute_path(
                'geohosting_controller', 'default_data',
                'region.json'
            )
        ).read()
    )


def generate_regions():
    """Generate regions data."""
    regions = get_regions()
    for region in regions:
        Region.objects.update_or_create(
            code=region['code'],
            defaults={
                'name': region['name'],
            }
        )


def get_clusters() -> dict:
    """Return clusters."""
    return json.loads(
        open(
            absolute_path(
                'geohosting_controller', 'default_data',
                'cluster.json'
            )
        ).read()
    )


def generate_cluster():
    """Generate clusters data."""
    clusters = get_clusters()
    for cluster in clusters:
        try:
            Cluster.objects.update_or_create(
                code=cluster['code'],
                region=Region.objects.get(code=cluster['region']),
                defaults={
                    'domain': cluster['domain'],
                }
            )
        except Region.DoesNotExist:
            pass


def get_product_clusters() -> dict:
    """Return product_clusters."""
    return json.loads(
        open(
            absolute_path(
                'geohosting_controller', 'default_data',
                'product_cluster.json'
            )
        ).read()
    )


def get_product_metadata() -> dict:
    """Return product_clusters."""
    return json.loads(
        open(
            absolute_path(
                'geohosting_controller', 'default_data',
                'product.json'
            )
        ).read()
    )


def sync_product_metadata():
    """Sync product metadata."""
    from geohosting.models.product import Product
    data = get_product_metadata()
    if Product.objects.count() == 0:
        return

    for key, value in data.items():
        product, _ = Product.objects.get_or_create(
            upstream_id=key,
            defaults={
                "name": key.title()
            }
        )
        product.is_add_on = value['is_add_on']
        if product.url_as_addon is None:
            product.url_as_addon = value['url_as_addon']
        if product.vault_path is None:
            product.vault_path = value['vault_path']
        if product.username_credential is None:
            product.username_credential = value['username_credential']
        if product.password_key_on_vault is None:
            product.password_key_on_vault = value['password_key_on_vault']
        product.save()

        for add_on in value.get('add_on', []):
            try:
                product.add_on.add(
                    Product.objects.get(upstream_id=add_on),
                )
            except Product.DoesNotExist:
                pass
