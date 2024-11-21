from django.contrib import admin

from geohosting.models import Company, CompanyContact


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """Company admin."""

    list_display = ('name', 'erpnext_code')


@admin.register(CompanyContact)
class CompanyContactAdmin(admin.ModelAdmin):
    """Company Contact admin."""

    list_display = ('company', 'user', 'erpnext_code')
    list_filter = ('company', 'user')
    search_fields = ('erpnext_code',)
