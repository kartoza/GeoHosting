# coding=utf-8
"""
GeoHosting.

.. note:: Instance create form.
"""
from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.models import Q

from geohosting.models.activity import (
    Activity, ActivityType, ActivityStatus,
    Instance, name_validator
)
from geohosting.models.package import Package
from geohosting.models.product import ProductCluster
from geohosting.models.region import Region
from geohosting.models.sales_order import SalesOrder
from geohosting_controller.exceptions import (
    NoClusterException
)
from geohosting_controller.variables import ActivityTypeTerm
from geohosting.validators import app_name_validator
User = get_user_model()


class CreateInstanceForm(forms.ModelForm):
    """Instance create form.

    Creating instance through activity.
    """

    app_name = forms.CharField(
        validators=[name_validator, app_name_validator]
    )
    package = forms.ModelChoiceField(
        queryset=Package.objects.all()
    )
    region = forms.ModelChoiceField(
        queryset=Region.objects.all()
    )
    sales_order = forms.ModelChoiceField(
        queryset=SalesOrder.objects.all(),
        required=False
    )

    class Meta:  # noqa: D106
        model = Activity
        fields = ['app_name', 'package', 'region', 'sales_order']

    def _post_data(self):
        """Refactor data."""
        activity = self.instance
        activity_type = activity.activity_type.identifier
        if activity_type == ActivityTypeTerm.CREATE_INSTANCE.value:
            data = activity.client_data
            try:
                # TODO:
                #  Later fix using region input
                #  Change keys when API is universal

                app_name = data['app_name']
                package_id = data['package_id']
                region_id = data['region_id']
                package = Package.objects.get(id=package_id)
                product = package.product
                return {
                    'subdomain': app_name,
                    'k8s_cluster': product.productcluster_set.get(
                        cluster__region_id=region_id
                    ).cluster.code,
                    'geonode_size': package.package_code,
                    'geonode_name': app_name
                }
            except ProductCluster.DoesNotExist:
                raise NoClusterException()
        raise ActivityType.DoesNotExist()

    def clean(self):
        """Clean form."""
        cleaned_data = super().clean()
        app_name = cleaned_data.get('app_name')
        package = cleaned_data.get('package')
        region = cleaned_data.get('region')

        data = {
            'app_name': app_name,
            'package_id': package.id,
            'package_code': package.package_code,
            'product_name': package.product.name,
            'region_id': region.id,
            'region_name': region.name
        }
        cleaned_data['client_data'] = data
        self.instance.client_data = data
        activity_type_id = ''
        try:
            activity_type_id = ActivityTypeTerm.CREATE_INSTANCE.value
            self.instance.activity_type_id = ActivityType.objects.get(
                identifier=activity_type_id
            ).id
            self.instance.triggered_by = self.user

            # Get post data
            self.instance.post_data = self._post_data()
        except AttributeError:
            raise forms.ValidationError('User is missing.')
        except ActivityType.DoesNotExist:
            raise forms.ValidationError(
                f'Activity type {activity_type_id} does not exist.'
            )
        except Exception as e:
            raise forms.ValidationError(f'{e}')
        return cleaned_data
