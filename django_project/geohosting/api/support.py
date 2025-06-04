"""
GeoHosting Controller.

.. note:: Ticket.
"""

from django.contrib.auth.models import User
from rest_framework import mixins, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny

from core.api import FilteredAPI
from geohosting.models.support import Ticket, Attachment
from geohosting.serializer.support import (
    TicketSerializer, AttachmentSerializer
)


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
        queryset = self.filter_query(self.request, query).order_by(
            '-updated_at'
        )
        if self.request.user.is_authenticated:
            Ticket.fetch_ticket_from_erp(
                self.request.user,
                list(queryset.values_list('erpnext_code', flat=True))
            )
        return queryset

    def perform_create(self, serializer):
        """Attach the current user to the ticket upon creation."""
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            customer = serializer.validated_data['customer']
            try:
                User.objects.get(email=customer)
                raise PermissionDenied(
                    'You need to be logged in to create ticket with this email.'
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
