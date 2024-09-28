from django.contrib.auth.models import AbstractUser
from djongo import models


class CustomUser(AbstractUser):
    _id = models.ObjectIdField()
    bio = models.TextField(blank=True)

    class Meta:
        abstract = False
