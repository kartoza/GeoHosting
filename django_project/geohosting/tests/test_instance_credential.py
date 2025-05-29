import os

import requests_mock
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient

from geohosting.models import Product, Instance, Region, Cluster, Package


class InstanceCredential(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            'admin', 'admin@test.com', 'password'
        )
        self.admin_token = Token.objects.create(user=self.admin_user)
        self.regular_user = User.objects.create_user(
            'user', 'user@test.com', 'password'
        )

        self.regular_user_token = Token.objects.create(user=self.regular_user)

        # Create test Region object
        self.region = Region.objects.create(name='Test Region')

        # Create test Cluster object with 'code' and 'region'
        self.cluster = Cluster.objects.create(
            code='Cluster Code',
            region=self.region,
            domain='example.com',
            vault_url='http://example.com/vault',
        )

        self.product_2 = Product.objects.create(
            name='Test Product 2',
            order=1,
            upstream_id='product-2',
            description='Test Description 2',

            # Vault path
            vault_path='/vault/product-2-',
            available=True,
            username_credential='admin',
            password_key_on_vault='PG_PASSWORD'
        )
        # Create a test Product object
        self.product = Product.objects.create(
            name='Test Product',
            order=1,
            upstream_id='product-1',
            description='Test Description',

            # Vault path
            vault_path='/vault/product-1-',
            available=True,
            username_credential='admin',
            password_key_on_vault='PASSWORD'
        )
        self.product.add_on.add(self.product_2)

        # Create test Package with a valid product
        self.package = Package.objects.create(
            product=self.product,  # Assign a valid Product
            name='Test Package',
            price=100.00,
            periodicity='monthly',
            feature_list={'spec': ['10 GB Storage', '2 CPUs', '4 GB RAM']}
        )

        # Create test Instance object
        self.instance = Instance.objects.create(
            name='test-instance',
            price=self.package,
            cluster=self.cluster,
            owner=self.admin_user
        )
        self.instance_url = reverse(
            'instance-credential',
            kwargs={'name': self.instance.name}
        )
        os.environ['VAULT_BASE_URL'] = 'https://vault.do.kartoza.com'
        os.environ['VAULT_ROLE_ID'] = 'VAULT_ROLE_ID'
        os.environ['VAULT_SECRET_ID'] = 'VAULT_SECRET_ID'

    def test_user_fetch_credential(self):
        """Test user fetch credential."""
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.regular_user_token.key
        )
        response = self.client.get(self.instance_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_fetch_credential_not_correct(self):
        """Test user fetch credential."""
        with requests_mock.Mocker() as requests_mocker:
            requests_mocker.post(
                'https://vault.do.kartoza.com/v1/auth/kartoza-apps/login',
                status_code=200,
                json={
                    'auth': {
                        'client_token': 'AAA'
                    }
                }
            )
            requests_mocker.get(
                'http://example.com/vault/vault/product-1-test-instance',
                status_code=200,
                json={
                    'data': {
                        'data': {
                            'username': 'admin',
                        }
                    }
                }
            )
            self.client.credentials(
                HTTP_AUTHORIZATION='Token ' + self.admin_token.key
            )
            response = self.client.get(self.instance_url)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_fetch_credential_correct(self):
        """Test user fetch credential."""
        with requests_mock.Mocker() as requests_mocker:
            requests_mocker.post(
                'https://vault.do.kartoza.com/v1/auth/kartoza-apps/login',
                status_code=200,
                json={
                    'auth': {
                        'client_token': 'AAA'
                    }
                }
            )
            requests_mocker.get(
                'http://example.com/vault/vault/product-1-test-instance',
                status_code=200,
                json={
                    'data': {
                        'data': {
                            'PASSWORD': 'password',
                        }
                    }
                }
            )
            self.client.credentials(
                HTTP_AUTHORIZATION='Token ' + self.admin_token.key
            )
            response = self.client.get(self.instance_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['username'], 'admin')
            self.assertEqual(response.data['password'], 'password')

    def test_admin_fetch_credential_correct_product_2(self):
        """Test user fetch credential."""
        with requests_mock.Mocker() as requests_mocker:
            requests_mocker.post(
                'https://vault.do.kartoza.com/v1/auth/kartoza-apps/login',
                status_code=200,
                json={
                    'auth': {
                        'client_token': 'AAA'
                    }
                }
            )
            requests_mocker.get(
                'http://example.com/vault/vault/product-2-test-instance',
                status_code=200,
                json={
                    'data': {
                        'data': {
                            'PG_PASSWORD': 'pg_password',
                        }
                    }
                }
            )
            self.client.credentials(
                HTTP_AUTHORIZATION='Token ' + self.admin_token.key
            )
            response = self.client.get(
                self.instance_url + '?product=product-2'
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['username'], 'admin')
            self.assertEqual(response.data['password'], 'pg_password')
