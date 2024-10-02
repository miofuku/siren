from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from bson import ObjectId
from .models import Post
from .serializers import PostSerializer
from django.db.models import Q


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Search by content keyword
        keyword = self.request.query_params.get('keyword', None)
        if keyword:
            queryset = queryset.filter(Q(title__icontains=keyword) | Q(content__icontains=keyword))

        # Search by location name
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(locations__name__icontains=location)

        return queryset

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            post = self.queryset.get(_id=ObjectId(pk))
            serializer = self.get_serializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)