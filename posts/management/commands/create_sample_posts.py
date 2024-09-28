from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates 10 sample posts for the InfoShare platform'

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
                'coordinates': [-73.9822, 40.7532]
            },
            {
                'name': 'Barclays Center',
                'coordinates': [-73.9758, 40.6828]
            },
            {
                'name': 'Bryant Park',
                'coordinates': [-73.9832, 40.7536]
            },
            {
                'name': 'East Village',
                'coordinates': [-73.9818, 40.7264]
            },
            {
                'name': 'Central Park',
                'coordinates': [-73.9665, 40.7829]
            }
        ]

        titles = [
            "Community Clean-up Day",
            "Free Health Check-up Camp",
            "Local Art Exhibition",
            "Neighborhood Watch Meeting",
            "Farmers Market Opening",
            "Street Fair Announcement",
            "Emergency Preparedness Workshop",
            "Lost Pet Alert",
            "Traffic Diversion Notice",
            "Volunteer Recruitment Drive"
        ]

        for i in range(10):
            post = Post.objects.create(
                title=titles[i],
                content=f"This is sample content for the post: {titles[i]}. Please check the details and participate!",
                type=random.choice(post_types),
                locations=[random.choice(locations)],
                author=user,
                created_at=timezone.now() - timezone.timedelta(days=random.uniform(0, 4))  # Random time within the last 4 days
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created post: {post.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully created 10 sample posts'))