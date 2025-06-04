import logging

from celery import shared_task
from django.apps import apps

from core.celery import app

logger = logging.getLogger(__name__)


@shared_task
def sync_erp_data(class_name):
    """Sync erp data from ERPNEXT API."""
    if class_name:
        Model = apps.get_model('geohosting', class_name)
        Model.sync_data()


@app.task(name='sync_all_erp_data')
def sync_all_erp_data():
    """Sync erp data from ERPNEXT API."""
    for class_name in ['Ticket']:
        logger.info('Syncing erp data for {}'.format(class_name))
        Model = apps.get_model('geohosting', class_name)
        Model.sync_data()
