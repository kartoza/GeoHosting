from django.contrib import admin, messages
from django.db.models.query import QuerySet

from geohosting.models import Company, CompanyContact


@admin.action(description="Push to erpnext")
def push_to_erp(modeladmin, request, queryset: QuerySet[Company]):
    for obj in queryset:
        result = obj.post_to_erpnext()
        if result['status'] == 'success':
            messages.add_message(
                request,
                messages.SUCCESS,
                'Published'
            )
            for contact in obj.companycontact_set.all():
                contact.push_to_erpnext()
        else:
            messages.add_message(
                request,
                messages.ERROR,
                result['message']
            )


class CompanyContactInline(admin.TabularInline):
    model = CompanyContact
    extra = 1


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """Company admin."""

    list_display = ('name', 'erpnext_code')
    actions = (push_to_erp,)
    inlines = (CompanyContactInline,)
