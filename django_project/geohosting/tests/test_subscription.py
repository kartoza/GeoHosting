from datetime import datetime
from unittest.mock import patch

from django.contrib.auth.models import User
from django.utils.timezone import make_aware
from rest_framework.test import APITestCase

from geohosting.models import (
    Instance, Package, Cluster, Region, Product, Subscription
)
from geohosting.models.data_types import PaymentMethod


class SubscriptionTests(APITestCase):
    def setUp(self):
        """Create test user and instances."""
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='tinashe@test.com',
            password='password123'
        )
        # Authenticate the client
        self.client.force_authenticate(user=self.user)

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

        # Create test Instance object
        self.instance = Instance.objects.create(
            name='Test Instance',
            price=self.package,
            cluster=self.cluster,
            owner=self.user,
            subscription=Subscription.objects.create(
                subscription_id='ID',
                customer=self.user,
                payment_method=PaymentMethod.STRIPE,
                current_period_start=make_aware(
                    datetime(2000, 1, 1, 0, 0, 0)
                ),
                current_period_end=make_aware(
                    datetime(2000, 2, 1, 0, 0, 0)
                ),
                is_active=True
            )
        )

    @patch('geohosting.models.subscription.Subscription.sync_subscription')
    @patch('django.utils.timezone.now')
    def test_subscription_status(self, mock_now, mock_sync_subscription):
        """Test that get_queryset returns instances for the authenticated user."""
        mock_sync_subscription.return_value = None
        mock_now.return_value = make_aware(
            datetime(2000, 1, 2, 0, 0, 0)
        )

        self.assertFalse(self.instance.is_waiting_payment)
        self.assertFalse(self.instance.is_expired)

        # If it is next month
        mock_sync_subscription.return_value = None
        mock_now.return_value = make_aware(
            datetime(2000, 2, 2, 0, 0, 0)
        )

        self.assertTrue(self.instance.is_waiting_payment)
        self.assertFalse(self.instance.is_expired)
