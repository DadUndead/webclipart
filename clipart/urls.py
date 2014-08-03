# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^categories/$', 'clipart.views.get_categories'),
    url(r'^images/$', 'clipart.views.get_images'),
)
