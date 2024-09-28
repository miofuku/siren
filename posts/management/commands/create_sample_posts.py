from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone
from bson import ObjectId

User = get_user_model()


class Command(BaseCommand):
    help = 'Cleans up the database and creates 10 sample posts with multiple locations'

    def handle(self, *args, **kwargs):
        self.stdout.write('Cleaning up the database...')

        # Delete all posts
        Post.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All posts deleted'))

        # Delete users more carefully
        self.stdout.write('Attempting to delete users...')
        for user in User.objects.all():
            try:
                if user.pk:
                    user.delete()
                    self.stdout.write(self.style.SUCCESS(f'Deleted user: {user.username}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Skipping user without primary key: {user.username}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error deleting user {user.username}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('User deletion process completed'))

        # Create a sample user
        try:
            user = User.objects.create_user(
                username='sampleuser',
                email='sample@example.com',
                password='samplepassword'
            )
            self.stdout.write(self.style.SUCCESS(f'Sample user created with id: {user.pk}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating sample user: {str(e)}'))
            return

        # Verify user creation
        try:
            user = User.objects.get(username='sampleuser')
            self.stdout.write(self.style.SUCCESS(f'Verified sample user with id: {user.pk}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('Failed to retrieve the sample user'))
            return

        # Sample data
        sample_posts = [
            {
                'title': 'Missing Dog in Central Park',
                'content': 'Our golden retriever, Max, went missing near Bethesda Fountain. Please help us find him!',
                'type': 'missing_pet',
                'locations': [
                    {'name': 'Bethesda Fountain', 'coordinates': [-73.9712, 40.7735]},
                    {'name': 'Belvedere Castle', 'coordinates': [-73.9692, 40.7794]},
                ]
            },
            {
                'title': 'Traffic Alert: Multiple Road Closures',
                'content': 'Due to the upcoming marathon, several roads will be closed this Sunday.',
                'type': 'traffic_alert',
                'locations': [
                    {'name': 'Times Square', 'coordinates': [-73.9855, 40.7580]},
                    {'name': 'Central Park South', 'coordinates': [-73.9746, 40.7659]},
                    {'name': 'Columbus Circle', 'coordinates': [-73.9819, 40.7681]},
                ]
            },
            {
                'title': 'Community Cleanup Event',
                'content': 'Join us for a cleanup event at multiple locations across the city!',
                'type': 'community_event',
                'locations': [
                    {'name': 'Prospect Park', 'coordinates': [-73.9701, 40.6602]},
                    {'name': 'Brooklyn Bridge Park', 'coordinates': [-73.9962, 40.7024]},
                ]
            },
            {
                'title': 'Lost Wallet near Subway Stations',
                'content': 'I lost my brown leather wallet yesterday evening. It might be at one of these stations.',
                'type': 'lost_item',
                'locations': [
                    {'name': '34th St - Penn Station', 'coordinates': [-73.9910, 40.7506]},
                    {'name': '42nd St - Times Square', 'coordinates': [-73.9872, 40.7557]},
                ]
            },
            {
                'title': 'Art Exhibition across Multiple Galleries',
                'content': 'Check out the new contemporary art exhibition happening at these locations!',
                'type': 'event',
                'locations': [
                    {'name': 'MoMA', 'coordinates': [-73.9776, 40.7614]},
                    {'name': 'Guggenheim Museum', 'coordinates': [-73.9590, 40.7830]},
                    {'name': 'Whitney Museum', 'coordinates': [-74.0089, 40.7396]},
                ]
            },
            {
                'title': 'Farmers Markets This Weekend',
                'content': 'Fresh produce and local goods available at these farmers markets!',
                'type': 'event',
                'locations': [
                    {'name': 'Union Square Greenmarket', 'coordinates': [-73.9904, 40.7359]},
                    {'name': 'Grand Army Plaza Greenmarket', 'coordinates': [-73.9709, 40.6752]},
                ]
            },
            {
                'title': 'Bike Theft Warning',
                'content': 'There have been reports of increased bike thefts in these areas. Please be cautious!',
                'type': 'crime_warning',
                'locations': [
                    {'name': 'East Village', 'coordinates': [-73.9837, 40.7265]},
                    {'name': 'Williamsburg', 'coordinates': [-73.9573, 40.7081]},
                ]
            },
            {
                'title': 'Free Yoga Classes in Parks',
                'content': 'Join us for free yoga classes every Saturday morning at these locations!',
                'type': 'community_event',
                'locations': [
                    {'name': 'Bryant Park', 'coordinates': [-73.9832, 40.7536]},
                    {'name': 'Hudson River Park', 'coordinates': [-74.0099, 40.7270]},
                ]
            },
            {
                'title': 'New COVID-19 Testing Sites',
                'content': 'Additional COVID-19 testing sites have been set up at these locations.',
                'type': 'public_service',
                'locations': [
                    {'name': 'Barclays Center', 'coordinates': [-73.9776, 40.6826]},
                    {'name': 'Javits Center', 'coordinates': [-74.0020, 40.7578]},
                    {'name': 'Queens Museum', 'coordinates': [-73.8468, 40.7457]},
                ]
            },
            {
                'title': 'Book Donation Drive',
                'content': 'Donate your used books at any of these locations to support local libraries!',
                'type': 'community_event',
                'locations': [
                    {'name': 'New York Public Library', 'coordinates': [-73.9822, 40.7532]},
                    {'name': 'Brooklyn Public Library', 'coordinates': [-73.9681, 40.6725]},
                    {'name': 'Queens Public Library', 'coordinates': [-73.7948, 40.7135]},
                ]
            },
        ]

        # Create posts
        for post_data in sample_posts:
            try:
                post = Post.objects.create(
                    title=post_data['title'],
                    content=post_data['content'],
                    type=post_data['type'],
                    author=user,
                    locations=post_data['locations']
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created post: {post.title}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating post: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Sample data creation process completed'))



