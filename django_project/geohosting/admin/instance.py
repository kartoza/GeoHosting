from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe

from geohosting.admin.global_function import (
    NoUpdateAdmin, sync_subscriptions, cancel_subscription
)
from geohosting.forms.activity.delete_instance import (
    DeletingInstanceForm
)
from geohosting.models import Instance, InstanceStatus
from geohosting_event.admin.log import LogTrackerObjectAdmin
from geohosting_event.models.log import LogTracker


def send_credentials(modeladmin, request, queryset):
    """Send credentials."""
    for config in queryset:
        try:
            config.send_credentials()
        except Exception as e:
            LogTracker.error(config, f'Check instance: {str(e)}', e)


def check_instance(modeladmin, request, queryset):
    """Send instance."""
    for config in queryset:
        try:
            config.checking_server()
        except Exception as e:
            LogTracker.error(config, f'Check instance: {str(e)}', e)


def delete_instance(modeladmin, request, queryset):
    """Delete instance."""
    queryset = queryset.exclude(
        status__in=[
            InstanceStatus.DELETING, InstanceStatus.DELETED,
            InstanceStatus.DEPLOYING
        ]
    )

    if 'apply' in request.POST:
        # User confirmed the action
        success_ids = []
        error_messages = []
        for instance in queryset:
            form = DeletingInstanceForm({'application': instance.id})
            form.user = request.user  # set user manually

            if form.is_valid():
                form.save()
                success_ids.append(str(instance.id))
            else:
                for field_errors in form.errors.values():
                    error_messages.extend(field_errors)

        if error_messages:
            modeladmin.message_user(
                request,
                ','.join(error_messages),
                messages.WARNING
            )
        if success_ids:
            modeladmin.message_user(
                request,
                "Successfully started deleting instance(s).",
                messages.SUCCESS
            )
            id_param = ",".join(success_ids)
            return HttpResponseRedirect(
                f"/admin/geohosting/instance/?id__in={id_param}")
        else:
            modeladmin.message_user(
                request,
                "No instances were deleted.",
                messages.WARNING
            )
        return None

    if not queryset.count():
        modeladmin.message_user(
            request,
            "Your selected instaces are empty or "
            "already in deleting process or deleted.",
            messages.WARNING
        )
        return None
    # Show confirmation page
    return render(
        request,
        'admin/delete_instance_confirmation.html', {
            'queryset': queryset,
            'action': 'delete_instance',
        }
    )


def to_deleted(modeladmin, request, queryset):
    """Instance to deleted.."""
    for instance in queryset:
        instance.deleted()


@admin.register(Instance)
class InstanceAdmin(LogTrackerObjectAdmin, NoUpdateAdmin):
    """Instance admin."""

    list_display = (
        'name', 'product', 'price', 'owner', 'status',
        '_subscription', 'sales_orders', 'created_at', 'logs', 'webhooks',
        'links', 'cluster'
    )
    list_filter = ('status',)
    actions = (
        send_credentials, check_instance, sync_subscriptions,
        cancel_subscription, delete_instance, to_deleted
    )
    readonly_fields = ('created_at', 'modified_at')
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'name', 'cluster', 'owner', 'company',
                    'created_at', 'modified_at'
                )
            }
        ),
        ('Status', {'fields': ('status',)}),
        (
            'Subscription',
            {
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
            '<a href="/admin/geohosting_event/webhookevent/?'
            f'activity__instance__exact={instance.id}"'
            'target="_blank">webhooks</a>'
        )

    def _subscription(self, instance):
        """Return subscription."""
        if not instance.subscription:
            return None
        return mark_safe(
            f'<a href="/admin/geohosting/subscription/'
            f'{instance.subscription.id}/change/?'
            f'target="_blank">{instance.subscription}</a>'
        )

    def sales_orders(self, instance):
        """Return logs."""
        return mark_safe(
            '<a href="/admin/geohosting/salesorder/?'
            f'instance__exact={instance.id}"'
            'target="_blank">orders</a>'
        )

    def links(self, instance):
        """Return logs."""
        instance_product = instance.price.product
        links = [f'<a href="{instance.url}" target="_blank">instance</a>']
        for product in instance_product.productaddon_set.all():
            links.append(
                f'<a href="{product.addon_url(instance)}" '
                f'target="_blank">{product.addon.name}</a>'
            )
        return mark_safe(', '.join(links))
