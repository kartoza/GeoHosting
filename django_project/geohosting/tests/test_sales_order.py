from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from geohosting.factories import PackageFactory, SalesOrderFactory
from geohosting.models import SalesOrderStatus, SalesOrderPaymentMethod


class SalesOrderTests(TestCase):
    """Sales order tests."""

    def setUp(self):
        """Setup test case."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='admin_user',
            email='admin@example.com',
            password='password123'
        )
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        self.package = PackageFactory()

    @patch('geohosting.models.sales_order.add_erp_next_comment')
    @patch('geohosting.models.sales_order.verify_paystack_payment')
    @patch('geohosting.models.sales_order.put_to_erpnext')
    @patch('geohosting.models.sales_order.post_to_erpnext')
    def test_create_sales_order(
            self, mock_post_to_erpnext, mock_put_to_erpnext,
            mock_verify_paystack_payment, mock_add_erp_next_comment
    ):
        """Test create sales order."""
        mock_post_to_erpnext.return_value = {
            "status": "success", "id": 'erpnext_1'
        }
        mock_put_to_erpnext.return_value = {
            "status": "success", "data": {}
        }
        mock_verify_paystack_payment.return_value = {
            "status": "success", "data": {"status": "success"}
        }
        mock_add_erp_next_comment.return_value = {
            "status": "success", "data": {}
        }

        sales_order = SalesOrderFactory(
            package=self.package, customer=self.user
        )
        self.assertEqual(sales_order.package, self.package)
        self.assertEqual(sales_order.customer, self.user)
        self.assertEqual(sales_order.erpnext_code, 'erpnext_1')

        # Waiting payment
        self.assertEqual(
            sales_order.order_status, SalesOrderStatus.WAITING_PAYMENT.key
        )

        sales_order.payment_id = 'payment_id'
        sales_order.payment_method = SalesOrderPaymentMethod.PAYSTACK
        sales_order.save()

        # Payment success
        sales_order.update_payment_status()
        self.assertEqual(
            sales_order.order_status,
            SalesOrderStatus.WAITING_CONFIGURATION.key
        )

        # Add app name
        sales_order.app_name = 'test'
        sales_order.save()
        self.assertEqual(
            sales_order.order_status,
            SalesOrderStatus.WAITING_DEPLOYMENT.key
        )
        mock_add_erp_next_comment.assert_called_once_with(
            self.user, sales_order.doctype, sales_order.erpnext_code,
            "App name : test"
        )
