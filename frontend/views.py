from django.shortcuts import render, get_object_or_404
from django.conf import settings
from posts.models import Post
from bson import ObjectId
from django.utils import timezone
from datetime import timedelta


def post_list(request):
    three_days_ago = timezone.now() - timedelta(days=3)
    recent_posts = Post.objects.filter(created_at__gte=three_days_ago).order_by('-created_at')
    return render(request, 'frontend/post_list.html', {
        'posts': recent_posts,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })


def post_detail(request, pk):
    post = get_object_or_404(Post, _id=ObjectId(pk))
    return render(request, 'frontend/post_detail.html', {
        'post': post,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })


def all_posts(request):
    three_days_ago = timezone.now() - timedelta(days=3)
    all_posts = Post.objects.filter(created_at__gte=three_days_ago).order_by('-created_at')
    return render(request, 'frontend/all_posts.html', {
        'posts': all_posts,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })
