"""CloudBench URL configuration — mounted at /cloudbench/api/ in core/urls.py."""
from django.urls import include, path

app_modules = [
    'apps.ai',
    'apps.bridge',
    'apps.connections',
    'apps.dashboard',
    'apps.geonode',
    'apps.geoserver',
    'apps.gwc',
    'apps.iceberg',
    'apps.mergin',
    'apps.postgres',
    'apps.preview',
    'apps.qfieldcloud',
    'apps.qgis',
    'apps.query',
    'apps.s3',
    'apps.search',
    'apps.sqlview',
    'apps.sync',
    'apps.terria',
    'apps.upload',
]

urlpatterns = [path('', include(f'{app}.urls')) for app in app_modules]