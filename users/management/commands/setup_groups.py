from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from posts.models import Post

class Command(BaseCommand):
    help = 'Creates user groups and assigns permissions'

    def handle(self, *args, **options):
        # Create groups
        registered_user, _ = Group.objects.get_or_create(name='Registered User')
        editor, _ = Group.objects.get_or_create(name='Editor')

        # Get content type for Post model
        post_content_type = ContentType.objects.get_for_model(Post)

        # Create permissions
        view_post, _ = Permission.objects.get_or_create(
            codename='view_post',
            name='Can view post',
            content_type=post_content_type,
        )
        create_post, _ = Permission.objects.get_or_create(
            codename='add_post',
            name='Can add post',
            content_type=post_content_type,
        )
        change_post, _ = Permission.objects.get_or_create(
            codename='change_post',
            name='Can change post',
            content_type=post_content_type,
        )
        delete_post, _ = Permission.objects.get_or_create(
            codename='delete_post',
            name='Can delete post',
            content_type=post_content_type,
        )

        # Assign permissions to groups
        registered_user.permissions.add(view_post, create_post)
        editor.permissions.add(view_post, create_post, change_post, delete_post)

        self.stdout.write(self.style.SUCCESS('Successfully set up groups and permissions'))