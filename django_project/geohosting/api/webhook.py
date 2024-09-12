"""
GeoHosting Controller.

.. note:: Webhooks.
"""
import json

from django.http import HttpResponseBadRequest
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from geohosting.models import (
    Activity, ActivityStatus, Instance, Cluster, Package, WebhookEvent
)
from geohosting_controller.variables import ActivityTypeTerm


class WebhookView(APIView):
    """Webhook receiver."""

    permission_classes = (IsAuthenticated, IsAdminUser)

    def post(self, request):
        """Create new instance."""
        data = request.data
        try:
            WebhookEvent.objects.create(
                data=data,
            )

            # Check the data
            app_name = data['app_name']
            activity = Activity.objects.filter(
                status=ActivityStatus.BUILD_ARGO
            ).filter(client_data__app_name=app_name).first()
            if not activity:
                raise Activity.DoesNotExist()

            if (
                    activity.activity_type.identifier ==
                    ActivityTypeTerm.CREATE_INSTANCE.value
            ):
                cluster = Cluster.objects.get(
                    code=activity.post_data['k8s_cluster']
                )
                Instance.objects.create(
                    name=activity.client_data['app_name'],
                    price=activity.sales_order.package,
                    cluster=cluster,
                    owner=activity.triggered_by
                )
            activity.note = json.dumps(data)
            activity.update_status(ActivityStatus.SUCCESS)
            activity.save()
        except (KeyError, Activity.DoesNotExist, Package.DoesNotExist) as e:
            return HttpResponseBadRequest(f'{e}')

        return Response()
