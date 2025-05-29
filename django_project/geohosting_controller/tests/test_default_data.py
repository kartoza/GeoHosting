# coding=utf-8
"""GeoHosting Controller."""

from django.contrib.auth import get_user_model
from django.test.testcases import TestCase

from geohosting_controller.default_data import (
    get_jenkin_activity_types, get_regions, get_clusters, get_product_clusters,
    get_product_metadata
)

User = get_user_model()


class DefaultDataTest(TestCase):
    """Test default data functions."""

    def test_get_jenkin_activity_types(self):
        """Test get_jenkin_activity_types."""
        all_config = get_jenkin_activity_types()
        for key, configs in all_config.items():
            for config in configs:
                self.assertIsNotNone(config['identifier'])
                self.assertIsNotNone(config['jenkins_url'])
                self.assertIsNotNone(config['mapping'])
                self.assertTrue(len(config.keys()) == 3)

    def test_get_regions(self):
        """Test get_regions."""
        regions = get_regions()
        for row in regions:
            self.assertIsNotNone(row['code'])
            self.assertIsNotNone(row['name'])
            self.assertTrue(len(row.keys()) == 2)

    def test_get_clusters(self):
        """Test get_clusters."""
        clusters = get_clusters()
        for row in clusters:
            self.assertIsNotNone(row['code'])
            self.assertIsNotNone(row['region'])
            self.assertIsNotNone(row['domain'])
            self.assertIsNotNone(row['vault_url'])
            self.assertTrue(len(row.keys()) == 4)

    def test_get_product_clusters(self):
        """Test get_product_clusters."""
        all_config = get_product_clusters()
        for key, config in all_config.items():
            self.assertIsNotNone(config['cluster'])
            self.assertIsNotNone(config['region'])
            self.assertIsNotNone(config['environment'])
            self.assertTrue(len(config.keys()) == 3)

    def test_get_product_metadata(self):
        """Test get_product_metadata."""
        all_config = get_product_metadata()
        for key, config in all_config.items():
            self.assertIsNotNone(config['is_add_on'])
            self.assertIsNotNone(config['url_as_addon'])
            self.assertIsNotNone(config['vault_path'])
            self.assertIsNotNone(config['username_credential'])
            self.assertIsNotNone(config['password_key_on_vault'])
            self.assertIsNotNone(config['add_on'])
            self.assertTrue(isinstance(config['add_on'], list))
