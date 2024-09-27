INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'rest_framework.authtoken',
    'api',
    'users',
    'posts',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# MongoDB settings
import mongoengine

mongoengine.connect(
    db="your_database_name",
    host="localhost"
)
