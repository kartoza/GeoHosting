from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from geohosting.models import (
    SalesOrder, Cluster, Package, Region, Product, SalesOrderStatus
)


class SalesOrderTests(APITestCase):
    """Sales Order Tests."""

    @patch('geohosting.models.erp_model.ErpModel.post_to_erpnext')
    def test_api_list(self, mock_post_to_erpnext):
        """Test api list."""
        mock_post_to_erpnext.return_value = {
            "status": "success", "id": 'erpnext_1'
        }

        # Create test Region object
        self.region = Region.objects.create(name='Test Region')

        # Create test Cluster object with 'code' and 'region'
        self.cluster = Cluster.objects.create(
            code='Cluster Code',
            region=self.region,
            domain='example.com'
        )

        # Create a test Product object
        self.product = Product.objects.create(
            name='Test Product',
            order=1,
            upstream_id='123',
            description='Test Description',
            available=True
        )

        # Create test Package with a valid product
        self.package = Package.objects.create(
            product=self.product,  # Assign a valid Product
            name='Test Package',
            price=100.00,
            periodicity='monthly',
            feature_list={'spec': ['10 GB Storage', '2 CPUs', '4 GB RAM']}
        )

        # Create a test user
        self.user = User.objects.create_user(
            username='testuser2',
            email='testuser2@test.com',
            password='password123'
        )
        SalesOrder.objects.create(
            customer=self.user,
            package=self.package,
        )
        two_hour_ago = timezone.now() - timedelta(hours=2)
        SalesOrder.objects.create(
            customer=self.user,
            package=self.package,
            date=two_hour_ago,
        )
        SalesOrder.objects.create(
            customer=self.user,
            package=self.package,
            order_status=SalesOrderStatus.WAITING_PAYMENT.key
        )
        SalesOrder.objects.create(
            customer=self.user,
            package=self.package,
            order_status=SalesOrderStatus.WAITING_PAYMENT.key,
            date=two_hour_ago,
        )
        self.user_2 = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='password123'
        )
        SalesOrder.objects.create(
            customer=self.user_2,
            package=self.package
        )
        # Authenticate the client
        self.client.force_authenticate(user=self.user)

        # TEST API
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['count'], 2)
