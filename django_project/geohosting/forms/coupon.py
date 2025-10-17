# coding=utf-8
"""
GeoHosting.

.. note:: Create coupon code.
"""
from django import forms
from django.contrib.auth import get_user_model
from django.core.validators import validate_email

from geohosting.models.coupon import Coupon, CouponCode

User = get_user_model()


class EditCouponForm(forms.ModelForm):
    """Coupon edit form."""

    emails = forms.CharField(
        required=False,
        help_text=(
            'Email addresses that will be used to create codes. '
            'Use newline for multiple emails. '
            'Allow empty to not create codes. '
            'All new codes will be created and emailed to all emails. '
            'Each email has its own code. '
        ),
        widget=forms.Textarea
    )

    class Meta:  # noqa: D106
        model = Coupon
        fields = ['emails']

    def clean_emails(self):
        """Clean and normalize email list."""
        raw = self.cleaned_data.get('emails', '')
        emails = [e.strip() for e in raw.splitlines() if e.strip()]
        for email in emails:
            validate_email(email)
        return emails

    def save(self, commit=True):
        """Save coupon and process related email codes."""
        coupon = super().save(commit=False)
        coupon.save()

        emails = self.cleaned_data.get('emails', [])
        if emails:
            for email in emails:
                CouponCode.objects.create(
                    coupon=coupon,
                    email=email
                )

        return coupon


class CreateCouponForm(EditCouponForm):
    """Coupon create form."""

    class Meta:  # noqa: D106
        model = Coupon
        fields = [
            'name', 'discount_percentage', 'discount_amount',
            'currency', 'duration'
        ]

    def clean_discount_percentage(self):
        """Ensure discount percentage is within valid range."""
        discount_percentage = self.cleaned_data.get('discount_percentage')

        if discount_percentage is not None:
            if discount_percentage < 0:
                raise forms.ValidationError(
                    'Discount percentage cannot be negative.'
                )
            if discount_percentage > 100:
                raise forms.ValidationError(
                    'Discount percentage cannot exceed 100.'
                )

        return discount_percentage

    def clean(self):
        """Ensure discount logic and required currency validation."""
        cleaned_data = super().clean()
        discount_percentage = cleaned_data.get('discount_percentage')
        discount_amount = cleaned_data.get('discount_amount')
        currency = cleaned_data.get('currency')

        if not discount_percentage and not discount_amount:
            raise forms.ValidationError(
                'You must specify either '
                'a discount percentage or a discount amount.'
            )

        if discount_amount and not currency:
            self.add_error(
                'currency',
                'Currency is required when using a discount amount.'
            )

        if discount_percentage and discount_amount:
            raise forms.ValidationError(
                'You cannot set both discount percentage and discount amount.'
            )

        return cleaned_data
