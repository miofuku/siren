from rest_framework_mongoengine import serializers
from .models import Post, Comment


class CommentSerializer(serializers.EmbeddedDocumentSerializer):
    author = serializers.StringField(source='author.username')

    class Meta:
        model = Comment
        fields = ['content', 'author', 'created_at']


class PostSerializer(serializers.DocumentSerializer):
    author = serializers.StringField(source='author.username')
    comments = CommentSerializer(many=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'type', 'location', 'author', 'created_at', 'updated_at', 'comments']
