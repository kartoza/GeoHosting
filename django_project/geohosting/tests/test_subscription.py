from datetime import datetime
from unittest.mock import patch

from django.contrib.auth.models import User
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.test import APITestCase

from geohosting.models import (
    Instance, Package, Cluster, Region, Product, Subscription,
    InstanceStatus
)
from geohosting.models.data_types import PaymentMethod
from geohosting_event.models import EmailEvent, EmailCategory


class SubscriptionTests(APITestCase):
    def setUp(self):
        """Create test user and instances."""
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
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
        self.subscription = Subscription.objects.create(
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
        self.instance = Instance.objects.create(
            name='Test Instance',
            price=self.package,
            cluster=self.cluster,
            owner=self.user,
            subscription=self.subscription,
            status=InstanceStatus.OFFLINE
        )

    @patch(
        'geohosting.forms.activity.delete_instance.DeletingInstanceForm'
    )
    @patch('geohosting.models.subscription.Subscription.payment_gateway')
    @patch('geohosting.models.subscription.Subscription.cancel_subscription')
    @patch('django.utils.timezone.now')
    def test_subscription_status(
            self, mock_now, mock_cancel_subscription,
            mock_payment_gateway, mock_delete_form
    ):
        """Test that get_queryset returns instances for the authenticated user."""
        mock_payment_gateway.return_value = None
        mock_now.return_value = make_aware(
            datetime(2000, 1, 2, 0, 0, 0)
        )

        self.assertFalse(self.instance.is_waiting_payment)
        self.assertFalse(self.instance.is_expired)

        # If it is next month
        mock_now.return_value = make_aware(
            datetime(2000, 2, 2, 0, 0, 0)
        )
        instance = self.instance
        EmailEvent.send_email(
            subject=f'{instance.name} is ready',
            body='Body',
            to=[instance.owner.email],
            category=EmailCategory.INSTANCE_NOTIFICATION,
            tags=[f'instance-{instance.id}', f'{instance.name}']
        )
        self.assertEqual(EmailEvent.objects.count(), 1)

        self.assertTrue(self.instance.is_waiting_payment)
        self.assertFalse(self.instance.is_expired)

        self.assertEqual(EmailEvent.objects.count(), 2)

        # We check the email when subscription is sync
        mock_now.return_value = make_aware(
            datetime(2000, 2, 2, 1, 0, 0)
        )
        self.instance.subscription.sync_subscription()
        self.assertEqual(EmailEvent.objects.count(), 2)

        # We check the email when subscription next 1 hour
        mock_now.return_value = make_aware(
            datetime(2000, 2, 2, 1, 0, 0)
        )
        self.instance.subscription.sync_subscription()
        self.assertEqual(EmailEvent.objects.count(), 2)

        # We check the email when subscription next 1 day
        mock_now.return_value = make_aware(
            datetime(2000, 2, 3, 0, 0, 0)
        )
        self.instance.subscription.sync_subscription()
        self.assertEqual(EmailEvent.objects.count(), 3)

        # We check the email when subscription next 14 day
        mock_now.return_value = make_aware(
            datetime(2000, 2, 15, 0, 0, 0)
        )
        self.instance.subscription.sync_subscription()
        assert mock_delete_form.call_count == 1
        assert mock_cancel_subscription.call_count == 1
        self.assertEqual(EmailEvent.objects.count(), 3)

        # When it is expired
        self.assertTrue(self.instance.is_waiting_payment)
        self.assertTrue(self.instance.is_expired)

        self.instance.refresh_from_db()
        assert mock_delete_form.call_count == 2
        assert mock_cancel_subscription.call_count == 2

    def test_api_list(self):
        """Test api list."""
        response = self.client.get('/api/subscription/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_api_detail(self):
        """Test api list."""
        response = self.client.get('/api/subscription/1000/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Create a test user
        user = User.objects.create_user(
            username='testuser2',
            email='testuser2@test.com',
            password='password123'
        )
        # Authenticate new user
        self.client.force_authenticate(user=user)
        response = self.client.get(
            f'/api/subscription/{self.subscription.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            f'/api/subscription/{self.subscription.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['id'], self.subscription.id)
