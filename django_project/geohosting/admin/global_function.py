"""All global function that can be reused in admin site."""


def sync_subscriptions(modeladmin, request, queryset):
    """Sync subscription."""
    for order in queryset.filter():
        order.sync_subscription()


def cancel_subscription(modeladmin, request, queryset):
    """Cancel subscription."""
    for config in queryset:
        config.cancel_subscription()
