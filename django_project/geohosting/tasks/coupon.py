import logging

from core.celery import app
from geohosting.models import Coupon
from geohosting_event.models import LogTracker

logger = logging.getLogger(__name__)


@app.task(name='sync_coupon')
def sync_stripe_coupon(id):
    """Sync stripe coupon."""
    try:
        coupon = Coupon.objects.get(id=id)
        coupon.sync_stripe()
        for coupon_code in coupon.couponcode_set.all():
            try:
                coupon_code.sync_stripe()
            except Exception as e:
                LogTracker.error(coupon, f'{e}')
    except Coupon.DoesNotExist:
        pass
    except Exception as e:
        logger.error(e)
