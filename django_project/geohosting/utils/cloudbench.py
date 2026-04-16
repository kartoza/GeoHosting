from geohosting.models import Instance, InstanceStatus


def cloudbench_data(instance: Instance):
    """Convert instance to cloudbench data."""
    credentials = instance.credential()
    return {
        "id": instance.id,
        "name": instance.name,
        "url": instance.url,
        "username": credentials["username"],
        "password": credentials["password"],
        "is_active": instance.status in [
            InstanceStatus.DEPLOYING, InstanceStatus.STARTING_UP,
            InstanceStatus.ONLINE, InstanceStatus.OFFLINE
        ],
    }


def patch_config_manager():
    """Monkeypatch ConfigManager.post_process_config to inject GeoHosting instances."""
    try:
        from apps.core.config import ConfigManager
        from apps.core.models import (
            Config, Connection, GeoNodeConnection, PGServiceState
        )
    except ImportError:
        return

    def post_process_config(self, config: Config) -> Config:
        """Inject GeoHosting instance connections into the config."""
        try:
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
        except Exception:
            return config

        existing_geoserver_ids = {c.id for c in config.connections}
        existing_geonode_ids = {c.id for c in config.geonode_connections}
        existing_pg_names = {s.name for s in config.pg_services}

        changed = False
        for instance in instances:
            conn_id = f"geohosting_{instance.id}"
            product_name = instance.price.product.name.lower()
            if 'geoserver' in product_name:
                if conn_id not in existing_geoserver_ids:
                    data = cloudbench_data(instance)
                    config.connections.append(Connection(
                        id=conn_id,
                        name=data["name"],
                        url=data["url"],
                        username=data["username"],
                        password=data["password"],
                        is_active=data["is_active"],
                    ))
                    existing_geoserver_ids.add(conn_id)
                    changed = True

            elif 'geonode' in product_name:
                if conn_id not in existing_geonode_ids:
                    data = cloudbench_data(instance)
                    config.geonode_connections.append(
                        GeoNodeConnection(
                            id=conn_id,
                            name=data["name"],
                            url=data["url"],
                            username=data["username"],
                            password=data["password"],
                            is_active=data["is_active"],
                        )
                    )
                    existing_geonode_ids.add(conn_id)
                    changed = True

            elif 'postgis' in product_name:
                if instance.name not in existing_pg_names:
                    data = cloudbench_data(instance)
                    config.pg_services.append(
                        PGServiceState(name=data['name'])
                    )
                    existing_pg_names.add(instance.name)
                    changed = True

        if changed:
            self._config = config
            self.save()

        return config

    ConfigManager.post_process_config = post_process_config


patch_config_manager()
