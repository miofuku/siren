from djongo import models
from django.contrib.auth import get_user_model
from bson import ObjectId

User = get_user_model()


class Post(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=50)
    locations = models.JSONField(default=list)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resource_link = models.URLField(max_length=500, default="https://example.com")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title