# cloudbench

This package integrates GeoHosting-managed instances into the CloudBench `ConfigManager` at runtime via monkeypatching.

## Purpose

CloudBench maintains its own config model (`Config`) with lists of connections for GeoServer, GeoNode, and PostGIS services. This package ensures that instances provisioned through GeoHosting are automatically reflected in that config — without requiring changes to the CloudBench codebase.

## Structure

```
cloudbench/
├── __init__.py
├── monkeypatch.py   # Patches ConfigManager.post_process_config
└── README.md
```

## How it works

`monkeypatch.py` defines `patch_config_manager()`, which is called once during Django app startup (in `GeoHostingAppConfig.ready()`).

It replaces `ConfigManager.post_process_config` with a custom implementation that:

1. **Adds** connections for active GeoHosting instances (statuses: `DEPLOYING`, `STARTING_UP`, `ONLINE`, `OFFLINE`) that are not yet in the config:
   - GeoServer instances → `config.connections` (as `Connection`)
   - GeoNode instances → `config.geonode_connections` (as `GeoNodeConnection`)
   - PostGIS instances → `config.pg_services` (as `PGServiceState`)

2. **Removes** connections for instances with status `DELETED` that still exist in the config.

3. **Saves** the config only if something actually changed.

## Entry point

```python
# geohosting/apps.py
def ready(self):
    from geohosting.cloudbench.monkeypatch import patch_config_manager
    patch_config_manager()
```

The patch is a no-op if `apps.core.config.ConfigManager` cannot be imported (i.e. CloudBench is not installed), so GeoHosting can run without CloudBench.

## Connection ID format

GeoHosting-managed connections use a stable ID format:

```
geohosting_<instance.id>
```

This allows the sync logic to identify which connections originated from GeoHosting.

## Adding support for a new product type

1. Add the product name constant to the `PRODUCT_NAMES` class in `monkeypatch.py`.
2. In the **add** loop, append the appropriate model to the relevant `config.*` list.
3. In the **delete** loop, filter the relevant `config.*` list to remove the entry.