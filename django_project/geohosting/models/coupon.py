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
from datetime import datetime

import stripe
from dateutil.relativedelta import relativedelta
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

    def discount_text(self):
        """Return discount text."""
        durations = ""
        if self.duration:
            if self.duration == 1:
                durations = "your first month"
            else:
                durations = f'your first {self.duration} months'
        if self.discount_percentage:
            return f'{self.discount_percentage}% off {durations}'
        elif self.discount_amount:
            return f'{self.discount_amount} {self.currency} off {durations}'
        return 'N/A'

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

    def sync_paystack(self):
        """Sync stripe."""
        for coupon_code in self.couponcode_set.all():
            coupon_code.sync_paystack()

    def discounted_amount(self, amount):
        """Return discounted amount."""
        if self.discount_percentage:
            return amount * (1 - self.discount_percentage / 100)
        elif self.discount_amount:
            return amount - self.discount_amount
        return amount


class CouponCode(models.Model):
    """Coupon code model."""

    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    email = models.EmailField()
    code = models.CharField(max_length=256, null=True, blank=True)
    stripe_active = models.BooleanField(default=False)
    paystack_active = models.BooleanField(default=False)
    code_used_on_paystack = models.BooleanField(default=False)

    @staticmethod
    def query_active(coupon_code):
        """Return active coupon codes."""
        return CouponCode.objects.filter(
            code=coupon_code,
            paystack_active=True,
            code_used_on_paystack=False
        )

    def metadata(self, amount):
        """Return metadata."""
        return {
            'discount_code': self.code,
            'discount_amount': self.coupon.discount_amount,
            'discount_percentage': self.coupon.discount_percentage,
            'discount_currency': self.coupon.currency,
            'discount_duration': self.coupon.duration,
            'discounted_amount': self.coupon.discounted_amount(amount),
            'next_payment_due': (datetime.now() + relativedelta(
                months=self.coupon.duration
            )).timestamp()
        }

    def create_code(self):
        """Create stripe code."""
        if self.code:
            return self.code

        code = ''.join(
            random.choices(string.ascii_letters + string.digits, k=5)
        )
        code = f'{self.coupon.name}-{code}'
        code = code.upper()
        if CouponCode.objects.filter(code=code).exists():
            return self.create_code()
        self.code = code
        self.save()
        return code

    def send_email(self):
        """Send email."""
        from django.template.loader import render_to_string
        code = self.code

        if code:
            pref = Preferences.load()
            html_content = render_to_string(
                template_name='emails/Coupon code.html',
                context={
                    'code': code,
                    'support_email': pref.support_email,
                    'discount_text': self.coupon.discount_text(),
                }
            )

            if self.coupon.discount_percentage:
                subject = (
                    f'Your {self.coupon.discount_percentage}% '
                    f'discount for GSH is waiting for you'
                )
            else:
                subject = (
                    f'Your {self.coupon.discount_amount} '
                    f'{self.coupon.currency} '
                    f'discount for GSH is waiting for you'
                )

            # Create the email message
            EmailEvent.send_email(
                subject=subject,
                body=html_content,
                to=[self.email],
                category=EmailCategory.COUPON,
                tags=['Coupon code']
            )

    def sync_stripe(self):
        """Sync stripe."""
        if not self.stripe_active:
            if not self.coupon.stripe_id:
                self.coupon.sync_stripe()

            code = self.create_code()
            promotion_code = stripe.PromotionCode.create(
                coupon=self.coupon.stripe_id,
                code=code,
                active=True,
                max_redemptions=1
            )
            if promotion_code.id:
                self.stripe_active = True
                self.save()
                self.send_email()

    def sync_paystack(self):
        """Sync paystack."""
        if not self.code:
            self.create_code()
        if not self.paystack_active:
            self.paystack_active = True
            self.save()
            self.send_email()
