"""
GeoHosting Controller.

.. note:: Admins
"""

from django.contrib import admin

from geohosting.admin.global_function import push_to_erp
from geohosting.models.support import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Ticket admin."""

    change_list_template = 'admin/erp_change_list.html'

    def changelist_view(self, request, extra_context=None):
        """Changelist view."""
        custom_context = {
            "class_name": "Ticket"
        }
        extra_context = extra_context or {}
        extra_context.update(custom_context)
        return super().changelist_view(request, extra_context=extra_context)

    list_display = (
        'id', 'erpnext_code', 'user',
        'customer', 'subject', 'status', 'created_at',
        'updated_at'
    )
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('customer', 'subject', 'details')
    readonly_fields = ('created_at', 'updated_at')
    actions = [push_to_erp]

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('customer',)
        return self.readonly_fields
