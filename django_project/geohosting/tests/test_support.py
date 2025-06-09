import mock
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from core.models.preferences import Preferences
from geohosting.models.support import Ticket
from geohosting.serializer.support import TicketSerializer


def fake_post_to_erpnext(*args, **kwargs):
    user = User.objects.get(username='testuser')
    user.userprofile.erpnext_code = 'ERP Code'
    user.userprofile.save()


class TicketTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='password123'
        )
        pref = Preferences.load()
        pref.erpnext_project_code = 'erpnext_project_code'
        pref.save()
        # Authenticate the client
        self.client.force_authenticate(user=self.user)

    def test_create_ticket_failed(self):
        # Define the payload for a successful ticket creation
        payload = {
            'subject': 'Test Ticket',
            'details': 'Details of the test ticket',
            'status': 'open',
            'customer': 'testuser@test.com'
        }
        response = self.client.post(
            '/api/tickets/', payload, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json()[0],
            'User does not have an ERPNext code, please contact support.'
        )

    @mock.patch('geohosting.models.user_profile.UserProfile.post_to_erpnext')
    def test_create_ticket_success(self, mock_post_to_erpnext):
        # Use a function as the mock
        payload = {
            'subject': 'Test Ticket',
            'details': 'Details of the test ticket',
            'status': 'open',
            'customer': 'testuser@test.com'
        }
        mock_post_to_erpnext.side_effect = fake_post_to_erpnext
        response = self.client.post(
            '/api/tickets/', payload, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['subject'], payload['subject'])

    def test_create_ticket_invalid_data(self):
        # Define the payload with missing required fields
        payload = {
            'subject': '',  # Invalid subject
        }
        response = self.client.post(
            '/api/tickets/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('details', response.data)


class GetTicketsTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )

        # Create another user to ensure we only fetch tickets for the authenticated user
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='otherpassword'
        )

        # Create tickets for the authenticated user
        self.ticket1 = Ticket.objects.create(
            customer=self.user.email,
            subject="Issue 1",
            details="Details of issue 1",
            status="open", issue_type="bug",
            user=self.user
        )
        self.ticket2 = Ticket.objects.create(
            customer=self.user.email,
            subject="Issue 2",
            details="Details of issue 2",
            status="open",
            issue_type="support",
            user=self.user
        )

        # Create a ticket for another user
        self.ticket3 = Ticket.objects.create(
            customer=self.other_user.email,
            subject="Issue 3",
            details="Details of issue 3",
            status="open",
            issue_type="feature",
            user=self.other_user
        )

        # Initialize the client and authenticate the user
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_tickets(self):
        # Define the URL for the get_tickets view
        url = reverse('tickets-list')

        # Send a GET request to the get_tickets endpoint
        response = self.client.get(url)

        # Fetch the tickets for the authenticated user directly from the database
        tickets = Ticket.objects.filter(customer=self.user.email).order_by(
            '-updated_at'
        )
        serializer = TicketSerializer(tickets, many=True)

        # Verify that the status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the returned data matches the serialized ticket data
        self.assertEqual(response.data['results'], serializer.data)

        # Ensure only the tickets belonging to the authenticated user are returned
        self.assertEqual(len(response.data['results']), 2)
        self.assertNotIn(self.ticket3, tickets)

    def tearDown(self):
        # Clean up any created objects
        self.user.delete()
        self.other_user.delete()
        Ticket.objects.all().delete()


class AttachmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='password123'
        )
        # Authenticate the client
        self.client.force_authenticate(user=self.user)
        # Create a test ticket
        self.ticket = Ticket.objects.create(
            subject='Test Ticket',
            details='Details of the test ticket',
            status='open'
        )

    def test_upload_attachments_success(self):
        # Create a mock file
        mock_file = SimpleUploadedFile(
            "test_file.txt", b"test content", content_type="text/plain")
        response = self.client.post(
            f'/api/tickets/{self.ticket.id}/attachments/',
            {'file': mock_file},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_upload_attachments_ticket_not_found(self):
        # Upload attachments to a non-existent ticket
        mock_file = SimpleUploadedFile(
            "test_file.txt", b"test content", content_type="text/plain")
        response = self.client.post(
            '/api/tickets/999/attachments/',
            {'file': mock_file},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_attachments_invalid_file(self):
        # Upload a file without providing the file field
        response = self.client.post(
            f'/api/tickets/{self.ticket.id}/attachments/',
            {},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
