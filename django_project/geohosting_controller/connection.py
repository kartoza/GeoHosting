# coding=utf-8
"""
GeoHosting Controller.

.. note:: Connection to the server
"""
import os
from urllib.parse import urlparse

import requests

from geohosting_controller.exceptions import (
    NoJenkinsTokenException, NoJenkinsUserException
)


def return_user_token():
    """Return user and token."""
    user = os.environ.get('JENKINS_USER', None)
    if not user:
        raise NoJenkinsUserException()

    token = os.environ.get('JENKINS_TOKEN', None)
    if not token:
        raise NoJenkinsTokenException()
    return user, token


def auth():
    """Return headers."""
    user, token = return_user_token()
    return user, token


def get_crumb(url):
    """Return crumb."""
    parsed_uri = urlparse(url)
    host = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    user, token = auth()
    response = requests.get(
        f'{host}crumbIssuer/api/json',
        auth=(user, token),
        verify=False
    )
    return response.json()['crumb']


def _request_get(url: str, params: dict = None):
    """Request to server."""
    user, token = auth()
    return requests.get(
        url, params=params if params else {},
        headers={
            'Jenkins-Crumb': get_crumb(url)
        },
        auth=(user, token),
        verify=False
    )


def request_get(url: str, params: dict = None):
    """Handle get connection."""
    return _request_get(url, params=params)


def _request_post(url: str, data: dict):
    """Request to server."""
    user, token = auth()
    return requests.post(
        url,
        params=data,
        headers={
            'Jenkins-Crumb': get_crumb(url)
        },
        auth=(user, token),
        verify=False
    )


def request_post(url: str, data: dict):
    """Handle post connection."""
    return _request_post(url, data=data)
