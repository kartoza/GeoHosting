"""All global function that can be reused in admin site."""

from django.contrib import admin, messages


class NoUpdateAdmin(admin.ModelAdmin):
    """Admin without delete."""

    def has_delete_permission(self, request, obj=None):
        """Return delete permission."""
        return False

    def get_actions(self, request):
        """Return actions."""
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def has_add_permission(*args, **kwargs):
        """Return add permission."""
        return False


def push_to_erp(modeladmin, request, queryset):
    for obj in queryset:
        result = obj.post_to_erpnext()
        if result['status'] == 'success':
            messages.add_message(
                request,
                messages.SUCCESS,
                'Published'
            )
        else:
            messages.add_message(
                request,
                messages.ERROR,
                result['message']
            )


def sync_subscriptions(modeladmin, request, queryset):
    """Sync subscription."""
    for order in queryset.filter():
        order.sync_subscription()


def cancel_subscription(modeladmin, request, queryset):
    """Cancel subscription."""
    for config in queryset:
        config.cancel_subscription()
