from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from geohosting.models.sales_order import SalesOrder
from geohosting.models.user_profile import UserProfile
from geohosting.models.package import Package

User = get_user_model()


class SalesOrderViewTests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )

        # Create a UserProfile for the user
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            erpnext_code='ERP001'
        )

        # Create a test package
        self.package = Package.objects.create(
            name='Test Package',
            erpnext_code='PACK001',
            erpnext_item_code='ITEM001'
        )

        # Create test sales orders
        self.order1 = SalesOrder.objects.create(
            package=self.package,
            customer=self.user,
            order_status='Waiting Payment',
            payment_method='Stripe'
        )
        self.order2 = SalesOrder.objects.create(
            package=self.package,
            customer=self.user,
            order_status='Paid',
            payment_method='Paystack'
        )

        # Authenticate the client
        self.client.login(username='testuser', password='testpassword')

    def test_get_all_orders(self):
        """
        Test to fetch all sales orders for the authenticated user.
        """
        url = reverse('get_all_orders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Expecting 2 orders

    def test_get_order_by_id(self):
        """
        Test to fetch a specific sales order by ID for the authenticated user.
        """
        url = reverse('get_order_by_id', args=[self.order1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.order1.id)
        self.assertEqual(response.data['order_status'], 'Waiting Payment')

    def test_get_order_by_id_not_found(self):
        """
        Test to handle case when the order ID does not exist.
        """
        non_existent_order_id = 999
        url = reverse('get_order_by_id', args=[non_existent_order_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Order not found')

    def test_get_all_orders_unauthenticated(self):
        """
        Test to ensure fetching orders fails for unauthenticated users.
        """
        self.client.logout()
        url = reverse('get_all_orders')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
