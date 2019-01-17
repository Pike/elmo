# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-01-17 13:25
from __future__ import unicode_literals

from django.db import migrations


def drop_legacy_groups(apps, schema_editor):
    (
        apps.get_model('auth', 'Group')
        .objects
        .filter(name__in=
            (
                'build',
                'WebLocalizers',
            )
        )
        .delete()
    )


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('auth', '0008_alter_user_username_max_length'),
    ]

    operations = [
        migrations.RunPython(
            drop_legacy_groups,
            migrations.RunPython.noop
        ),
    ]
