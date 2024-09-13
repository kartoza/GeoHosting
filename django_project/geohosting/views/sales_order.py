from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from geohosting.models.sales_order import SalesOrder
from geohosting.serializer.sales_order import (
    SalesOrderSerializer,
    SalesOrderDetailSerializer
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    """Fetch all sales orders for the authenticated user."""

    user = request.user
    orders = SalesOrder.objects.filter(customer=user)
    serializer = SalesOrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, order_id):
    """Fetch a specific sales order by ID for the authenticated user."""

    user = request.user
    try:
        order = SalesOrder.objects.get(id=order_id, customer=user)
        serializer = SalesOrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SalesOrder.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )
