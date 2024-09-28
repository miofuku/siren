from djongo import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    _id = models.ObjectIdField()
    bio = models.TextField(blank=True)

    class Meta:
        abstract = False
