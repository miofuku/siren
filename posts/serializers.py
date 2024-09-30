from rest_framework import serializers
from .models import Post
from bson import ObjectId


class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)


class PostSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'type', 'locations', 'author', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']

    def get_id(self, obj):
        return str(obj._id)

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

