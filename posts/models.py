from djongo import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Post(models.Model):
    _id = models.ObjectIdField()
    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=50)
    locations = models.JSONField(default=list)  # This will store the locations as a JSON array
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
