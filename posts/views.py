from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

    def list(self, request):
        limit = request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
                queryset = self.queryset[:limit]
            except ValueError:
                return Response({"error": "Invalid limit parameter"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryset = self.queryset

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