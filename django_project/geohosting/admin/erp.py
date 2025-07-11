from django.contrib import admin

from geohosting.models.erp_company import ErpCompany, TaxesAndCharges


class TaxesAndChargesInline(admin.TabularInline):
    model = TaxesAndCharges
    readonly_fields = ('erpnext_code',)

    def has_add_permission(self, request, obj):
        """Return add permission."""
        return False

    def has_delete_permission(self, request, obj):
        """Return delete permission."""
        return False


@admin.register(ErpCompany)
class ErpCompanyAdmin(admin.ModelAdmin):
    change_list_template = 'admin/erp_change_list.html'
    list_display = (
        'erpnext_code', 'name', 'default_currency', 'payment_method',
        'taxes'
    )
    list_editable = (
        'payment_method',
    )
    inlines = (TaxesAndChargesInline,)

    def changelist_view(self, request, extra_context=None):
        """Changelist view."""
        custom_context = {
            "class_name": "ErpCompany"
        }
        extra_context = extra_context or {}
        extra_context.update(custom_context)
        return super().changelist_view(request, extra_context=extra_context)

    def taxes(self, obj: ErpCompany):
        """Return taxes."""
        return ', '.join(
            obj.taxesandcharges_set.filter(is_active=True).values_list(
                'erpnext_code', flat=True)
        )
