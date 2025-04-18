# Generated by Django 4.2.15 on 2025-04-18 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geohosting', '0037_webhookevent_activity_webhookevent_app_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='instance',
            name='expiry_at',
            field=models.DateField(blank=True, help_text='The time when the service will expire due to non-payment.There will be grace time before being deleted.', null=True),
        ),
    ]
