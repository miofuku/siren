from mongoengine import Document, StringField, EmailField, DateTimeField


class CustomUser(Document):
    username = StringField(max_length=150, unique=True, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(required=True)  # In practice, use proper password hashing
    bio = StringField()
    date_joined = DateTimeField()

