# Generated by Django 4.2.15 on 2024-11-26 06:48

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('geohosting', '0030_agreement_agreementdetail_salesorderagreement'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesorderagreement',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
