import io

from django.http import FileResponse
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from core.api import FilteredAPI
from geohosting.models.agreement import AgreementDetail, SalesOrderAgreement
from geohosting.serializer.agreement import (
    AgreementDetailSerializer, SalesOrderAgreementSerializer
)


class AgreementViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    permission_classes = [IsAuthenticated]
    serializer_class = AgreementDetailSerializer

    def get_queryset(self):
        """Return instances for the authenticated user."""
        return AgreementDetail.objects.select_related(
            'agreement'
        ).order_by('agreement', '-version').distinct(
            'agreement'
        )


class MyAgreementViewSet(
    FilteredAPI,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """Sales order viewset."""

    default_query_filter = ['name__icontains']
    permission_classes = [IsAuthenticated]
    serializer_class = SalesOrderAgreementSerializer

    def get_queryset(self):
        """Return instances for the authenticated user."""
        return SalesOrderAgreement.objects.select_related(
            'agreement_detail', 'sales_order'
        ).filter(sales_order__customer=self.request.user).order_by('name')

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        instance = self.get_object()
        agreement = instance.agreement_detail
        if agreement.file:
            return FileResponse(
                open(agreement.file.path, 'rb'),
                as_attachment=True,
                filename=f'{instance.name}.pdf'
            )

        buffer = io.BytesIO()
        buffer.write(
            agreement.template.encode('utf-8')
        )
        buffer.seek(0)
        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f'{instance.name}.md'
        )
