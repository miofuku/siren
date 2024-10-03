from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    locations = serializers.JSONField()

    class Meta:
        model = Post
        fields = ['_id', 'title', 'content', 'type', 'locations', 'author', 'created_at', 'updated_at', 'resource_link']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['_id'] = str(representation['_id'])
        return representation
