# coding=utf-8
"""Core views."""
import mimetypes
import os

import httpx
from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse
from django.views import View


class CloudBenchAppView(View):
    """Serve the CloudBench React SPA and its static assets.

    In development: proxies to Vite dev server (WEBPACK_CLOUDBENCH_SERVER_URL).
    In production:  serves built static files from kartoza-cloudbench/static/.
    """

    def _get_frontend_dev_server(self):
        return getattr(settings, 'WEBPACK_CLOUDBENCH_SERVER_URL', None)

    def _get_static_root(self):
        cloudbench_path = getattr(
            settings, 'CLOUDBENCH_PATH',
            os.path.abspath(
                os.path.join(
                    os.path.dirname(__file__), '../../kartoza-cloudbench'
                )
            )
        )
        return os.path.join(cloudbench_path, 'static')

    def get(self, request, path='', *args, **kwargs):
        frontend_dev_url = self._get_frontend_dev_server()

        if frontend_dev_url:
            return self._proxy_to_vite(request, frontend_dev_url, path)

        return self._serve_static(path)

    def _proxy_to_vite(self, request, frontend_dev_url, path):
        """Proxy request to Vite dev server for HMR support."""
        target = f"{frontend_dev_url.rstrip('/')}/cloudbench/{path}"
        if request.META.get('QUERY_STRING'):
            target += f"?{request.META['QUERY_STRING']}"

        try:
            resp = httpx.get(target, timeout=10, follow_redirects=True)
        except httpx.RequestError:
            raise Http404(
                'Vite dev server unavailable. Is the vite service running?'
            )

        content_type = resp.headers.get('content-type', 'text/html')
        return HttpResponse(
            resp.content, status=resp.status_code, content_type=content_type
        )

    def _serve_static(self, path):
        """Serve built static files, fallback to index.html for SPA routing."""
        static_root = self._get_static_root()
        index_html = os.path.join(static_root, 'index.html')

        if not os.path.exists(index_html):
            raise Http404(
                'CloudBench frontend not built. '
                'Run: cd kartoza-cloudbench/web && npm run build'
            )

        if path:
            file_path = os.path.realpath(os.path.join(static_root, path))
            if file_path.startswith(
                    os.path.realpath(static_root)
            ) and os.path.isfile(file_path):
                content_type, _ = mimetypes.guess_type(file_path)
                return FileResponse(
                    open(file_path, 'rb'), content_type=content_type
                )

        return FileResponse(
            open(index_html, 'rb'), content_type='text/html'
        )
