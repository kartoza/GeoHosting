# coding=utf-8
"""
GeoHosting.

.. note:: Admin Preferences

"""
from django.contrib import admin

from core.models.preferences import Preferences


@admin.register(Preferences)
class PreferencesAdmin(admin.ModelAdmin):
    """Preferences Admin."""

    fieldsets = (
        (
            None, {
                'fields': (
                    'erp_next_test',
                    'jenkins_test',
                    'stripe_test',
                    'paystack_test'
                )
            }
        ),
    )
    readonly_fields = (
        'erp_next_test',
        'jenkins_test',
        'stripe_test',
        'paystack_test'
    )
