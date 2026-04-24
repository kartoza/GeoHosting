"""CloudBench URL configuration."""
from django.conf import settings
from django.urls import include, path

_extra = []
app_modules = list(getattr(settings, 'CLOUDBENCH_APPS', [])) + _extra

urlpatterns = [path('', include(f'{app}.urls')) for app in app_modules]
