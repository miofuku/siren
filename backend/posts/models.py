from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Post(models.Model):
    TYPE_CHOICES = [
        ('missing_person', 'Missing Person'),
        ('hazard_warning', 'Hazard Warning'),
        ('crime_warning', 'Crime Warning'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    location = models.JSONField()  # Store location as JSON
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)