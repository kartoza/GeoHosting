# coding=utf-8
"""
GeoHosting Controller.

.. note:: Project level settings.
"""
import os  # noqa
import sys  # noqa

from .contrib import *  # noqa

ALLOWED_HOSTS = ['*']
ADMINS = ()
DATABASES = {
    'default': {
        'ENGINE': os.environ.get(
            'DATABASE_ENGINE', 'django.contrib.gis.db.backends.postgis'
        ),
        'NAME': os.environ['DATABASE_NAME'],
        'USER': os.environ['DATABASE_USERNAME'],
        'PASSWORD': os.environ['DATABASE_PASSWORD'],
        'HOST': os.environ['DATABASE_HOST'],
        'PORT': os.environ.get('DATABASE_PORT', '5432'),
        'TEST_NAME': 'unittests',
        'TEST': {
            'NAME': 'unittests',
        },
    }
}

# Set debug to false for production
DEBUG = TEMPLATE_DEBUG = False

# Extra installed apps
INSTALLED_APPS = INSTALLED_APPS + (
    'core',
    'geohosting_event',
    'geohosting',
    'geohosting_controller'
)

# Kartoza CloudBench apps
CLOUDBENCH_APPS = (
    'apps.core',
    'apps.ai',
    'apps.bridge',
    'apps.connections',
    'apps.dashboard',
    'apps.geonode',
    'apps.geoserver',
    'apps.gwc',
    'apps.iceberg',
    'apps.mergin',
    'apps.postgres',
    'apps.qfieldcloud',
    'apps.qgis',
    'apps.query',
    'apps.s3',
    'apps.search',
    'apps.sqlview',
    'apps.sync',
    'apps.terria',
    'apps.upload'
)

INSTALLED_APPS += CLOUDBENCH_APPS

FIXTURE_DIRS = ['geohosting_controller/fixtures']

ERPNEXT_API_KEY = os.environ.get('ERPNEXT_API_KEY', '')
ERPNEXT_API_SECRET = os.environ.get('ERPNEXT_API_SECRET', '')
ERPNEXT_BASE_URL = os.environ.get('ERPNEXT_BASE_URL', '')

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': (
            'django.contrib.auth.password_validation.'
            'UserAttributeSimilarityValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.MinimumLengthValidator'
        ),
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.CommonPasswordValidator'
        ),
    },
    {
        'NAME': (
            'django.contrib.auth.password_validation.NumericPasswordValidator'
        ),
    },
]

# --------------------------------------
# CELERY
# --------------------------------------
CELERY_BROKER_URL = CELERY_BROKER_REDIS_URL

# --------------------------------------
# STRIPE
# --------------------------------------
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')

# --------------------------------------
# PAYSTACK
# --------------------------------------
PAYSTACK_PUBLISHABLE_KEY = os.environ.get('PAYSTACK_PUBLISHABLE_KEY', '')
PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_SECRET_KEY', '')

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
        "OPTIONS": {
            "location": MEDIA_ROOT,
        },
    },
    "staticfiles": {
        "BACKEND": (
            "django.contrib.staticfiles.storage.StaticFilesStorage"
        )
    },
}
# ------------------------------------
# CLOUDBENCH ENVIRONMENT VARIABLES
# ------------------------------------

# Add kartoza-cloudbench to sys.path so 'apps.*' modules can be imported
CLOUDBENCH_PATH = os.environ.get(
    'CLOUDBENCH_PATH',
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__), '../../../kartoza-cloudbench'
        )
    )
)
if CLOUDBENCH_PATH not in sys.path:
    sys.path.insert(0, CLOUDBENCH_PATH)

CLOUDBENCH_MUST_AUTHENTICATED = True

XDG_CACHE_HOME = os.environ.get(
    "XDG_CACHE_HOME",
    os.path.expanduser("~/.cache/kartoza-cloudbench"),
)
# Chunked upload settings
UPLOAD_CHUNK_SIZE = 5 * 1024 * 1024  # 5MB chunks
UPLOAD_TEMP_DIR = os.path.join(XDG_CACHE_HOME, "uploads")
UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024  # 10GB max
