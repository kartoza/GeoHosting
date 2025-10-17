from django.contrib import admin
from django.db.models import Q
from django.urls import reverse
from django.utils.html import format_html

from geohosting.forms.coupon import CreateCouponForm, EditCouponForm
from geohosting.models.coupon import CouponCode, Coupon
from geohosting.tasks.coupon import sync_stripe_coupon
from geohosting_event.models.log import LogTracker


class StripeCodeFilter(admin.SimpleListFilter):
    """Stripe code filter."""

    title = 'Stripe Code'
    parameter_name = 'stripe_code_status'

    def lookups(self, request, model_admin):
        return [
            ('has', 'Has Stripe Code'),
            ('none', 'No Stripe Code'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'has':
            return queryset.exclude(stripe_code__isnull=True).exclude(
                stripe_code__exact='')
        if self.value() == 'none':
            return queryset.filter(
                Q(stripe_code__isnull=True) | Q(stripe_code__exact='')
            )
        return queryset


class PaystackCodeFilter(admin.SimpleListFilter):
    """Paystack code filter."""

    title = 'Paystack Code'
    parameter_name = 'paystack_code_status'

    def lookups(self, request, model_admin):
        return [
            ('has', 'Has Paystack Code'),
            ('none', 'No Paystack Code'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'has':
            return queryset.exclude(paystack_code__isnull=True).exclude(
                paystack_code__exact='')
        if self.value() == 'none':
            return queryset.filter(
                Q(paystack_code__isnull=True) | Q(paystack_code__exact='')
            )
        return queryset


@admin.action(description="Sync stripe")
def sync_coupon_code_stripe(modeladmin, request, queryset):
    """Sync stripe."""
    for config in queryset:
        try:
            config.sync_stripe()
        except Exception as e:
            LogTracker.error(config, f'Sync stripe: {str(e)}', e)


@admin.action(description="Send email")
def send_email(modeladmin, request, queryset):
    """Send email."""
    for config in queryset:
        try:
            config.send_email()
        except Exception as e:
            LogTracker.error(config, f'Send email: {str(e)}', e)


@admin.register(CouponCode)
class CouponCodeAdmin(admin.ModelAdmin):
    """Coupon code admin."""
    list_display = (
        'coupon', 'email', 'stripe_code', 'paystack_code'
    )
    list_filter = ('coupon', StripeCodeFilter, PaystackCodeFilter)
    actions = (sync_coupon_code_stripe, send_email)


def sync_stripe(modeladmin, request, queryset):
    """Sync stripe."""
    for config in queryset:
        sync_stripe_coupon.delay(config.id)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    """Coupon admin."""
    list_display = (
        'name', 'discount_percentage', 'discount_amount', 'currency',
        'duration', 'coupon_count', 'stripe_id', 'paystack_id'
    )
    actions = (sync_stripe,)

    def get_form(self, request, obj=None, **kwargs):
        if obj is None:
            kwargs['form'] = CreateCouponForm
        else:
            kwargs['form'] = EditCouponForm
        return super().get_form(request, obj, **kwargs)

    def coupon_count(self, obj: Coupon):
        """Return clickable coupon count linking to CouponCode list."""
        count = obj.couponcode_set.count()
        url = (
                reverse('admin:geohosting_couponcode_changelist')
                + f'?coupon_id__exact={obj.id}'
        )
        return format_html('<a href="{}">{}</a>', url, count)
