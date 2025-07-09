import json

from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.models import PackageGroup, Package


def sync_specification(modeladmin, request, queryset):
    for package in queryset:
        package.sync_specification()


@admin.register(PackageGroup)
class PackageGroupAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'package_code', 'conf_github_path', 'get_specification_display'
    )
    list_editable = ('package_code', 'conf_github_path')
    actions = (sync_specification,)

    def get_specification_display(self, obj):
        """Return specification."""
        specification = obj.specification
        if specification:
            return mark_safe(
                f"<pre>{json.dumps(specification, indent=2)}</pre>"
            )
        return "-"

    get_specification_display.short_description = "Specification"


def create_stripe_price(modeladmin, request, queryset):
    for package in queryset:
        package.get_stripe_price_id()


def create_paystack_price(modeladmin, request, queryset):
    for package in queryset:
        package.get_paystack_price_id()


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'product', 'price', 'currency',
        'stripe_id', 'paystack_id', 'price_list', 'enabled'
    )
    search_fields = ('name', 'product__name')
    list_filter = ('enabled', 'product', 'price_list')
    list_editable = ('enabled',)
    actions = [create_stripe_price, create_paystack_price]
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (
            None,
            {
                'fields': ('product', 'name', 'created_at', 'updated_at')
            }
        ),
        (
            'ERP',
            {
                'fields': ('erpnext_code', 'erpnext_item_code')
            }
        ),
        (
            'Price',
            {
                'fields': ('currency', 'price', 'price_list', 'periodicity')
            }
        ),
        (
            'Detail',
            {
                'fields': ('feature_list', 'order', 'package_group'),
            }
        ),
        (
            'Subscription',
            {
                'fields': ('stripe_id', 'paystack_id'),
            }
        )
    )
