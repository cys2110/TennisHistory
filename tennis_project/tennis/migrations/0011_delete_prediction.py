# Generated by Django 5.0.4 on 2024-04-17 17:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tennis', '0010_prediction'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Prediction',
        ),
    ]