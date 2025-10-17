from core.celery import app
from geohosting.models import Coupon


@app.task(name='sync_coupon')
def sync_stripe_coupon(id):
    """Sync stripe coupon."""
    try:
        coupon = Coupon.objects.get(id=id)
        for coupon_code in coupon.couponcode_set.all():
            coupon_code.sync_stripe()
    except Coupon.DoesNotExist:
        pass
