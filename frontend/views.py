from django.shortcuts import render, get_object_or_404
from django.conf import settings
from posts.models import Post
from bson import ObjectId
from django.utils import timezone
from datetime import timedelta
from django.views.generic import TemplateView


class ReactAppView(TemplateView):
    template_name = 'index.html'
