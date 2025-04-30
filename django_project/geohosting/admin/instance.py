from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.admin.global_function import (
    sync_subscriptions, cancel_subscription
)
from geohosting.models import Instance
from geohosting_event.admin.log import LogTrackerObjectAdmin


def send_credentials(modeladmin, request, queryset):
    """Send credentials."""
    for config in queryset:
        config.send_credentials()


def check_instance(modeladmin, request, queryset):
    """Send instance."""
    for config in queryset:
        config.checking_server()


@admin.register(Instance)
class InstanceAdmin(LogTrackerObjectAdmin):
    """Instance admin."""

    list_display = (
        'name', 'product', 'cluster', 'price', 'owner', 'status',
        'subscription', 'created_at', 'logs', 'webhooks', 'link'
    )
    list_filter = ('status',)
    actions = (
        send_credentials, check_instance, sync_subscriptions,
        cancel_subscription
    )
    readonly_fields = ('created_at', 'modified_at')
    fieldsets = (
        (
            None, {
                'fields': (
                    'name', 'cluster', 'owner', 'company',
                    'created_at', 'modified_at'
                )
            }
        ),
        (
            'Status', {
                'fields': ('status',)
            }
        ),
        (
            'Subscription', {
                'fields': ('price', 'subscription')
            }
        )
    )

    def has_add_permission(*args, **kwargs):
        return False

    def has_change_permission(*args, **kwargs):
        return True

    def product(self, obj: Instance):
        """Return product."""
        return obj.price.product.name

    def cluster(self, obj: Instance):
        """Return cluster."""
        return obj.cluster.code

    def webhooks(self, instance):
        """Return logs."""
        return mark_safe(
            '<a href="/admin/geohosting/webhookevent/?'
            f'activity__instance__exact={instance.id}"'
            'target="_blank">webhooks</a>'
        )

    def link(self, instance):
        """Return logs."""
        return mark_safe(
            f'<a href="{instance.url}" target="_blank">link</a>'
        )
