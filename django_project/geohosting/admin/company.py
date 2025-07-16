from django.contrib import admin

from geohosting.admin.global_function import push_to_erp
from geohosting.models import (
    Company, CompanyContact, CompanyBillingInformation
)


class CompanyBillingInformationInline(admin.StackedInline):
    model = CompanyBillingInformation
    extra = 0
    readonly_fields = ('erpnext_code',)


class CompanyContactInline(admin.TabularInline):
    model = CompanyContact
    extra = 0


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """Company admin."""

    list_display = ('name', 'erpnext_code')
    actions = (push_to_erp,)
    inlines = (CompanyBillingInformationInline, CompanyContactInline,)
