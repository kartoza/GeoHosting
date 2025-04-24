from unittest.mock import patch

from rest_framework.test import APITestCase

from core.settings.base import DEFAULT_FROM_EMAIL
from geohosting_event.models.email import EmailEvent


class EmailTests(APITestCase):
    """Email event tests"""

    def test_email_send(self):
        """Test email send."""

        email_instance = None

        def send_email(self):
            """Get email instance."""
            nonlocal email_instance
            email_instance = self
            return True

        with patch('django.core.mail.EmailMessage.send', new=send_email):
            EmailEvent.send_email(
                subject='Test subject',
                to=['test@example.com'],
                body='Test body',
                category='Test category',
            )
            email = EmailEvent.objects.first()
            self.assertEqual(email.subject, 'Test subject')
            self.assertEqual(email.to, ['test@example.com'])
            self.assertEqual(email.from_email, DEFAULT_FROM_EMAIL)
            self.assertEqual(email.body, 'Test body')

            # Check the email instance
            self.assertIsNotNone(email_instance)
            self.assertEqual(email_instance.subject, 'Test subject')
            self.assertEqual(email_instance.to, ['test@example.com'])
            self.assertEqual(email_instance.from_email, DEFAULT_FROM_EMAIL)
            self.assertEqual(email_instance.body, 'Test body')
