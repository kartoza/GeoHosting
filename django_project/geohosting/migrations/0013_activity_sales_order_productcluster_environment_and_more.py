# Generated by Django 4.2.15 on 2024-09-12 05:02

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import geohosting.validators


class Migration(migrations.Migration):

    dependencies = [
        ('geohosting', '0012_salesorder_app_name_alter_salesorder_order_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='sales_order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geohosting.salesorder'),
        ),
        migrations.AddField(
            model_name='productcluster',
            name='environment',
            field=models.CharField(blank=True, help_text='The environment of the instance.', max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='salesorder',
            name='app_name',
            field=models.CharField(blank=True, help_text='App name that would be used for instance.It will also be used for sub domain.', null=True, validators=[django.core.validators.RegexValidator('^[a-zA-Z0-9-]*$', 'Instance name just contains letter, number and dash'), geohosting.validators.app_name_validator]),
        ),
    ]
