from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from bson import ObjectId
from .models import Post
from .serializers import PostSerializer
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if start_date:
            start_date = make_aware(parse_datetime(start_date))
            queryset = queryset.filter(created_at__gte=start_date)

        if end_date:
            end_date = make_aware(parse_datetime(end_date))
            queryset = queryset.filter(created_at__lte=end_date)

        # Filter by location
        latitude = self.request.query_params.get('latitude', None)
        longitude = self.request.query_params.get('longitude', None)
        radius = self.request.query_params.get('radius', None)  # in kilometers

        if latitude and longitude and radius:
            lat, lon, rad = float(latitude), float(longitude), float(radius)
            queryset = queryset.filter(
                locations__coordinates__geo_within_center=[[lon, lat], rad / 111.12]
            )

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
