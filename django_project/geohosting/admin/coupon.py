from django.contrib import admin, messages
from django.urls import reverse
from django.utils.html import format_html

from geohosting.forms.coupon import CreateCouponForm, EditCouponForm
from geohosting.models.coupon import CouponCode, Coupon
from geohosting.tasks.coupon import sync_stripe_coupon
from geohosting_event.models.log import LogTracker


@admin.action(description="Sync stripe")
def sync_coupon_code_stripe(modeladmin, request, queryset):
    """Sync stripe."""
    for config in queryset:
        try:
            config.sync_stripe()
        except Exception as e:
            LogTracker.error(config, f'Sync stripe: {str(e)}', e)


@admin.action(description="Sync paystack")
def sync_coupon_code_paystack(modeladmin, request, queryset):
    """Sync stripe."""
    for coupon_code in queryset:
        if (
                coupon_code.coupon.currency and
                coupon_code.coupon.currency != "ZAR"
        ):
            messages.error(
                request,
                f'Currency {coupon_code.coupon.currency} '
                f'is not supported for Paystack'
            )
            continue

        try:
            coupon_code.sync_paystack()
        except Exception as e:
            LogTracker.error(coupon_code, f'Sync paystack: {str(e)}', e)


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
        'coupon', 'email', 'code', 'stripe_active', 'paystack_active',
        'code_used_on_paystack'
    )
    list_filter = ('coupon', 'stripe_active', 'paystack_active')
    actions = (sync_coupon_code_stripe, sync_coupon_code_paystack, send_email)
    readonly_fields = (
        'code', 'stripe_active', 'paystack_active',
        'code_used_on_paystack'
    )


def sync_stripe(modeladmin, request, queryset):
    """Sync stripe."""
    for config in queryset:
        sync_stripe_coupon.delay(config.id)


def sync_paystack(modeladmin, request, queryset):
    """Sync paystack."""
    for coupon in queryset:
        if coupon.currency and coupon.currency != "ZAR":
            messages.error(
                request,
                f'Currency {coupon.currency} '
                f'is not supported for Paystack'
            )
            continue
        coupon.sync_paystack()


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    """Coupon admin."""

    list_display = (
        'name', 'discount_percentage', 'discount_amount', 'currency',
        'duration', 'coupon_count', 'stripe_id', 'paystack_id'
    )
    actions = (sync_stripe, sync_paystack)

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
