"""CloudBench URL configuration — mounted at /api/cloudbench/ in core/urls.py."""
from django.conf import settings
from django.urls import include, path

# Use CLOUDBENCH_APPS from settings, with apps.preview added (no models, URLs only)
_extra = ['apps.preview']
app_modules = list(getattr(settings, 'CLOUDBENCH_APPS', [])) + _extra

urlpatterns = [path('', include(f'{app}.urls')) for app in app_modules]