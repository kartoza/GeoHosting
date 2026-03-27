from rest_framework import serializers

from geohosting.models import (
    Product, ProductMedia, PackageGroup,
    Package, ProductMetadata, Region, ProductCluster
)


class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'


class PackageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageGroup
        fields = '__all__'


class ProductPackageSerializer(serializers.ModelSerializer):
    package_group = PackageGroupSerializer(read_only=True)

    class Meta:
        model = Package
        fields = '__all__'


class ProductMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMetadata
        fields = ['key', 'value']


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'order', 'upstream_id',
            'description', 'image', 'available'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductMediaSerializer(many=True, read_only=True)
    packages = serializers.SerializerMethodField()
    product_meta = serializers.SerializerMethodField()
    domain = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.currency = kwargs.pop('currency', None)
        super().__init__(*args, **kwargs)

    def get_packages(self, obj: Product):
        if self.currency:
            currency = self.currency
        else:
            currency = 'USD'

        return ProductPackageSerializer(
            obj.packages.filter(
                currency=currency).filter(
                enabled=True).order_by('package_group__package_code'),
            many=True
        ).data

    def get_product_meta(self, obj: Product):
        metadata = ProductMetadata.objects.filter(product=obj)
        return ProductMetadataSerializer(metadata, many=True).data

    def get_domain(self, obj: Product):
        """Return domain of product."""
        try:
            return obj.get_product_cluster(
                Region.default_region()
            ).cluster.domain
        except ProductCluster.DoesNotExist:
            return None

    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'product_meta': {'source': 'get_product_meta'}
        }
