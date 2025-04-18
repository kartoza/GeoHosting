from core.celery import app
from geohosting.models import Subscription


@app.task(name='sync_subscriptions')
def sync_subscriptions():
    """Sync subscription."""
    print('SYNC_SUBSCRIPTIONS')
    for subscription in Subscription.objects.filter(is_active=True):
        try:
            subscription.sync_subscription()
        except Exception:
            pass
