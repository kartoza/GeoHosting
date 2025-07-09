from django.contrib import admin

from geohosting.admin.global_function import push_to_erp
from geohosting.models.support import Attachment


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    """Attachment admin."""

    list_display = ('id', 'ticket', 'file', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('ticket__subject', 'ticket__customer')
    readonly_fields = ('uploaded_at',)
    actions = (push_to_erp,)
