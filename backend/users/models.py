from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    bio = models.TextField(blank=True)

    meta = {'allow_inheritance': True}

