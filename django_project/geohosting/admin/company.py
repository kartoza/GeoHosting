from django.contrib import admin

from geohosting.admin.erp import push_to_erp
from geohosting.models import Company, CompanyContact


class CompanyContactInline(admin.TabularInline):
    model = CompanyContact
    extra = 1


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """Company admin."""

    list_display = ('name', 'erpnext_code')
    actions = (push_to_erp,)
    inlines = (CompanyContactInline,)
