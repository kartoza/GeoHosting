"""GeoHosting Controller."""
from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
# this is also used in manage.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Get the base REDIS URL, default to redis
BASE_REDIS_URL = (
    f'redis://redis:{os.environ.get("REDIS_PASSWORD", "")}'
    f'@{os.environ.get("REDIS_HOST", "")}',
)

app = Celery('GeoHosting')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# this allows you to schedule items in the Django admin.
app.conf.beat_scheduler = 'django_celery_beat.schedulers.DatabaseScheduler'

# Task cron job schedules
app.conf.beat_schedule = {
    'check_instance': {
        'task': 'check_instances',
        'schedule': crontab(minute='*'),
    },
    'sync_all_erp_data': {
        'task': 'sync_all_erp_data',
        'schedule': crontab(minute='*'),
    },
    'sync_subscriptions': {
        'task': 'sync_subscriptions',
        'schedule': crontab(minute='*/5'),
    }
}
