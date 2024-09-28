from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('post/<str:pk>/', views.post_detail, name='post_detail'),
    path('all-posts/', views.all_posts, name='all_posts'),
]