# Generated by Django 4.2.15 on 2024-08-11 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OAuthCredential',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_code', models.CharField(max_length=100)),
                ('access_token', models.CharField(max_length=100)),
                ('token_type', models.CharField(max_length=100)),
                ('expires_in', models.IntegerField()),
                ('refresh_token', models.CharField(max_length=100)),
                ('scope', models.CharField(max_length=100)),
                ('created_at', models.IntegerField()),
                ('secret_valid_until', models.IntegerField()),
            ],
        ),
    ]