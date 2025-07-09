from django.contrib import admin

from geohosting.models.agreement import (
    Agreement, AgreementDetail
)


class AgreementDetailInline(admin.TabularInline):
    model = AgreementDetail
    extra = 1
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Agreement)
class AgreementAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    inlines = [AgreementDetailInline]
