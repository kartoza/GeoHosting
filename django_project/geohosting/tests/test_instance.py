from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from geohosting.models import Instance, Package, Cluster
from geohosting.serializer.instance import InstanceSerializer

class InstanceViewSetTests(APITestCase):
    def setUp(self):
        """Create test user and instances."""
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        
        # Create test objects
        self.cluster = Cluster.objects.create(name='Test Cluster', domain='example.com')
        self.package = Package.objects.create(
            product=None,  # Assuming you have a product or leave it as is
            name='Test Package',
            price=100.00,
            periodicity='monthly',
            feature_list={'spec': ['10 GB Storage', '2 CPUs', '4 GB RAM']}
        )
        self.instance = Instance.objects.create(
            name='Test Instance',
            price=self.package,
            cluster=self.cluster,
            owner=self.user
        )

    def test_get_queryset(self):
        """Test that get_queryset returns instances for the authenticated user."""
        response = self.client.get('/api/instances/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)  # Check that we have one instance
        self.assertEqual(data[0]['name'], self.instance.name)

    def test_my_instances(self):
        """Test the custom action to return instances for the current user."""
        response = self.client.get('/api/instances/my_instances/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)  # Check that we have one instance
        self.assertEqual(data[0]['name'], self.instance.name)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access the API."""
        self.client.logout()  # Log out the user
        response = self.client.get('/api/instances/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        response = self.client.get('/api/instances/my_instances/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
