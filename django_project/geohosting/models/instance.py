# coding=utf-8
"""
GeoHosting.

.. note:: Instance model.
"""

import requests
from django.contrib.auth import get_user_model
from django.db import models

from geohosting.models.cluster import Cluster
from geohosting.models.company import Company
from geohosting.models.package import Package
from geohosting.models.product import ProductCluster
from geohosting.models.subscription import Subscription
from geohosting.utils.vault import get_credentials
from geohosting_event.models.log import LogTracker

User = get_user_model()


class InstanceStatus:
    """Instance Status."""

    DEPLOYING = 'Deploying'
    STARTING_UP = 'Starting Up'
    ONLINE = 'Online'
    OFFLINE = 'Offline'

    # Deletion status
    DELETING = 'Deleting'
    DELETED = 'Deleted'


class Instance(models.Model):
    """Instance model."""

    name = models.CharField(
        max_length=256
    )
    price = models.ForeignKey(
        Package, on_delete=models.CASCADE,
    )
    cluster = models.ForeignKey(
        Cluster, on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    status = models.CharField(
        default=InstanceStatus.DEPLOYING,
        choices=(
            (InstanceStatus.DEPLOYING, InstanceStatus.DEPLOYING),
            (InstanceStatus.STARTING_UP, InstanceStatus.STARTING_UP),
            (InstanceStatus.ONLINE, InstanceStatus.ONLINE),
            (InstanceStatus.OFFLINE, InstanceStatus.OFFLINE),
            (InstanceStatus.DELETING, InstanceStatus.DELETING),
            (InstanceStatus.DELETED, InstanceStatus.DELETED)
        ),
        db_index=True
    )
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text=(
            'Keep blank if instance is for individual capacity..'
        )
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True, blank=True
    )
    modified_at = models.DateTimeField(
        auto_now=True,
        null=True, blank=True
    )

    # This is what subscription for this instance
    subscription = models.ForeignKey(
        Subscription, on_delete=models.SET_NULL,
        null=True, blank=True,
        help_text=(
            'Subscription of the instance.'
        )
    )

    def __str__(self):
        """Return activity type name."""
        return self.name

    @property
    def is_lock(self):
        """Is lock is basically when the instance can't be updated."""
        return self.status in [
            InstanceStatus.DELETING,
            InstanceStatus.DELETED
        ]

    @property
    def is_ready(self):
        """When the instance is up."""
        return self.status in [
            InstanceStatus.OFFLINE, InstanceStatus.ONLINE
        ]

    @property
    def product_cluster(self):
        """Return product cluster."""
        return ProductCluster.objects.get(
            cluster=self.cluster,
            product=self.price.product
        )

    @property
    def url(self):
        """Return url."""
        return f'https://{self.name}.{self.cluster.domain}'

    def _change_status(self, status):
        """Change status."""""
        if self.status == status:
            return

        LogTracker.success(self, f'Server: {status}')
        self.status = status
        self.save()

    def starting_up(self):
        """Make instance online."""
        if self.is_lock:
            return
        self._change_status(InstanceStatus.STARTING_UP)

    def online(self):
        """Make instance online."""
        if self.is_lock:
            return

        # For deploying, change to starting up
        if self.status == InstanceStatus.DEPLOYING:
            self.status = InstanceStatus.STARTING_UP

        # When starting up, send credential
        if self.status == InstanceStatus.STARTING_UP:
            self.send_credentials()

        self._change_status(InstanceStatus.ONLINE)

    def offline(self):
        """Make instance offline."""
        if self.status in [
            InstanceStatus.DEPLOYING,
            InstanceStatus.STARTING_UP,
            InstanceStatus.DELETING,
            InstanceStatus.DELETED
        ]:
            return
        if self.is_lock:
            return
        self._change_status(InstanceStatus.OFFLINE)

    def deleting(self):
        """Make instance deleting."""
        if self.status != InstanceStatus.DELETED:
            self._change_status(InstanceStatus.DELETING)

    def deleted(self):
        """Make instance deleted."""
        from geohosting.models.activity import Activity, ActivityStatus
        self._change_status(InstanceStatus.DELETED)
        for activity in Activity.running_activities(self.name):
            activity.status = ActivityStatus.SUCCESS
            activity.save()
        try:
            self.cancel_subscription()
        except Exception as e:
            LogTracker.error(self, f'Cancel subscription : {e}')

    @property
    def credentials(self):
        """Return credentials."""
        credentials = {
            'USERNAME': 'admin'
        }
        try:
            credentials.update(
                get_credentials(
                    self.price.package_group.vault_url,
                    self.name
                )
            )
            LogTracker.success(self, 'Get credential')
            return credentials
        except Exception as e:
            LogTracker.error(self, 'Get credential : {e}')
            raise e

    def checking_server(self):
        """Check server is online or offline."""
        from geohosting_event.models.webhook import WebhookEvent, WebhookStatus
        # If deleted, no need to check
        if self.status in [InstanceStatus.DELETED]:
            return

        # If deleting, we can check the webhook
        if self.status in [InstanceStatus.DELETING]:
            if WebhookEvent.objects.filter(
                    activity__instance=self,
                    data__Status=WebhookStatus.DELETED
            ).exists():
                self.deleted()
            return

        try:
            response = requests.head(self.url)
            if response.status_code in [200, 302]:
                self.online()
            else:
                LogTracker.error(
                    self,
                    (
                        f'Server - {self.url}: '
                        f'{response.status_code} - {response.text}'
                    )
                )
                self.offline()
        except requests.exceptions.ConnectionError as e:
            LogTracker.error(self, f'Server - {self.url}: {e}')
            self.offline()

    def send_credentials(self):
        """Send credentials."""
        from geohosting.utils.email import InstanceEmail
        InstanceEmail(self).send_credentials()

    def cancel_subscription(self):
        """Cancel subscription."""
        if self.status != InstanceStatus.DELETED:
            return

        if not self.subscription:
            return

        self.subscription.cancel_subscription()
        self.subscription.sync_subscription()

    def sync_subscription(self):
        """Sync subscription."""
        from geohosting.models.sales_order import SalesOrder
        sales_orders = SalesOrder.objects.filter(
            subscription__isnull=False,
            instance=self
        )
        for sales_order in sales_orders:
            self.subscription = sales_order.subscription
            self.save()

    @property
    def is_waiting_payment(self) -> bool:
        """Is instance is in waiting payment."""
        from geohosting.utils.email import InstanceEmail
        if not self.subscription:
            return False
        is_waiting_payment = self.subscription.is_waiting_payment
        if is_waiting_payment and not self.subscription.is_expired:
            InstanceEmail(self).send_payment_reminder()
        return is_waiting_payment

    @property
    def is_expired(self) -> bool:
        """Is instance is expired."""
        if not self.subscription:
            return False
        if not self.is_waiting_payment:
            return False
        return self.subscription.is_expired
