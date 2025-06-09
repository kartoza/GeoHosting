import mock
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from core.models.preferences import Preferences
from geohosting.models.support import Ticket


class TicketSyncTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='password123'
        )
        self.user.userprofile.erpnext_code = 'User - 1'
        self.user.userprofile.save()

        pref = Preferences.load()
        pref.erpnext_project_code = 'erpnext_project_code'
        pref.save()

    @mock.patch('geohosting.models.support.fetch_erpnext_data')
    def test_sync_tickets(self, mock_fetch_erpnext_data):
        response = [
            {
                'customer': 'User - 1',
                'raised_by': 'testuser@test.com',
                'subject': 'Subject 1',
                'description': 'Description 1',
                'creation': "2000-01-01 00:00:00.000000",
                'modified': "2000-01-02 00:00:00.000000",
                'status': 'Open',
                'name': 'Ticket -1'
            },
            {
                'customer': 'User - 2',
                'raised_by': 'testuser_2@test.com',
                'subject': 'Subject 2',
                'description': 'Description 2',
                'creation': "2000-02-01 00:00:00.000000",
                'modified': "2000-02-02 00:00:00.000000",
                'status': 'Closed',
                'name': 'Ticket -2'
            }
        ]

        mock_fetch_erpnext_data.return_value = response
        Ticket.sync_data()
        tickets = Ticket.objects.all()
        self.assertEqual(tickets.count(), 2)
        self.assertEqual(
            tickets[0].erpnext_code,
            "Ticket -1"
        )
        self.assertEqual(
            tickets[0].user,
            self.user
        )
        self.assertEqual(
            tickets[0].customer,
            'testuser@test.com'
        )
        self.assertEqual(
            tickets[0].subject,
            "Subject 1"
        )
        self.assertEqual(
            tickets[0].details,
            "Description 1"
        )
        self.assertEqual(
            tickets[0].status,
            "open"
        )
        self.assertEqual(
            tickets[0].updated_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-01-02 00:00:00.000000"
        )
        self.assertEqual(
            tickets[0].created_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-01-01 00:00:00.000000"
        )

        self.assertEqual(
            tickets[1].erpnext_code,
            "Ticket -2"
        )
        self.assertEqual(
            tickets[1].user,
            None
        )
        self.assertEqual(
            tickets[1].customer,
            'testuser_2@test.com'
        )
        self.assertEqual(
            tickets[1].subject,
            "Subject 2"
        )
        self.assertEqual(
            tickets[1].details,
            "Description 2"
        )
        self.assertEqual(
            tickets[1].status,
            "closed"
        )
        self.assertEqual(
            tickets[1].updated_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-02-02 00:00:00.000000"
        )
        self.assertEqual(
            tickets[1].created_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-02-01 00:00:00.000000"
        )

    @mock.patch('geohosting.models.support.fetch_erpnext_data')
    def test_sync_with_existing_one(self, mock_fetch_erpnext_data):
        ticket = Ticket.objects.create(
            erpnext_code='Ticket new - 1',
            user=self.user,
            customer='testuser@test.com',
            status='open',
            subject='Subject 1',
            details='First ticket'
        )
        ticket.created_at = '2000-01-01 00:00:00.000000'
        ticket.updated_at = '2000-01-02 00:00:00.000000'
        ticket.save()

        ticket = Ticket.objects.create(
            erpnext_code='Ticket new - 1',
            customer='testuser@test.com',
            status='open',
            subject='Subject 1 duplicate',
            details='First ticket duplicate'
        )
        ticket.created_at = '2000-01-01 00:00:00.000000'
        ticket.updated_at = '2000-01-02 00:00:00.000000'
        ticket.save()

        response = [
            {
                'customer': 'User - 1',
                'raised_by': 'testuser@test.com',
                'subject': 'Subject 1',
                'description': 'Description 1',
                'creation': "2000-03-01 00:00:00.000000",
                'modified': "2000-03-02 00:00:00.000000",
                'status': 'Resolved',
                'name': 'Ticket new - 1'
            },
            {
                'customer': 'User - 2',
                'raised_by': 'testuser_2@test.com',
                'subject': 'Subject 2',
                'description': 'Description 2',
                'creation': "2000-02-01 00:00:00.000000",
                'modified': "2000-02-02 00:00:00.000000",
                'status': 'Closed',
                'name': 'Ticket new - 2'
            }
        ]

        mock_fetch_erpnext_data.return_value = response
        Ticket.sync_data()
        tickets = Ticket.objects.all()
        self.assertEqual(tickets.count(), 3)

        self.assertEqual(
            tickets[0].erpnext_code,
            "Ticket new - 1"
        )
        self.assertEqual(
            tickets[0].subject,
            "Subject 1"
        )
        self.assertEqual(
            tickets[0].details,
            "First ticket"
        )
        self.assertEqual(
            tickets[0].status,
            "open"
        )
        self.assertEqual(
            tickets[0].updated_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-01-02 00:00:00.000000"
        )
        self.assertEqual(
            tickets[0].created_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-01-01 00:00:00.000000"
        )

        # Updated ticket
        self.assertEqual(
            tickets[1].erpnext_code,
            "Ticket new - 1"
        )
        self.assertEqual(
            tickets[1].subject,
            "Subject 1 duplicate"
        )
        self.assertEqual(
            tickets[1].details,
            "First ticket duplicate"
        )
        self.assertEqual(
            tickets[1].status,
            "resolved"
        )
        self.assertEqual(
            tickets[1].updated_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-03-02 00:00:00.000000"
        )
        self.assertEqual(
            tickets[1].created_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-01-01 00:00:00.000000"
        )

        # New ticket
        self.assertEqual(
            tickets[2].erpnext_code,
            "Ticket new - 2"
        )
        self.assertEqual(
            tickets[2].subject,
            "Subject 2"
        )
        self.assertEqual(
            tickets[2].details,
            "Description 2"
        )
        self.assertEqual(
            tickets[2].status,
            "closed"
        )
        self.assertEqual(
            tickets[2].updated_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-02-02 00:00:00.000000"
        )
        self.assertEqual(
            tickets[2].created_at.strftime('%Y-%m-%d %H:%M:%S.%f'),
            "2000-02-01 00:00:00.000000"
        )
