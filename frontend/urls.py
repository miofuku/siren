from django.urls import path
from .views import ReactAppView

urlpatterns = [
    path('', ReactAppView.as_view(), name='react_app'),
    path('post/<str:pk>/', ReactAppView.as_view(), name='post_detail'),
]