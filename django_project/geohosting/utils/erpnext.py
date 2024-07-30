import json

import requests

from django.conf import settings


def fetch_erpnext_data(doctype, filters = None):
    url = f"{settings.ERPNEXT_BASE_URL}/api/resource/{doctype}"
    params = {}

    headers = {
        'Authorization': f'token {settings.ERPNEXT_API_KEY}:'
                         f'{settings.ERPNEXT_API_SECRET}'
    }

    if filters:
        params = {
            'filters': json.dumps(filters),
            'fields': '["*"]'
        }

    try:
        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()
            if 'data' in data:
                return data['data']
            return data
        else:
            return (
                f"Error: Unable to fetch data. Status code: "
                f"{response.status_code}, "
                f"Message: {response.text}"
            )
    except Exception as e:
        return f"Exception occurred: {str(e)}"
