from django.contrib import admin

from geohosting_event.models import EmailEvent


@admin.register(EmailEvent)
class EmailEventAdmin(admin.ModelAdmin):
    """WebhookEvent admin."""

    list_display = (
        'sent_at', 'from_email', 'to', 'subject',
        'category'
    )
    list_filter = ('category',)
    search_fields = ('from_email', 'subject',)
