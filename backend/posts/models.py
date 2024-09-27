from mongoengine import Document, StringField, ReferenceField, DateTimeField, PointField, ListField, EmbeddedDocument, \
    EmbeddedDocumentField


class Comment(EmbeddedDocument):
    content = StringField(required=True)
    author = ReferenceField(CustomUser)
    created_at = DateTimeField()


class Post(Document):
    TYPE_CHOICES = (
        ('missing_person', 'Missing Person'),
        ('hazard_warning', 'Hazard Warning'),
        ('crime_warning', 'Crime Warning'),
        ('other', 'Other'),
    )

    title = StringField(max_length=200, required=True)
    content = StringField(required=True)
    type = StringField(max_length=20, choices=TYPE_CHOICES)
    location = PointField()
    author = ReferenceField(CustomUser)
    created_at = DateTimeField()
    updated_at = DateTimeField()
    comments = ListField(EmbeddedDocumentField(Comment))
