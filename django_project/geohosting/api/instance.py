from django.http import HttpResponseBadRequest, Http404, HttpResponseForbidden
from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api import FilteredAPI
from geohosting.forms.activity.delete_instance import (
    DeletingInstanceForm
)
from geohosting.models import (
    Instance, InstanceStatus, Product
)
from geohosting.serializer.instance import (
    InstanceSerializer, InstanceDetailSerializer
)


class InstanceViewSet(
    FilteredAPI,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """ViewSet for fetching user instances."""

    serializer_class = InstanceSerializer
    permission_classes = [IsAuthenticated]
    default_query_filter = ['name__icontains']
    lookup_field = 'name'
    ignored_fields = ['page', 'page_size', 'q', 'product']

    def get_serializer_class(self):
        """Get serializer class."""
        if self.action == 'retrieve':
            return InstanceDetailSerializer
        return InstanceSerializer

    def get_queryset(self):
        """Return instances for the authenticated user."""
        query = Instance.objects.filter(
            owner=self.request.user
        ).exclude(status=InstanceStatus.DELETED).order_by('name')
        return self.filter_query(self.request, query)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a model instance."""
        instances = Instance.objects.filter(
            owner=self.request.user
        ).order_by('-created_at')
        instance = instances.filter(name=kwargs['name']).first()
        if not instance:
            raise Http404('No Instance matches the given query.')

        # Update sales order
        for activity in instance.activity_set.all():
            activity.update_sales_order()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def credential(self, request, name=None):
        try:
            instance = self.get_object()
            if instance.owner != request.user:
                raise HttpResponseForbidden
            product = request.GET.get('product', None)
            product_obj = None
            if product:
                product_obj = Product.objects.get(upstream_id=product)
            return Response(instance.credential(product_obj))
        except KeyError as e:
            return HttpResponseBadRequest(e)
        except Product.DoesNotExist:
            return Http404('No such product.')

    def destroy(self, request, *args, **kwargs):
        """Destroy an instance."""
        instance = self.get_object()
        form = DeletingInstanceForm({'application': instance})
        form.user = self.request.user
        if form.is_valid():
            form.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            errors = []
            for key, value in form.errors.items():
                errors.append(str(value[0]))
            return HttpResponseBadRequest(f'{",".join(errors)}')
