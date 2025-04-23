# coding=utf-8
"""
GeoHosting.

.. note:: Email utilities.
"""

from django.template.loader import render_to_string

from core.models.preferences import Preferences
from core.settings.base import FRONTEND_URL
from geohosting.utils.vault import get_credentials
from geohosting_event.models.email import EmailEvent, EmailCategory
from geohosting_event.models.log import LogTracker


class InstanceEmail:
    """Instance email utilities."""
    from geohosting.models.instance import Instance

    def __init__(self, instance: Instance):
        """Initialise an instance."""
        self.Instance = instance

    def send_credentials(self):
        """Send credentials."""
        from geohosting.models.instance import InstanceStatus

        instance = self.Instance
        if instance.status not in [
            InstanceStatus.STARTING_UP, InstanceStatus.ONLINE,
            InstanceStatus.OFFLINE
        ]:
            return
        pref = Preferences.load()
        name = f'{instance.owner.first_name} {instance.owner.last_name}'
        if not instance.price.package_group.vault_url:
            html_content = render_to_string(
                template_name='emails/GeoHosting_Product is Error.html',
                context={
                    'name': name,
                }
            )
        else:
            try:
                get_credentials(
                    instance.price.package_group.vault_url,
                    instance.name
                )
                instance_url = (
                    f"{FRONTEND_URL}#/dashboard?q={instance.name}"
                )
                instance_url = instance_url.replace('#/#', '#')
                html_content = render_to_string(
                    template_name='emails/GeoHosting_Product is Ready.html',
                    context={
                        'name': name,
                        'url': instance.url,
                        'instance_url': instance_url,
                        'app_name': instance.name,
                        'support_email': pref.support_email,
                    }
                )
                LogTracker.success(self, 'Get credential')
            except Exception as e:
                LogTracker.error(self, f'Get credential : {e}')
                html_content = render_to_string(
                    template_name='emails/GeoHosting_Product is Error.html',
                    context={
                        'name': name,
                        'app_name': instance.name,
                        'url': instance.url,
                        'support_email': pref.support_email,
                    }
                )

        # Create the email message
        EmailEvent.send_email(
            subject=f'{instance.name} is ready',
            body=html_content,
            to=[instance.owner.email],
            category=EmailCategory.INSTANCE_NOTIFICATION,
            tags=[f'instance-{instance.id}', f'{instance.name}']
        )
