# coding=utf-8
"""
GeoHosting.

.. note:: Coupon code model.
    This is coupon code model.
    User will upload list of email and backend will generate coupon code
    in a group.
"""
import random
import re
import string

import stripe
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models

from core.models.preferences import Preferences
from geohosting_event.models.email import EmailEvent, EmailCategory

User = get_user_model()

CURRENCY_CHOICES = [
    ('ZAR', 'ZAR'),
    ('EUR', 'EUR'),
    ('USD', 'USD'),
]


def validate_coupon_name(value):
    """Validate coupon name format."""
    if not re.match(r'^[A-Za-z0-9\-]+$', value):
        raise ValidationError(
            'Name can only contain letters, numbers, and hyphens (-).'
        )
    if value.startswith('-') or value.endswith('-'):
        raise ValidationError('Name cannot start or end with a hyphen (-).')
    if '--' in value:
        raise ValidationError('Name cannot contain consecutive hyphens (--).')


class Coupon(models.Model):
    """Coupon code group model."""

    name = models.CharField(
        max_length=256, unique=True,
        validators=[validate_coupon_name],
        help_text=(
            'Name may only contain letters, numbers, and hyphens (-). '
            'It cannot start or end with a hyphen, '
            'nor contain consecutive hyphens.'
        ),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    discount_percentage = models.IntegerField(
        help_text='Discount percentage',
        null=True, blank=True
    )
    discount_amount = models.IntegerField(
        help_text=(
            'Discount amount, it will be ignored if discount percentage is set'
        ),
        null=True, blank=True
    )
    duration = models.IntegerField(
        help_text='Duration of coupon code group in months.',
        validators=[MinValueValidator(1)]
    )
    stripe_id = models.CharField(max_length=256, null=True, blank=True)
    paystack_id = models.CharField(max_length=256, null=True, blank=True)
    currency = models.CharField(
        choices=CURRENCY_CHOICES, null=True, blank=True
    )

    def __str__(self):
        """Return coupon name."""
        return self.name

    def sync_stripe(self):
        """Sync stripe."""
        if not self.stripe_id:
            params = {
                "duration": "repeating",
                "duration_in_months": self.duration,
                "name": self.name,
            }

            if self.discount_percentage:
                params["percent_off"] = self.discount_percentage
            elif self.discount_amount:
                params["amount_off"] = self.discount_amount * 100
                params["currency"] = self.currency
            else:
                raise ValueError(
                    "Coupon must have either "
                    "discount_percentage or discount_amount"
                )

            stripe_coupon = stripe.Coupon.create(**params)
            self.stripe_id = stripe_coupon.id
            self.save()


class CouponCode(models.Model):
    """Coupon code model."""

    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    email = models.EmailField()
    stripe_code = models.CharField(max_length=256, null=True, blank=True)
    paystack_code = models.CharField(max_length=256, null=True, blank=True)

    def create_stripe_code(self):
        """Create stripe code."""
        code = ''.join(
            random.choices(string.ascii_letters + string.digits, k=5)
        )
        code = f'{self.coupon.name}-{code}'
        code = code.upper()
        if CouponCode.objects.filter(stripe_code=code).exists():
            return self.create_stripe_code()
        return code

    def send_email(self):
        """Send email."""
        from django.template.loader import render_to_string
        code = None
        if self.stripe_code:
            code = self.stripe_code
        elif self.paystack_code:
            code = self.paystack_code

        if code:
            pref = Preferences.load()
            html_content = render_to_string(
                template_name='emails/Coupon code.html',
                context={
                    'code': code,
                    'support_email': pref.support_email,
                }
            )

            # Create the email message
            EmailEvent.send_email(
                subject='You have received a promotional coupon code',
                body=html_content,
                to=[self.email],
                category=EmailCategory.COUPON,
                tags=['Coupon code']
            )

    def sync_stripe(self):
        """Sync stripe."""
        if not self.stripe_code:
            if not self.coupon.stripe_id:
                self.coupon.sync_stripe()
            code = self.create_stripe_code()
            promotion_code = stripe.PromotionCode.create(
                coupon=self.coupon.stripe_id,
                code=code,
                active=True,
                max_redemptions=1
            )
            if promotion_code.id:
                self.stripe_code = code
                self.save()
                self.send_email()
