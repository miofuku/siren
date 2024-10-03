from rest_framework import viewsets, filters, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from django.conf import settings
from pymongo import MongoClient
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)


class PostViewSet(viewsets.ViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        client = MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]
        collection = db['posts_post']

        query = {'is_active': True}

        # Filter by latest posts
        latest = self.request.query_params.get('latest')
        if latest:
            try:
                latest = int(latest)
            except ValueError:
                latest = None

        # Search by content keyword
        keyword = self.request.query_params.get('keyword')
        if keyword:
            query['$or'] = [
                {'title': {'$regex': keyword, '$options': 'i'}},
                {'content': {'$regex': keyword, '$options': 'i'}}
            ]

        # Search by location name
        location = self.request.query_params.get('location')
        if location:
            query['locations.name'] = {'$regex': location, '$options': 'i'}

        cursor = collection.find(query).sort('created_at', -1)
        if latest:
            cursor = cursor.limit(latest)

        posts = list(cursor)
        for post in posts:
            post['_id'] = str(post['_id'])
            post['author_id'] = str(post['author_id'])

        client.close()
        return posts

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        client = MongoClient(settings.DATABASES['default']['CLIENT']['host'])
        db = client[settings.DATABASES['default']['NAME']]
        collection = db['posts_post']

        post = collection.find_one({'_id': ObjectId(pk)})
        if post:
            post['_id'] = str(post['_id'])
            post['author_id'] = str(post['author_id'])
            serializer = self.serializer_class(post)
            return Response(serializer.data)
        else:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
