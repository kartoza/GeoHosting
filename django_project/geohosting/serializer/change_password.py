"""
GeoHosting.

.. note:: Change password serializer.
"""
from rest_framework import serializers


class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
