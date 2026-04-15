# coding=utf-8
"""Core views."""
import mimetypes
import os

from django.conf import settings
from django.http import FileResponse, Http404
from django.views import View


class CloudBenchAppView(View):
    """Serve the CloudBench React SPA and its static assets.

    - /cloudbench/<file>  → serve file from kartoza-cloudbench/static/
    - /cloudbench/*       → fallback to index.html for client-side routing
    """

    def _get_static_root(self):
        cloudbench_path = getattr(
            settings, 'CLOUDBENCH_PATH',
            os.path.abspath(
                os.path.join(os.path.dirname(__file__), '../../kartoza-cloudbench')
            )
        )
        return os.path.join(cloudbench_path, 'static')

    def get(self, request, path='', *args, **kwargs):
        static_root = self._get_static_root()
        index_html = os.path.join(static_root, 'index.html')

        if not os.path.exists(index_html):
            raise Http404(
                'CloudBench frontend not built. '
                'Run: cd kartoza-cloudbench/web && npm run build'
            )

        # Serve the actual file if it exists
        if path:
            file_path = os.path.realpath(os.path.join(static_root, path))
            # Security: prevent path traversal
            if file_path.startswith(os.path.realpath(static_root)) and os.path.isfile(file_path):
                content_type, _ = mimetypes.guess_type(file_path)
                return FileResponse(open(file_path, 'rb'), content_type=content_type)

        # SPA fallback
        return FileResponse(open(index_html, 'rb'), content_type='text/html')