# coding=utf-8
"""
GeoHosting.

.. note:: Test GeoHosting.
"""

from django.test import TestCase

from geohosting.factories import SalesOrderErpCompanyFactory
from geohosting.models.sales_order import SalesOrderErpCompany


class SalesOrderErpCompanyCRUDTest(TestCase):
    """SalesOrderErpCompany test case."""

    Factory = SalesOrderErpCompanyFactory
    Model = SalesOrderErpCompany

    def test_create_object(self):
        """Test create object."""
        obj = self.Factory()
        self.assertIsInstance(obj, self.Model)
        self.assertTrue(self.Model.objects.filter(id=obj.id).exists())

    def test_read_object(self):
        """Test read object."""
        obj = self.Factory()
        fetched_obj = self.Model.objects.get(id=obj.id)
        self.assertEqual(obj, fetched_obj)

    def test_update_object(self):
        """Test update object."""
        obj = self.Factory()
        new_company = "Updated Name"
        obj.erp_company = new_company
        obj.save()
        updated_obj = self.Model.objects.get(id=obj.id)
        self.assertEqual(updated_obj.erp_company, new_company)

    def test_delete_object(self):
        """Test delete object."""
        obj = self.Factory()
        _id = obj.id
        obj.delete()
        self.assertFalse(self.Model.objects.filter(id=_id).exists())
