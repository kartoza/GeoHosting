from django.contrib import admin

from geohosting_event.models.erp import ErpRequestLog


@admin.register(ErpRequestLog)
class ErpRequestLogAdmin(admin.ModelAdmin):
    list_display = (
        'url', 'method', 'response_code', 'request_at'
    )
