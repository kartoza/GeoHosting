from django.contrib import admin, messages
from django.utils.safestring import mark_safe

from geohosting.models import SalesOrder
from geohosting_event.admin.log import LogTrackerObjectAdmin


@admin.action(description="Publish sales order")
def publish_sales_order(modeladmin, request, queryset):
    for sales_order in queryset:
        result = sales_order.post_to_erpnext()
        if result['status'] == 'success':
            messages.add_message(
                request,
                messages.SUCCESS,
                'Published')

        else:
            messages.add_message(
                request,
                messages.ERROR,
                result['message']
            )


def update_payment_status(modeladmin, request, queryset):
    """Update order status."""
    for order in queryset.filter():
        order.update_payment_status()


@admin.action(description="Auto deploy")
def auto_deploy(modeladmin, request, queryset):
    for sales_order in queryset:
        sales_order.auto_deploy()


@admin.register(SalesOrder)
class SalesOrderAdmin(LogTrackerObjectAdmin):
    list_display = (
        'date', 'package', 'customer', 'order_status', 'payment_method',
        'erpnext_code', 'app_name', 'instance', 'activities', 'logs'
    )
    list_filter = ('order_status', 'payment_method',)
    search_fields = ('erpnext_code', 'instance__name')
    actions = [publish_sales_order, update_payment_status, auto_deploy]

    def activities(self, obj: SalesOrder):
        """Return product."""
        return mark_safe(
            f'<a href="/admin/geohosting/activity/?'
            f'sales_order__id__exact={obj.id}" target="_blank"'
            f'>activities</a>'
        )
