from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from posts.views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'posts': request.build_absolute_uri('posts/'),
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
]
