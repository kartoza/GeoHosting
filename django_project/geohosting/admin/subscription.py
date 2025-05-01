from django.contrib import admin

from geohosting.admin.global_function import sync_subscriptions
from geohosting.models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Subscription admin."""

    list_display = (
        'subscription_id', 'customer_payment_id', 'payment_method',
        'current_period_start', 'current_period_end',
        'is_active'
    )
    list_filter = ('payment_method', 'is_active')
    actions = (sync_subscriptions,)
    readonly_fields = (
        'payment_method', 'subscription_id', 'customer',
        'current_period_start', 'current_period_end'
    )
    fieldsets = (
        (
            None, {
                'fields': (
                    'payment_method', 'subscription_id', 'customer'
                )
            }
        ),
        (
            'Status', {
                'fields': (
                    'current_period_start', 'current_period_end', 'is_active'
                )
            }
        ),
    )
