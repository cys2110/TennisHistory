# Generated by Django 5.0.4 on 2024-04-14 15:17

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tennis', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='wct_round',
            field=models.CharField(blank=True, choices=[('128', 'Round of 128'), ('64', 'Round of 64'), ('32', 'Round of 32'), ('16', 'Round of 16'), ('QF', 'Quarterfinals'), ('SF', 'Semifinals'), ('F', 'Final'), ('W', 'Win'), ('RR', 'Round robin'), ('G', 'Gold'), ('S', 'Silver'), ('B', 'Bronze'), ('A', 'Alternate')], max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='player',
            name='wct_years',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, null=True, size=None),
        ),
    ]
