# Generated by Django 4.2.15 on 2024-11-20 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_remove_preferences_vault_token_preferences_site_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='preferences',
            name='support_email',
            field=models.EmailField(default='info@kartoza.com', max_length=255),
        ),
    ]
