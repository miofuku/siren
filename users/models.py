from django.contrib.auth.models import AbstractUser
from djongo import models
from bson import ObjectId


class CustomUser(AbstractUser):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.username

    @property
    def role(self):
        if self.is_superuser:
            return "Admin"
        elif self.groups.filter(name='Editor').exists():
            return "Editor"
        elif self.groups.filter(name='Registered User').exists():
            return "Registered User"
        else:
            return "Anonymous User"