# coding=utf-8
"""
GeoHosting.

.. note:: Admin Preferences

"""

from django.contrib import admin
from django.contrib.admin.sites import NotRegistered

from core.models.preferences import Preferences

try:
    admin.site.unregister(Preferences)
except NotRegistered:
    pass

test_fields = (
    'erp_base_url',
    'erp_next_test',
    'proxy_base_url',
    'proxy_test',
    'stripe_test',
    'paystack_test',
    'vault_test'
)


@admin.register(Preferences)
class PreferencesAdmin(admin.ModelAdmin):
    """Preferences Admin."""

    fieldsets = (
        (None, {
            'fields': ('site_type', 'support_email', 'erpnext_project_code')
        }),
        ('Versions', {
            'fields': ('project_version',)
        }),
        ('Rule', {
            'fields': ('grace_period_days', 'reminder_days_after_expiry')
        }),
        ('Tests', {
            'fields': test_fields
        }),
    )
    readonly_fields = test_fields + ('project_version',)
