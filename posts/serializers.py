from rest_framework import serializers
from .models import Post
from django.contrib.auth import get_user_model
from bson import ObjectId

User = get_user_model()


class PostSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=200)
    content = serializers.CharField()
    type = serializers.CharField(max_length=50)
    locations = serializers.JSONField()
    author = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    resource_link = serializers.URLField(max_length=500)
    is_active = serializers.BooleanField()

    def get_author(self, obj):
        try:
            user = User.objects.get(_id=ObjectId(obj['author_id']))
            return user.username
        except User.DoesNotExist:
            return None

    def create(self, validated_data):
        return Post.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance