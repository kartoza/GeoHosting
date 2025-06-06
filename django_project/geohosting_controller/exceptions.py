# coding=utf-8
"""
GeoHosting Controller.

.. note:: Contains all client exceptions.
"""


class NoClusterException(Exception):
    """No Cluster exception."""

    def __init__(self):  # noqa
        super().__init__('No cluster found.')


class NoProxyApiKeyException(Exception):
    """No Api Key to proxy exception."""

    def __init__(self):  # noqa
        super().__init__('PROXY_API_KEY is required.')


class ActivityException(Exception):
    """Activity exception."""

    def __init__(self, message):  # noqa
        super().__init__(message)


class ConnectionErrorException(Exception):
    """Connection error."""

    def __init__(self, message, response):  # noqa
        super().__init__(message)
        self.response = response
