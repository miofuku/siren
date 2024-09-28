from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample posts for the InfoShare platform'

    def handle(self, *args, **kwargs):
        # Ensure we have a user to associate with posts
        user, created = User.objects.get_or_create(
            username='admin',
            email='admin@example.com',
            is_staff=True,
            is_superuser=True
        )
        if created:
            user.set_password('adminpassword')
            user.save()

        # Sample data
        post_types = ['community_event', 'public_service', 'crime_warning']
        locations = [
            {
                'name': 'New York Public Library',
                'latitude': 40.7532,
                'longitude': -73.9822
            },
            {
                'name': 'Barclays Center',
                'latitude': 40.6828,
                'longitude': -73.9758
            },
            {
                'name': 'Bryant Park',
                'latitude': 40.7536,
                'longitude': -73.9832
            },
            {
                'name': 'East Village',
                'latitude': 40.7264,
                'longitude': -73.9818
            }
        ]

        posts_data = [
            {
                'title': 'Book Donation Drive',
                'content': 'Donate your used books at any of these locations to support local libraries!',
                'type': 'community_event',
                'locations': [locations[0]]
            },
            {
                'title': 'New COVID-19 Testing Sites',
                'content': 'Additional COVID-19 testing sites have been set up at these locations.',
                'type': 'public_service',
                'locations': [locations[1]]
            },
            {
                'title': 'Free Yoga Classes in Parks',
                'content': 'Join us for free yoga classes every Saturday morning at these locations!',
                'type': 'community_event',
                'locations': [locations[2]]
            },
            {
                'title': 'Bike Theft Warning',
                'content': 'There have been reports of increased bike thefts in these areas. Please be cautious!',
                'type': 'crime_warning',
                'locations': [locations[3]]
            }
        ]

        for post_data in posts_data:
            post = Post.objects.create(
                title=post_data['title'],
                content=post_data['content'],
                type=post_data['type'],
                locations=post_data['locations'],
                author=user,
                created_at=timezone.now() - timezone.timedelta(days=random.randint(0, 30))
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created post: {post.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully created sample posts'))
