from django.contrib import admin, messages

from geohosting.models.erp_company import ErpCompany


@admin.action(description="Push to erpnext")
def push_to_erp(modeladmin, request, queryset):
    for obj in queryset:
        result = obj.post_to_erpnext()
        if result['status'] == 'success':
            messages.add_message(
                request,
                messages.SUCCESS,
                'Published'
            )
        else:
            messages.add_message(
                request,
                messages.ERROR,
                result['message']
            )


@admin.register(ErpCompany)
class ErpCompanyAdmin(admin.ModelAdmin):
    change_list_template = 'admin/erp_change_list.html'
    list_display = (
        'erpnext_code', 'name', 'default_currency', 'payment_method'
    )
    list_editable = (
        'payment_method',
    )

    def changelist_view(self, request, extra_context=None):
        """Changelist view."""
        custom_context = {
            "class_name": "ErpCompany"
        }
        extra_context = extra_context or {}
        extra_context.update(custom_context)
        return super().changelist_view(request, extra_context=extra_context)
