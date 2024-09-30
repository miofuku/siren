from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Post
from bson import ObjectId

User = get_user_model()


class PostModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.post = Post.objects.create(
            title='Test Post',
            content='This is a test post content',
            type='general',
            locations={'type': 'Point', 'coordinates': [0, 0]},
            author=self.user
        )

    def test_post_creation(self):
        self.assertTrue(isinstance(self.post, Post))
        self.assertEqual(self.post.__str__(), self.post.title)


class PostAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.force_authenticate(user=self.user)
        self.post_data = {
            'title': 'Test Post',
            'content': 'This is a test post',
            'type': 'test',
            'locations': {'lat': 40.7128, 'lng': -74.0060}
        }

    def test_create_post(self):
        response = self.client.post('/api/posts/', self.post_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ObjectId.is_valid(response.data['id']))

    def test_get_posts(self):
        post = Post.objects.create(author=self.user, **self.post_data)
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(post._id))




