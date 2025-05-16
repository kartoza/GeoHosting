from django.contrib import admin

from geohosting.models import PackageGroup, Package


@admin.action(description="Create stripe price")
def create_stripe_price(modeladmin, request, queryset):
    for package in queryset:
        package.get_stripe_price_id()


@admin.action(description="Create paystack price")
def create_paystack_price(modeladmin, request, queryset):
    for package in queryset:
        package.get_paystack_price_id()


@admin.register(PackageGroup)
class PackageGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'package_code')
    list_editable = ('package_code',)


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
            None, {
                'fields': ('product', 'name', 'created_at', 'updated_at')
            }
        ),
        (
            'ERP', {
                'fields': ('erpnext_code', 'erpnext_item_code')
            }
        ),
        (
            'Price', {
                'fields': ('currency', 'price', 'price_list', 'periodicity')
            }
        ),
        (
            'Detail', {
                'fields': ('feature_list', 'order', 'package_group'),
            }
        ),
        (
            'Subscription', {
                'fields': ('stripe_id', 'paystack_id'),
            }
        )
    )
