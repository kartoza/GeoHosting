# Generated by Django 4.2.15 on 2025-05-02 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_preferences_grace_period_days_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preferences',
            name='grace_period_days',
            field=models.IntegerField(default=7, help_text='Number of days after expiration that the instance remains active before deletion.'),
        ),
    ]
