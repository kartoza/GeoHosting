from geohosting.models import Instance, InstanceStatus


def cloudbench_data(instance: Instance):
    """Convert instance to cloudbench data."""
    product = instance.price.product
    try:
        credentials = instance.credential()
    except Exception:
        credentials = {
            "username": product.username_credential,
            "password": ""
        }
    return {
        "id": instance.id,
        "name": instance.name,
        "url": instance.url,
        "username": credentials["username"],
        "password": credentials["password"],
        "is_active": True
    }


def patch_config_manager():
    """Monkeypatch ConfigManager.post_process_config."""
    try:
        from apps.core.config import ConfigManager
        from apps.core.models import (
            Config, Connection, GeoNodeConnection, PGService
        )
    except ImportError:
        return

    class PRODUCT_NAMES:
        """Contains product names."""

        GEOSERVER = 'geoserver'
        GEONODE = 'geonode'
        POSTGIS = 'postgis'

    def post_process_config(self, config: Config) -> Config:
        """Inject GeoHosting instance connections into the config."""

        def _get_instance_connection_id(_instance: Instance):
            return f"geohosting_{_instance.id}"

        def _get_product_name(_instance: Instance):
            return instance.price.product.name.lower()

        # ----------------------------------------------
        # Add the new instance connections to the config
        # ----------------------------------------------
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.get(pk=self._user_id)
        instances = Instance.objects.select_related(
            'price__product'
        ).filter(
            owner=user,
            status__in=[
                InstanceStatus.DEPLOYING,
                InstanceStatus.STARTING_UP,
                InstanceStatus.ONLINE,
                InstanceStatus.OFFLINE,
            ]
        )
        # Names that is running
        instance_names = instances.values_list('name', flat=True)

        existing_geoserver_ids = {c.id for c in config.connections}
        existing_geonode_ids = {c.id for c in config.geonode_connections}
        existing_pg_ids = {s.id for s in config.pg_services}

        def _update_password_if_empty(items, conn_id, _instance):
            for item in items:
                if item.id == conn_id and not item.password:
                    data = cloudbench_data(_instance)
                    if data["password"]:
                        item.password = data["password"]
                        return True
            return False

        changed = False
        for instance in instances:
            is_active = instance.status in [
                InstanceStatus.ONLINE,
            ]
            conn_id = _get_instance_connection_id(instance)
            product_name = _get_product_name(instance)
            if product_name == PRODUCT_NAMES.GEOSERVER:
                # Add it
                if conn_id not in existing_geoserver_ids:
                    data = cloudbench_data(instance)
                    config.connections.append(
                        Connection(
                            id=conn_id,
                            name=data["name"],
                            url=data["url"] + '/geoserver',
                            username=data["username"],
                            password=data["password"],
                            is_active=is_active,
                        )
                    )
                    existing_geoserver_ids.add(conn_id)
                    changed = True
                else:
                    changed |= _update_password_if_empty(
                        config.connections, conn_id, instance
                    )

            elif product_name == PRODUCT_NAMES.GEONODE:
                # Add it
                if conn_id not in existing_geonode_ids:
                    data = cloudbench_data(instance)
                    config.geonode_connections.append(
                        GeoNodeConnection(
                            id=conn_id,
                            name=data["name"],
                            url=data["url"],
                            username=data["username"],
                            password=data["password"],
                            is_active=is_active,
                        )
                    )
                    existing_geonode_ids.add(conn_id)
                    changed = True
                else:
                    changed |= _update_password_if_empty(
                        config.geonode_connections, conn_id, instance
                    )

            elif product_name == PRODUCT_NAMES.POSTGIS:
                if conn_id not in existing_pg_ids:
                    data = cloudbench_data(instance)
                    host = data["url"].removeprefix("https://").removeprefix(
                        "http://")
                    config.pg_services.append(
                        PGService(
                            id=conn_id,
                            name=data["name"],
                            host=host,
                            port=5432,
                            dbname="gis",
                            user=data["username"],
                            password=data["password"],
                            is_active=is_active,
                            sslmode="require"
                        )
                    )
                    existing_pg_ids.add(conn_id)
                    changed = True
                else:
                    changed |= _update_password_if_empty(
                        config.pg_services, conn_id, instance
                    )

        # ----------------------------------------------
        # Delete instance from config if it's deleted'
        # ----------------------------------------------
        instances = Instance.objects.select_related(
            'price__product'
        ).filter(
            owner=user,
            status__in=[
                InstanceStatus.DELETING,
                InstanceStatus.DELETED
            ]
        ).exclude(
            name__in=instance_names
        )
        for instance in instances:
            conn_id = _get_instance_connection_id(instance)
            product_name = _get_product_name(instance)
            if product_name == PRODUCT_NAMES.GEOSERVER:
                filtered = [
                    c for c in config.connections if c.id != conn_id
                ]
                if len(filtered) != len(config.connections):
                    config.connections = filtered
                    changed = True
            elif product_name == PRODUCT_NAMES.GEONODE:
                filtered = [
                    c for c in config.geonode_connections if c.id != conn_id
                ]
                if len(filtered) != len(config.geonode_connections):
                    config.geonode_connections = filtered
                    changed = True
            elif product_name == PRODUCT_NAMES.POSTGIS:
                filtered = [
                    s for s in config.pg_services if s.name != instance.name
                ]
                if len(filtered) != len(config.pg_services):
                    config.pg_services = filtered
                    changed = True

        if changed:
            self._config = config
            self.save()

        return config

    ConfigManager.post_process_config = post_process_config


patch_config_manager()
