# coding=utf-8
"""
GeoHosting.

.. note:: Instance model.
"""

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.db import models
from django.template.loader import render_to_string

from geohosting.models.cluster import Cluster
from geohosting.models.package import Package
from geohosting.models.product import ProductCluster
from geohosting.utils.vault import get_credentials

User = get_user_model()


class InstanceStatus:
    """Instance Status."""

    DEPLOYING = 'Deploying'
    ONLINE = 'Online'
    OFFLINE = 'Offline'


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
            (InstanceStatus.ONLINE, InstanceStatus.ONLINE),
            (InstanceStatus.OFFLINE, InstanceStatus.OFFLINE),
        )
    )

    def __str__(self):
        """Return activity type name."""
        return self.name

    class Meta:  # noqa
        unique_together = ('name', 'cluster')

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

    def online(self):
        """Make instance online."""
        self.status = InstanceStatus.ONLINE
        self.send_credentials()
        self.save()

    def offline(self):
        """Make instance offline."""
        self.status = InstanceStatus.OFFLINE
        self.save()

    def send_credentials(self):
        """Send credentials."""
        if self.status != InstanceStatus.ONLINE:
            return
        name = f'{self.owner.first_name} {self.owner.last_name}'
        if not self.price.package_group.vault_url:
            html_content = render_to_string(
                template_name='credential_email_not_found.html',
                context={
                    'name': name,
                }
            )
        else:
            try:
                credentials = get_credentials(
                    self.price.package_group.vault_url
                )
                html_content = render_to_string(
                    template_name='credential_email.html',
                    context={
                        'name': name,
                        'url': self.url,
                        'credentials': [
                            {"key": key, "value": value} for key, value in
                            credentials.items()
                        ]
                    }
                )
            except Exception:
                html_content = render_to_string(
                    template_name='credential_email_not_found.html',
                    context={
                        'name': name,
                    }
                )

        # Create the email message
        email = EmailMessage(
            subject=f'{self.name} is ready',
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.owner.email]
        )
        email.content_subtype = 'html'
        email.send()
