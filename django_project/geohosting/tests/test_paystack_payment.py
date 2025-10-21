from datetime import datetime
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone
from freezegun import freeze_time

from geohosting.models import (
    SalesOrder, Cluster, Package, Region, Product, PaymentMethod, CouponCode,
    InstanceStatus, Instance
)
from geohosting.models.coupon import Coupon

subscriptions = {
    'SUB_ID': {
        'id': 'SUB_ID',
        'subscription_code': 'SUB_ID',
        'amount': 10000,
        'authorization': {
            'authorization_code': 'AUTH_CODE'
        },
        'customer': {
            'id': 'CUS_ID',
            'customer_code': 'CUS_CODE',
            'plan': 'PLN_CODE'
        },
        'status': 'active',
        'createdAt': '2025-01-01T00:00:00.000Z',
        'most_recent_invoice': {
            'invoice_code': 'INV_CODE'
        },
        'next_payment_date': '2025-02-01T00:00:00.000Z',
        'payments_count': 1,
        'interval': 'monthly',
        'plan': {
            'plan_code': 'PLN_CODE',
            'amount': 10000,
            'interval': 'monthly',
            'currency': 'ZAR'
        },
        'email_token': 'EMAIL_TOKEN'
    },
    'SUB_DISCOUNT': {
        'id': 'SUB_DISCOUNT',
        'subscription_code': 'SUB_DISCOUNT',
        'amount': 90.00,
        'authorization': {
            'authorization_code': 'AUTH_CODE'
        },
        'customer': {
            'id': 'CUS_ID',
            'customer_code': 'CUS_CODE',
            'plan': 'PLN_CODE'
        },
        'status': 'active',
        'createdAt': '2025-01-01T00:00:00.000Z',
        'most_recent_invoice': {
            'invoice_code': 'INV_CODE'
        },
        'next_payment_date': '2025-03-01T00:00:00.000Z',
        'payments_count': 1,
        'interval': 'monthly',
        'plan': {
            'plan_code': 'PLN_CODE',
            'amount': 90.00,
            'interval': 'monthly',
            'currency': 'ZAR'
        },
        'email_token': 'EMAIL_TOKEN'
    }
}


def get_subscription_data(subscription_id):
    data = subscriptions[subscription_id]
    data["next_payment_date"] = datetime.now().strftime(
        "%Y-%m-%dT%H:%M:%S.%fZ"
    )
    return {
        'data': data,
    }


class PaystackPaymentTests(TestCase):
    """Paystack Payment Tests."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser2',
            email='testuser2@test.com',
            password='password123'
        )
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

        self.sales_order = SalesOrder.objects.create(
            customer=self.user,
            package=self.package,
            date=timezone.now(),
            payment_method=PaymentMethod.PAYSTACK,
            payment_id="PAYMENT_ID"
        )

    @patch('paystackapi.transaction.Transaction.list')
    @patch('paystackapi.transaction.Transaction.verify')
    @patch('paystackapi.subscription.Subscription.list')
    @patch('paystackapi.subscription.Subscription.fetch')
    def test_flow(
            self, mock_fetch, mock_sub_list, mock_verify,
            mock_trans_list
    ):
        """Test flow."""
        transaction_data = {
            'amount': 10000,
            'authorization': {
                'authorization_code': 'AUTH_CODE'
            },
            'createdAt': '2025-01-01T00:00:00.000Z',
            'created_at': '2025-01-01T00:00:00.000Z',
            'plan_object': {
                'id': 'PLAN_ID',
                'plan_code': 'PLN_CODE'
            },
            'customer': {
                'id': 'CUS_ID',
                'customer_code': 'CUS_CODE',
                'plan': 'PLN_CODE'
            },
            'reference': 'PAYMENT_ID',
            'requested_amount': 10000
        }
        mock_fetch.side_effect = get_subscription_data
        mock_sub_list.return_value = {
            'data': [subscriptions["SUB_ID"]],
            'status': True
        }
        mock_verify.return_value = {
            'data': transaction_data,
            'status': True
        }
        mock_trans_list.return_value = {
            'data': [transaction_data],
            'status': True
        }
        self.sales_order.sync_subscription()
        self.sales_order.refresh_from_db()
        self.assertIsNotNone(self.sales_order.subscription)
        self.assertEqual(
            self.sales_order.subscription.subscription_id,
            'SUB_ID'
        )
        self.assertTrue(
            self.sales_order.subscription.is_active
        )

    @patch('paystackapi.transaction.Transaction.list')
    @patch('paystackapi.transaction.Transaction.verify')
    @patch('paystackapi.subscription.Subscription.list')
    @patch('paystackapi.subscription.Subscription.fetch')
    @patch('paystackapi.subscription.Subscription.disable')
    @patch('paystackapi.subscription.Subscription.create')
    @patch('paystackapi.plan.Plan.list')
    @patch('paystackapi.plan.Plan.create')
    def test_flow_discount(
            self, mock_plan_create, mock_plan_list,
            mock_sub_create, mock_disabled, mock_fetch, mock_sub_list,
            mock_verify, mock_trans_list
    ):
        """Test flow."""
        with freeze_time("2025-01-01 00:00:00") as frozen_datetime:
            def get_subscription_data(subscription_id):
                data = subscriptions[subscription_id]
                if subscription_id == 'SUB_ID':
                    data["next_payment_date"] = datetime.now().strftime(
                        "%Y-%m-%dT%H:%M:%S.%fZ"
                    )
                return {
                    'data': data,
                }

            coupon = Coupon.objects.create(
                name='COUPON_NAME',
                discount_percentage=10,
                duration=2,
                created_at=datetime.now()
            )
            coupon_code = CouponCode.objects.create(
                coupon=coupon,
                code='COUPON_CODE',
                paystack_active=True
            )
            plan_data = {
                'id': 'PLAN_ID',
                'plan_code': 'PLN_CODE',
                'is_deleted': False,
                'is_archived': False,
                'name': (
                    f'Test Package - testuser2@test.com - '
                    f'{int(frozen_datetime.time_to_freeze.timestamp())}'
                )
            }
            new_plan_data = {
                'id': 'PLAN_ID_2',
                'plan_code': 'PLN_CODE_2',
                'is_deleted': False,
                'is_archived': False,
                'name': (
                    f'Test Package - testuser2@test.com - '
                    f'{int(frozen_datetime.time_to_freeze.timestamp())}'
                )
            }
            mock_plan_create.return_value = {
                'data': new_plan_data,
                'status': True
            }
            mock_plan_list.return_value = {
                'data': [plan_data],
                'status': True
            }
            mock_sub_create.return_value = {
                'data': {
                    "id": "SUB_ID"
                },
                'status': True
            }
            transaction_data = {
                'amount': 90.00,
                'authorization': {
                    'authorization_code': 'AUTH_CODE'
                },
                'createdAt': '2025-01-01T00:00:00.000Z',
                'created_at': '2025-01-01T00:00:00.000Z',
                'plan_object': plan_data,
                'customer': {
                    'id': 'CUS_ID',
                    'customer_code': 'CUS_CODE',
                    'plan': 'PLN_CODE'
                },
                'reference': 'PAYMENT_ID',
                'requested_amount': 90.00,
                'metadata': coupon_code.metadata(
                    self.sales_order.package.price
                )
            }
            mock_fetch.side_effect = get_subscription_data
            mock_plan_list.return_value = {
                'data': [plan_data],
                'status': True
            }
            mock_sub_list.return_value = {
                'data': [subscriptions["SUB_DISCOUNT"]],
                'status': True
            }
            mock_verify.return_value = {
                'data': transaction_data,
                'status': True
            }
            mock_trans_list.return_value = {
                'data': [transaction_data],
                'status': True
            }
            self.sales_order.sync_subscription()
            self.sales_order.refresh_from_db()
            self.assertIsNotNone(self.sales_order.subscription)
            self.assertEqual(
                self.sales_order.subscription.subscription_id,
                'SUB_DISCOUNT'
            )
            self.assertTrue(
                self.sales_order.subscription.is_active
            )
            assert mock_disabled.call_count == 0

            frozen_datetime.move_to(datetime.now() + relativedelta(months=1))
            Instance.objects.create(
                name='Test Instance',
                price=self.package,
                cluster=self.cluster,
                owner=self.user,
                subscription=self.sales_order.subscription,
                status=InstanceStatus.ONLINE,
            )
            self.sales_order.subscription.sync_subscription()
            self.sales_order.refresh_from_db()
            self.assertIsNotNone(self.sales_order.subscription)
            self.assertEqual(
                self.sales_order.subscription.subscription_id,
                'SUB_DISCOUNT'
            )
            self.assertTrue(
                self.sales_order.subscription.is_active
            )
            assert mock_disabled.call_count == 1

            frozen_datetime.move_to(datetime.now() + relativedelta(months=1))
            self.sales_order.subscription.sync_subscription()
            self.sales_order.refresh_from_db()
            self.assertIsNotNone(self.sales_order.subscription)
            self.assertEqual(
                self.sales_order.subscription.subscription_id,
                'SUB_ID'
            )
            self.assertTrue(
                self.sales_order.subscription.is_active
            )
            self.assertEqual(mock_disabled.call_count, 3)
