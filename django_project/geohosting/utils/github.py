import requests
from django.conf import settings


class DevopsGithubClient:
    """Github Client to access the Github API for devops github."""

    API_BASE_URL = "https://api.github.com"
    REPO_PATH = "repos/kartoza/kartoza-devops"

    def __init__(self):
        self.token = getattr(settings, 'KARTOZA_DEVOPS_REPO_TOKEN', None)
        if not self.token:
            raise ValueError('KARTOZA_DEVOPS_REPO_TOKEN is not set')
        self.headers = {
            'Authorization': f'token {self.token}',
            'Accept': 'application/vnd.github.v3.raw'
        }

    def get_content(self, path: str, ref: str = 'main') -> str:
        """
        Fetch content from GitHub repository.

        :param path: Relative path to the content
        :param ref: Git reference (branch, tag, or commit SHA)
        :return: Content data as dictionary
        """
        url = f"{self.API_BASE_URL}/{self.REPO_PATH}/contents/{path}"
        response = requests.get(
            url,
            headers=self.headers,
            params={'ref': ref}
        )
        response.raise_for_status()
        return response.text
