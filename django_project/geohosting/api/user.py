"""
GeoHosting Controller.

.. note:: User.
"""
from django.http import HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from geohosting.serializer.change_password import ChangePasswordSerializer


class ChangePasswordView(APIView):
    """Change password view."""

    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """Put method to change password."""
        try:
            password = request.data['old_password']
            new_password = request.data['new_password']

            user = request.user
            if not user.check_password(raw_password=password):
                return HttpResponseBadRequest('Old password is not correct.')
            else:
                user.set_password(new_password)
                user.save()
                return Response('password changed successfully')
        except KeyError as e:
            return HttpResponseBadRequest(f'{e} is required')