from django.contrib import admin

from geohosting.models import Cluster


@admin.register(Cluster)
class ClusterAdmin(admin.ModelAdmin):
    """Cluster admin."""

    list_display = ('code', 'region', 'domain', 'vault_url')
    list_editable = ('vault_url',)
