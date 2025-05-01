from urllib.parse import quote

from django.contrib import admin
from django.utils.safestring import mark_safe

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
    readonly_fields = ('rendered_body',)

    def rendered_body(self, obj):
        if not obj.body:
            return "(No content)"
        # Use data URI to embed the HTML body into an iframe
        html_escaped = quote(obj.body)
        return mark_safe(f'''
            <iframe src="data:text/html;charset=utf-8,{html_escaped}"
                    style="width:1000px; height:900px; border:1px solid #ccc;">
            </iframe>
        ''')

    rendered_body.short_description = 'Body (HTML)'
