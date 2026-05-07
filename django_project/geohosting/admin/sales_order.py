from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.admin.global_function import (
    NoUpdateAdmin, sync_subscriptions, push_to_erp
)
from geohosting.models import SalesOrder, SalesOrderInvoice
from geohosting.models.agreement import SalesOrderAgreement
from geohosting.models.sales_order import SalesOrderAutoRepeat
from geohosting_event.admin.log import LogTrackerObjectAdmin
from geohosting_event.models import LogTracker


class SalesOrderAutoRepeatInline(admin.StackedInline):
    model = SalesOrderAutoRepeat
    readonly_fields = (
        'erpnext_code', 'frequency', 'repeat_on_day',
        'current_period_start', 'current_period_end',
        'notify_by_email', 'submit_on_creation',
    )
    extra = 0

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(SalesOrderAutoRepeat)
class SalesOrderAutoRepeatAdmin(LogTrackerObjectAdmin, NoUpdateAdmin):
    list_display = (
        'sales_order', 'erpnext_code', 'frequency',
        'repeat_on_day', 'current_period_start', 'current_period_end',
    )
    readonly_fields = (
        'sales_order', 'erpnext_code', 'frequency', 'repeat_on_day',
        'current_period_start', 'current_period_end',
        'notify_by_email', 'submit_on_creation',
    )
    actions = [push_to_erp]


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
        try:
            order.update_payment_status()
        except Exception as e:
            LogTracker.error(order, f'Update payment status: {str(e)}', e)


@admin.action(description="Auto deploy")
def auto_deploy(modeladmin, request, queryset):
    for sales_order in queryset:
        sales_order.auto_deploy()


@admin.register(SalesOrder)
class SalesOrderAdmin(LogTrackerObjectAdmin, NoUpdateAdmin):
    list_display = (
        'instance', '_subscription', 'invoice_id', 'customer', 'order_status',
        'payment_method',
        'erpnext_code', 'app_name', 'date', 'package',
        '_auto_repeat_code', 'activities', 'logs'
    )
    list_filter = ('order_status', 'payment_method', 'is_main_invoice')
    search_fields = ('erpnext_code', 'instance__name', 'customer__email')
    actions = [
        push_to_erp, update_payment_status,
        sync_subscriptions, auto_deploy
    ]
    readonly_fields = (
        'package', 'customer', 'company',
        'date', 'delivery_date', 'instance',
        'app_name',
        'payment_method', 'payment_id', 'subscription', 'invoice',
        'invoice_id', 'is_main_invoice'
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'erpnext_code', 'package', 'customer', 'company',
                    'date', 'delivery_date',
                    'invoice'
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
            'Discount',
            {
                'fields': (
                    'discount_code', 'discount_amount', 'discount_percentage'
                )
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
                    'payment_method', 'payment_id', 'subscription'
                )
            }
        ),
        (
            'Invoice',
            {
                'fields': (
                    'invoice_id', 'is_main_invoice'
                )
            }
        )
    )
    inlines = (
        SalesOrderAutoRepeatInline, SalesOrderInvoiceInline,
        SalesOrderAgreementInline
    )

    def _auto_repeat_code(self, obj: SalesOrder):
        """Return auto repeat erpnext_code."""
        try:
            auto_repeat = obj.salesorderautorepeat
            if auto_repeat:
                if not auto_repeat.erpnext_code:
                    auto_repeat.post_to_erpnext()
                return auto_repeat.erpnext_code
        except SalesOrderAutoRepeat.DoesNotExist:
            pass
        return None

    _auto_repeat_code.short_description = 'Auto Repeat'

    def _subscription(self, obj: SalesOrder):
        """Return subscription."""
        if obj.subscription:
            return mark_safe(
                f'<a href="/admin/geohosting/subscription/'
                f'{obj.subscription.id}/change/?'
                f'target="_blank">{obj.subscription}</a>'
            )
        return None

    def activities(self, obj: SalesOrder):
        """Return product."""
        return mark_safe(
            f'<a href="/admin/geohosting/activity/?'
            f'sales_order__id__exact={obj.id}" target="_blank"'
            f'>activities</a>'
        )
