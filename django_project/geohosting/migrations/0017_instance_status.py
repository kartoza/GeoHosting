# Generated by Django 4.2.15 on 2024-09-21 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geohosting', '0016_package_price_list_salesorder_invoice'),
    ]

    operations = [
        migrations.AddField(
            model_name='instance',
            name='status',
            field=models.CharField(choices=[('Deploying', 'Deploying'), ('Online', 'Online'), ('Offline', 'Offline')], default='Deploying'),
        ),
    ]