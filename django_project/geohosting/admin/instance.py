from django.contrib import admin
from django.utils.safestring import mark_safe

from geohosting.admin.log import LogTrackerObjectAdmin
from geohosting.models import Instance


def send_credentials(modeladmin, request, queryset):
    """Send credentials ."""
    for config in queryset:
        config.send_credentials()


@admin.register(Instance)
class InstanceAdmin(LogTrackerObjectAdmin):
    """Instance admin."""

    list_display = (
        'name', 'product', 'cluster', 'price', 'owner', 'status', 'logs',
        'webhooks', 'link'
    )
    actions = (send_credentials,)

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
            f'data__app_name__exact={instance.name}"'
            'target="_blank">logs</a>'
        )

    def link(self, instance):
        """Return logs."""
        return mark_safe(
            f'<a href="{instance.url}" target="_blank">link</a>'
        )
