from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase

from geohosting.forms.coupon import CreateCouponForm
from geohosting.models.coupon import Coupon, CouponCode


class InstanceViewSetTests(APITestCase):
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

    def test_invalid_name_fails_validation(self):
        """Form should fail if name is invalid."""
        form = CreateCouponForm(
            data={
                'name': 'Invalid Promo'
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)

        form = CreateCouponForm(
            data={
                'name': 'Invalid-Promo-'
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)

        form = CreateCouponForm(
            data={
                'name': '-Invalid-Promo'
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)

        form = CreateCouponForm(
            data={
                'name': 'Invalid--Promo'
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('name', form.errors)

        form = CreateCouponForm(
            data={
                'name': 'Valid-Promo',
                'discount_percentage': 5,
                'duration': 10,
            }
        )
        self.assertTrue(form.is_valid())

    def test_duration_fails_validation(self):
        """Form should fail if duration does not exist."""
        form = CreateCouponForm(
            data={
                'name': 'Valid-Promo',
                'discount_percentage': 5
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('duration', form.errors)

        form = CreateCouponForm(
            data={
                'name': 'Valid-Promo',
                'discount_percentage': 5,
                'duration': 0
            }
        )
        self.assertFalse(form.is_valid())
        self.assertIn('duration', form.errors)

        form = CreateCouponForm(
            data={
                'name': 'Valid-Promo',
                'discount_percentage': 5,
                'duration': 1
            }
        )
        self.assertTrue(form.is_valid())

    def test_discount_percentage(self):
        """Form should fail if duration does not exist."""
        form = CreateCouponForm(
            data={
                'name': 'Promo',
                'duration': 1
            }
        )
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["__all__"],
            ['You must specify either a discount percentage or a discount amount.']
        )

        form = CreateCouponForm(
            data={
                'name': 'Promo',
                'duration': 1,
                'discount_amount': 1000
            }
        )
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["currency"],
            ['Currency is required when using a discount amount.']
        )

        form = CreateCouponForm(
            data={
                'name': 'Promo',
                'duration': 1,
                'discount_amount': 1000,
                'currency': "IDR"
            }
        )
        self.assertFalse(form.is_valid())
        self.assertTrue(
            'Select a valid choice' in form.errors["currency"][0],
        )

        form = CreateCouponForm(
            data={
                'name': 'Promo',
                'duration': 1,
                'discount_amount': 1000,
                'currency': "USD"
            }
        )
        self.assertTrue(form.is_valid())

    def test_invalid_email_fails_validation(self):
        """Form should fail if email is invalid."""
        data = {
            'name': 'Valid-Promo',
            'discount_percentage': 5,
            'discount_amount': 0,
            'duration': 10,
            'emails': 'not-an-email\nuser@example.com',
        }

        form = CreateCouponForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertIn('emails', form.errors)

        data = {
            'name': 'Valid-Promo',
            'discount_percentage': 5,
            'discount_amount': 0,
            'duration': 10,
            'emails': 'user2@example.com\nuser@example.com',
        }

        form = CreateCouponForm(data=data)
        self.assertTrue(form.is_valid())

    def test_coupon_code_check(self):
        """Test coupon code check."""
        url = reverse('coupon-code-check-paystack')
        coupon = Coupon.objects.create(
            name="MONTHEUR",
            discount_percentage=10,
            duration=1
        )
        code_1 = CouponCode.objects.create(
            coupon=coupon
        )
        code_1.sync_paystack()
        code_2 = CouponCode.objects.create(
            coupon=coupon
        )
        code_2.sync_paystack()
        code_2.paystack_active = False
        code_2.save()

        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 400)
        response = self.client.post(url, {
            "coupon_code": code_2.code
        })
        self.assertEqual(response.status_code, 404)
        response = self.client.post(url, {
            "coupon_code": code_1.code
        })
        self.assertEqual(response.status_code, 200)
