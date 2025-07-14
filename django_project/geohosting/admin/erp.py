from django.contrib import admin

from geohosting.models.erp_company import (
    ErpCompany, TaxesAndCharges, CostCenter
)
from geohosting.models.erp_model import ErpPaymentTermTemplate


class TaxesAndChargesInline(admin.TabularInline):
    model = TaxesAndCharges
    readonly_fields = ('erpnext_code', 'tax_category')

    def has_add_permission(self, request, obj):
        """Return add permission."""
        return False

    def has_delete_permission(self, request, obj):
        """Return delete permission."""
        return False


class CostCenterInline(admin.TabularInline):
    model = CostCenter
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
        'taxes', 'cost_centers', 'invoice_from_sales_invoice'
    )
    list_editable = (
        'payment_method', 'invoice_from_sales_invoice'
    )
    inlines = (TaxesAndChargesInline, CostCenterInline)

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

    def cost_centers(self, obj: ErpCompany):
        """Return cost_centers."""
        return ', '.join(
            obj.costcenter_set.filter(is_active=True).values_list(
                'erpnext_code', flat=True)
        )


@admin.register(ErpPaymentTermTemplate)
class PaymentTermTemplateAdmin(admin.ModelAdmin):
    list_display = ('erpnext_code', 'is_active')
    list_editable = ('is_active',)
    change_list_template = 'admin/erp_change_list.html'

    def changelist_view(self, request, extra_context=None):
        """Changelist view."""
        custom_context = {
            "class_name": "ErpPaymentTermTemplate"
        }
        extra_context = extra_context or {}
        extra_context.update(custom_context)
        return super().changelist_view(request, extra_context=extra_context)
