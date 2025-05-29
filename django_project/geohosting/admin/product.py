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


@admin.action(description="Sync media")
def sync_media(modeladmin, request, queryset):
    for package in queryset:
        package.sync_media()


@admin.action(description="Sync metadata")
def sync_metadata(modeladmin, request, queryset):
    from geohosting_controller.default_data.helper import sync_product_metadata
    sync_product_metadata()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    change_list_template = 'admin/product_change_list.html'
    list_display = (
        'name', 'available', 'is_add_on', 'clusters', 'vault_path'
    )
    search_fields = ('name', 'upstream_id')
    filter_horizontal = ('add_on',)
    list_editable = ('vault_path', 'available', 'is_add_on')
    inlines = [ProductClusterInline, ProductMediaInline, ProductMetadataInline]
    actions = [sync_media, sync_metadata]

    def clusters(self, obj: Product):
        """Return clusters."""
        return ', '.join(
            obj.productcluster_set.values_list('cluster__code', flat=True)
        )
