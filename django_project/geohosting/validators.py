from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

app_name_exist_error_message = 'Application name is already taken.'
app_name_max_error_message = (
    'Application name is too long, maximum is 50 characters.'
)


def app_name_validator(app_name):
    """Application name validator."""
    from geohosting.models.activity import Activity
    from geohosting.models.instance import Instance, InstanceStatus
    if app_name:
        if len(app_name) > 50:
            raise ValidationError(app_name_max_error_message)
        if Instance.objects.filter(
                name=app_name
        ).exclude(status=InstanceStatus.DELETED).count():
            raise ValidationError(app_name_exist_error_message)

        if Activity.running_activities(app_name).count():
            raise ValidationError(app_name_exist_error_message)
    else:
        raise ValidationError('Application name cannot be empty.')


regex_name = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
regex_name_error = (
    'Name may only contain lowercase letters, '
    'numbers or dashes (not at start or end).'
)
name_validator = RegexValidator(regex_name, regex_name_error)
