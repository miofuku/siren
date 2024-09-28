from django.shortcuts import render, get_object_or_404
from django.conf import settings
from posts.models import Post


def post_list(request):
    recent_posts = Post.objects.all().order_by('-created_at')[:5]
    return render(request, 'frontend/post_list.html', {
        'posts': recent_posts,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'frontend/post_detail.html', {
        'post': post,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })


def all_posts(request):
    all_posts = Post.objects.all().order_by('-created_at')
    return render(request, 'frontend/all_posts.html', {
        'posts': all_posts,
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY
    })
