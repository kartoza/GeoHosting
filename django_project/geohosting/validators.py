from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db.models import Q

app_name_exist_error_message = 'App name is already taken.'


def app_name_validator(app_name):
    """App name validator."""
    from geohosting.models.activity import Activity, ActivityStatus
    from geohosting.models.instance import Instance
    if app_name:
        if Instance.objects.filter(
                name=app_name
        ).count():
            raise ValidationError(app_name_exist_error_message)

        if Activity.objects.filter(
                client_data__app_name=app_name
        ).exclude(
            Q(status=ActivityStatus.ERROR) |
            Q(status=ActivityStatus.SUCCESS)
        ):
            raise ValidationError(app_name_exist_error_message)


regex_name = r'^[a-z0-9-]*$'
regex_name_error = (
    'Name may only contain lowercase letters, numbers or dashes.'
)
name_validator = RegexValidator(regex_name, regex_name_error)
