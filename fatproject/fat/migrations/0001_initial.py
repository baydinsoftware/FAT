# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(default=b'empty', max_length=400)),
                ('user_picture', models.CharField(default=b'', max_length=400)),
                ('date_updated', models.DateTimeField(auto_now_add=True, verbose_name=b'Date Added')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(default=b'', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=200)),
                ('date_added', models.DateTimeField(auto_now_add=True, verbose_name=b'Date Added')),
                ('waiting', models.BooleanField(default=False)),
                ('last_marked_waiting', models.DateTimeField(default=None, verbose_name=b'Last Marked Waiting')),
                ('email', models.EmailField(default=b'', max_length=250)),
                ('archived', models.BooleanField(default=False)),
                ('owner', models.ForeignKey(related_name='candidates', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'misc', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('notes', models.TextField(default=b'', blank=True)),
                ('rating', models.IntegerField(default=0, null=True)),
                ('secret', models.BooleanField(default=False)),
                ('date_updated', models.DateTimeField(default=None, null=True, verbose_name=b'date published')),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('candidate', models.ForeignKey(related_name='feedbackCollection', to='fat.Candidate')),
            ],
        ),
        migrations.CreateModel(
            name='FeedbackForm',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating_type', models.CharField(default=b'', max_length=200)),
                ('secret_by_default', models.BooleanField(default=False)),
                ('name', models.CharField(default=b'', max_length=200)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'untitled', max_length=200)),
                ('filepath', models.CharField(default=b'/untitled', max_length=200)),
                ('candidate', models.ForeignKey(related_name='files', to='fat.Candidate')),
            ],
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=200)),
                ('archived', models.BooleanField(default=False)),
                ('description', models.TextField(default=b'', blank=True)),
                ('department', models.ForeignKey(related_name='positions', to='fat.Department')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('question_text', models.TextField(default=b'')),
                ('required', models.BooleanField(default=False)),
                ('form', models.ForeignKey(related_name='questions', to='fat.FeedbackForm')),
            ],
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Stage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', unique=True, max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('picture_url', models.CharField(default=b'', max_length=400)),
                ('display_name', models.CharField(default=b'', max_length=50)),
                ('user', models.OneToOneField(related_name='userprofile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WhiteListItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('item', models.CharField(default=b'', max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='feedback',
            name='form',
            field=models.ForeignKey(related_name='feedbacks', to='fat.FeedbackForm'),
        ),
        migrations.AddField(
            model_name='feedback',
            name='stage',
            field=models.ForeignKey(to='fat.Stage', null=True),
        ),
        migrations.AddField(
            model_name='candidate',
            name='position',
            field=models.ForeignKey(related_name='candidates', to='fat.Position'),
        ),
        migrations.AddField(
            model_name='candidate',
            name='source',
            field=models.ForeignKey(to='fat.Source', null=True),
        ),
        migrations.AddField(
            model_name='candidate',
            name='stage',
            field=models.ForeignKey(related_name='candidates', to='fat.Stage'),
        ),
        migrations.AddField(
            model_name='answer',
            name='feedback',
            field=models.ForeignKey(related_name='answers', to='fat.Feedback'),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(to='fat.Question'),
        ),
        migrations.AddField(
            model_name='action',
            name='candidate',
            field=models.ForeignKey(related_name='actions', to='fat.Candidate'),
        ),
    ]
