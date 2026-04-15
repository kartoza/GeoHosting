# coding=utf-8
"""Admin grouping for Kartoza CloudBench apps.

Overrides AdminSite.get_app_list so all cloudbench apps (apps.*) appear
as a single "Kartoza CloudBench" section in the Django admin sidebar,
instead of being scattered across separate sections.
"""

from django.contrib.admin import AdminSite

# app_label values for every app in CLOUDBENCH_APPS (project.py)
# Derived from the last segment of each apps.* dotted name.
CLOUDBENCH_APP_LABELS = {
    'ai',
    'bridge',
    'connections',
    'dashboard',
    'geonode',
    'geoserver',
    'gwc',
    'iceberg',
    'mergin',
    'postgres',
    'preview',
    'qfieldcloud',
    'qgis',
    'query',
    's3',
    'search',
    'sqlview',
    'sync',
    'terria',
    'upload',
}

_original_get_app_list = AdminSite.get_app_list


def _get_app_list_with_cloudbench(self, request, app_label=None):
    app_list = _original_get_app_list(self, request, app_label)

    cloudbench_models = []
    other_apps = []

    for app in app_list:
        if app['app_label'] in CLOUDBENCH_APP_LABELS:
            cloudbench_models.extend(app.get('models', []))
        else:
            other_apps.append(app)

    if cloudbench_models:
        other_apps.append({
            'name': 'Kartoza CloudBench',
            'app_label': 'cloudbench',
            'app_url': '#',
            'has_module_perms': True,
            'models': sorted(cloudbench_models, key=lambda m: m['name']),
        })

    return other_apps


AdminSite.get_app_list = _get_app_list_with_cloudbench