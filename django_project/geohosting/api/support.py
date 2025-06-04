"""
GeoHosting Controller.

.. note:: Ticket.
"""

from django.contrib.auth.models import User
from rest_framework import mixins, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny

from core.api import FilteredAPI
from core.models.preferences import Preferences
from geohosting.models.support import Ticket, Attachment
from geohosting.serializer.support import (
    TicketSerializer, AttachmentSerializer
)
from geohosting_event.models.log import LogTracker


class TicketSetView(
    FilteredAPI,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    serializer_class = TicketSerializer
    default_query_filter = ['subject__icontains']

    def get_queryset(self):
        """Return querysets."""
        try:
            query = Ticket.objects.filter(user=self.request.user)
        except AttributeError:
            query = Ticket.objects.none()
        return self.filter_query(self.request, query).order_by(
            '-updated_at'
        )

    def perform_create(self, serializer):
        """Attach the current user to the ticket upon creation."""
        pref = Preferences.load()
        if not pref.erpnext_project_code:
            LogTracker.error(
                pref,
                f'No ERPNext project code found, check on ERP '
                f'if {pref.erpnext_project_code} is exist'
            )
            raise PermissionDenied(
                'The support ticket system is currently down. '
                'Please bear with us while we investigate the issue.'
            )

        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            customer = serializer.validated_data['customer']
            try:
                User.objects.get(email=customer)
                raise PermissionDenied(
                    'Please log in to create '
                    'a support ticket with this email address.'
                )
            except User.DoesNotExist:
                serializer.save()


class AttachmentSetView(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    serializer_class = AttachmentSerializer
    authentication_classes = []
    permission_classes = (AllowAny,)

    # TODO: We need to enable this after the frontend has been paginated
    pagination_class = None

    def get_serializer(self, *args, **kwargs):
        """Return serializer."""
        try:
            kwargs['data'] = self.request.data.copy()
            kwargs['data']['ticket'] = self.kwargs.get('tickets_pk')
        except KeyError:
            pass
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        """Return querysets."""
        user_email = self.request.user.email
        return Attachment.objects.filter(
            ticket___customer=user_email
        )
