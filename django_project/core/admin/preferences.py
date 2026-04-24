# coding=utf-8
"""
GeoHosting.

.. note:: Admin Preferences

"""

import os
from datetime import datetime

from django.conf import settings
from django.contrib import admin
from django.contrib.admin.sites import NotRegistered
from django.http import Http404
from django.urls import path, reverse
from django.utils.html import format_html

from core.models.preferences import Preferences

try:
    admin.site.unregister(Preferences)
except NotRegistered:
    pass

test_fields = (
    'erp_base_url',
    'erp_next_test',
    'proxy_base_url',
    'proxy_test',
    'stripe_test',
    'paystack_test',
    'vault_test'
)
_VIEWABLE_EXTENSIONS = ['.json', '.txt']


def _fmt_size(size):
    for unit in ('B', 'KB', 'MB', 'GB', 'TB'):
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} PB"


@admin.register(Preferences)
class PreferencesAdmin(admin.ModelAdmin):
    """Preferences Admin."""

    fieldsets = (
        (None, {
            'fields': ('site_type', 'support_email', 'erpnext_project_code')
        }),
        ('Versions', {
            'fields': ('project_version',)
        }),
        ('Rule', {
            'fields': ('grace_period_days', 'reminder_days_after_expiry')
        }),
        ('Tests', {
            'fields': test_fields
        }),
        ('CloudBench', {
            'fields': ('cloudbench_data_folder',)
        }),
    )
    readonly_fields = test_fields + (
        'project_version', 'cloudbench_data_folder'
    )

    def cloudbench_data_folder(self, obj):
        root = getattr(settings, 'CLOUDBENCH_DATA_FOLDER', None)
        if not root:
            return '-'
        browser_url = reverse('admin:core_preferences_cloudbench_files')
        return format_html(
            '{} &nbsp; <a href="{}" class="button">Browse</a>',
            root,
            browser_url,
        )

    cloudbench_data_folder.short_description = 'CLOUDBENCH_DATA_FOLDER'

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                'cloudbench-files/',
                self.admin_site.admin_view(self.file_browser_view),
                name='core_preferences_cloudbench_files',
            ),
            path(
                'cloudbench-files/view/',
                self.admin_site.admin_view(self.file_view_view),
                name='core_preferences_cloudbench_file_view',
            ),
        ]
        return custom + urls

    def file_browser_view(self, request):
        from django.shortcuts import render

        root = getattr(settings, 'CLOUDBENCH_DATA_FOLDER', None)
        if not root:
            raise Http404("CLOUDBENCH_DATA_FOLDER is not configured.")

        rel_path = request.GET.get('path', '')
        # Sanitize: strip leading slashes and prevent traversal
        rel_path = rel_path.lstrip('/')
        target = os.path.realpath(os.path.join(root, rel_path))
        if not target.startswith(os.path.realpath(root)):
            raise Http404("Access denied.")
        if not os.path.isdir(target):
            raise Http404("Not a directory.")

        entries = []
        try:
            names = sorted(os.listdir(target), key=lambda n: (
                not os.path.isdir(os.path.join(target, n)), n.lower()
            ))
            for name in names:
                full = os.path.join(target, name)
                stat = os.stat(full)
                is_dir = os.path.isdir(full)
                entry_rel = os.path.join(rel_path, name) if rel_path else name
                ext = os.path.splitext(name)[1].lower()
                entries.append({
                    'name': name,
                    'is_dir': is_dir,
                    'is_viewable': not is_dir and ext in _VIEWABLE_EXTENSIONS,
                    'rel_path': entry_rel,
                    'size': '—' if is_dir else _fmt_size(stat.st_size),
                    'mtime': datetime.fromtimestamp(stat.st_mtime).strftime(
                        '%Y-%m-%d %H:%M'
                    ),
                })
        except PermissionError:
            entries = []

        # Build breadcrumbs
        breadcrumbs = []
        parts = [p for p in rel_path.split('/') if p]
        for i, part in enumerate(parts):
            breadcrumbs.append({
                'name': part,
                'rel_path': '/'.join(parts[:i + 1]),
            })

        parent_path = '/'.join(parts[:-1]) if parts else ''

        context = {
            **self.admin_site.each_context(request),
            'title': 'CloudBench File Browser',
            'root_path': root,
            'current_rel_path': rel_path,
            'parent_path': parent_path,
            'entries': entries,
            'breadcrumbs': breadcrumbs,
            'viewable_extensions': _VIEWABLE_EXTENSIONS,
        }
        return render(
            request, 'admin/cloudbench_file_browser.html', context
        )

    def file_view_view(self, request):
        from django.shortcuts import render

        root = getattr(settings, 'CLOUDBENCH_DATA_FOLDER', None)
        if not root:
            raise Http404("CLOUDBENCH_DATA_FOLDER is not configured.")

        rel_path = request.GET.get('path', '').lstrip('/')
        target = os.path.realpath(os.path.join(root, rel_path))
        if not target.startswith(os.path.realpath(root)):
            raise Http404("Access denied.")
        if not os.path.isfile(target):
            raise Http404("Not a file.")

        ext = os.path.splitext(target)[1].lower()
        if ext not in _VIEWABLE_EXTENSIONS:
            raise Http404("File type not viewable.")

        try:
            with open(target, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except PermissionError:
            raise Http404("Permission denied.")

        parts = [p for p in rel_path.split('/') if p]
        breadcrumbs = []
        for i, part in enumerate(parts):
            breadcrumbs.append({
                'name': part,
                'rel_path': '/'.join(parts[:i + 1]),
            })

        browser_url = reverse('admin:core_preferences_cloudbench_files')
        parent_browser_url = (
            f"{browser_url}?path={'/'.join(parts[:-1])}"
            if len(parts) > 1 else browser_url
        )

        context = {
            **self.admin_site.each_context(request),
            'title': f'View: {parts[-1] if parts else rel_path}',
            'filename': parts[-1] if parts else rel_path,
            'content': content,
            'is_json': ext == '.json',
            'breadcrumbs': breadcrumbs,
            'parent_browser_url': parent_browser_url,
        }
        return render(
            request, 'admin/cloudbench_file_view.html', context
        )
