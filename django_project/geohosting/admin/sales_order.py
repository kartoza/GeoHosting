from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.admin.global_function import (
    NoUpdateAdmin, sync_subscriptions, push_to_erp
)
from geohosting.models import SalesOrder, SalesOrderInvoice
from geohosting.models.agreement import SalesOrderAgreement
from geohosting_event.admin.log import LogTrackerObjectAdmin


class SalesOrderInvoiceInline(admin.TabularInline):
    model = SalesOrderInvoice
    readonly_fields = ('erpnext_code', 'invoice')

    def has_add_permission(self, request, obj):
        """Return add permission."""
        return False

    def has_delete_permission(self, request, obj):
        """Return delete permission."""
        return False


class SalesOrderAgreementInline(admin.TabularInline):
    model = SalesOrderAgreement
    readonly_fields = ('agreement_detail', 'name', 'created_at', 'file')

    def has_add_permission(self, request, obj):
        """Return add permission."""
        return False

    def has_delete_permission(self, request, obj):
        """Return delete permission."""
        return False


def update_payment_status(modeladmin, request, queryset):
    """Update order status."""
    for order in queryset.filter():
        order.update_payment_status()


@admin.action(description="Auto deploy")
def auto_deploy(modeladmin, request, queryset):
    for sales_order in queryset:
        sales_order.auto_deploy()


@admin.register(SalesOrder)
class SalesOrderAdmin(LogTrackerObjectAdmin, NoUpdateAdmin):
    list_display = (
        'date', 'package', 'customer', 'order_status', 'payment_method',
        'erpnext_code', 'app_name', 'subscription',
        'instance', 'activities', 'logs'
    )
    list_filter = ('order_status', 'payment_method',)
    search_fields = ('erpnext_code', 'instance__name')
    actions = [
        push_to_erp, update_payment_status,
        sync_subscriptions, auto_deploy
    ]
    readonly_fields = (
        'erpnext_code', 'package', 'customer', 'company',
        'date', 'delivery_date', 'instance',
        'app_name',
        'payment_method', 'payment_id', 'subscription', 'invoice'
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'erpnext_code', 'package', 'customer', 'company',
                    'date', 'delivery_date'
                )
            }
        ),
        (
            'Status',
            {
                'fields': ('order_status',)
            }
        ),
        (
            'Instance',
            {
                'fields': ('app_name', 'instance')
            }
        ),
        (
            'Subscription',
            {
                'fields': (
                    'payment_method', 'payment_id', 'subscription', 'invoice'
                )
            }
        )
    )
    inlines = (SalesOrderInvoiceInline, SalesOrderAgreementInline)

    def activities(self, obj: SalesOrder):
        """Return product."""
        return mark_safe(
            f'<a href="/admin/geohosting/activity/?'
            f'sales_order__id__exact={obj.id}" target="_blank"'
            f'>activities</a>'
        )
