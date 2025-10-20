from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.admin.global_function import (
    sync_subscriptions, cancel_subscription
)
from geohosting.models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Subscription admin."""

    list_display = (
        'subscription_id', 'customer_payment_id', 'payment_method',
        'current_period_start', 'current_period_end',
        'is_active', '_instance'
    )
    list_filter = ('payment_method', 'is_active')
    actions = (sync_subscriptions, cancel_subscription)
    readonly_fields = (
        'payment_method', 'subscription_id', 'customer',
        'current_period_start', 'current_period_end',
        'payment_id'
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'payment_method', 'subscription_id', 'customer',
                    'payment_id'
                )
            }
        ),
        (
            'Status',
            {
                'fields': (
                    'current_period_start', 'current_period_end', 'is_active'
                )
            }
        ),
    )

    def _instance(self, obj: Subscription):
        """Return instance."""
        instance = obj.instance_set.first()
        if instance:
            return mark_safe(
                f'<a target="__blank" '
                f'href="/admin/geohosting/instance/{instance.id}/change/">'
                f'{instance.name} ({instance.status})'
                f'</a>'
            )
        return "-"

    _instance.short_description = "Instance"
