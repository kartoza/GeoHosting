from django.contrib import admin

from geohosting.models import (
    Product, ProductMetadata, ProductMedia, ProductCluster
)


class ProductClusterInline(admin.TabularInline):
    model = ProductCluster
    extra = 1


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 1


class ProductMetadataInline(admin.TabularInline):
    model = ProductMetadata
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    change_list_template = 'admin/product_change_list.html'
    list_display = (
        'name', 'available', 'clusters', 'vault_url'
    )
    search_fields = ('name', 'upstream_id')
    list_editable = ('vault_url', 'available')
    inlines = [ProductClusterInline, ProductMediaInline, ProductMetadataInline]

    def clusters(self, obj: Product):
        """Return clusters."""
        return ', '.join(
            obj.productcluster_set.values_list('cluster__code', flat=True)
        )
