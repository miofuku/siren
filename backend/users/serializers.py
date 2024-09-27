from rest_framework_mongoengine import serializers
from .models import CustomUser


class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio']

