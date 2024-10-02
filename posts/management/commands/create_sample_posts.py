from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample posts for the InfoShare platform with multiple locations'

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
        post_types = ['community_event', 'public_service', 'crime_warning', 'traffic_update']
        locations = [
            {
                'name': 'New York Public Library',
                'address': '476 5th Ave, New York, NY 10018',
                'coordinates': [-73.9822, 40.7532]
            },
            {
                'name': 'Barclays Center',
                'address': '620 Atlantic Ave, Brooklyn, NY 11217',
                'coordinates': [-73.9758, 40.6828]
            },
            {
                'name': 'Bryant Park',
                'address': 'Between 40th and 42nd Streets & Fifth and Sixth Avenues, New York, NY 10018',
                'coordinates': [-73.9832, 40.7536]
            },
            {
                'name': 'East Village',
                'address': 'East Village, New York, NY',
                'coordinates': [-73.9818, 40.7264]
            },
            {
                'name': 'Central Park',
                'address': 'Central Park, New York, NY',
                'coordinates': [-73.9665, 40.7829]
            },
            {
                'name': 'Times Square',
                'address': 'Manhattan, NY 10036',
                'coordinates': [-73.9855, 40.7580]
            },
            {
                'name': 'Brooklyn Bridge',
                'address': 'Brooklyn Bridge, New York, NY 10038',
                'coordinates': [-73.9969, 40.7061]
            },
            {
                'name': 'Statue of Liberty',
                'address': 'New York, NY 10004',
                'coordinates': [-74.0445, 40.6892]
            }
        ]

        posts_data = [
            {
                'title': "City-wide Clean-up Initiative",
                'content': "Join our city-wide clean-up initiative this weekend! We're targeting multiple locations across the city to make our community cleaner and greener.",
                'type': 'community_event',
                'locations_count': random.randint(2, 4)
            },
            {
                'title': "Multi-location Health Check-up Camp",
                'content': "Free health check-up camps are being organized at various locations throughout the city. Visit your nearest camp for a comprehensive health check-up.",
                'type': 'public_service',
                'locations_count': random.randint(3, 5)
            },
            {
                'title': "Neighborhood Watch Alert",
                'content': "Recent reports of suspicious activity in multiple areas. Stay vigilant and report any unusual behavior to the local authorities.",
                'type': 'crime_warning',
                'locations_count': random.randint(2, 3)
            },
            {
                'title': "Weekend Traffic Diversions",
                'content': "Due to the annual marathon, expect traffic diversions and road closures at several key points in the city this weekend.",
                'type': 'traffic_update',
                'locations_count': random.randint(4, 6)
            },
            {
                'title': "Mobile Vaccination Units",
                'content': "COVID-19 vaccination drive continues with mobile units visiting different neighborhoods. Check if a unit is coming to your area!",
                'type': 'public_service',
                'locations_count': random.randint(3, 5)
            }
        ]

        for post_data in posts_data:
            post_locations = random.sample(locations, post_data['locations_count'])
            post = Post.objects.create(
                title=post_data['title'],
                content=post_data['content'],
                type=post_data['type'],
                locations=post_locations,
                author=user,
                created_at=timezone.now() - timezone.timedelta(days=random.uniform(0, 7))
            )
            self.stdout.write(
                self.style.SUCCESS(f"Successfully created post: {post.title} with {len(post_locations)} locations"))

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(posts_data)} sample posts with multiple locations'))
