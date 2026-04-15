#!/bin/sh

# Exit script in case of error
set -e

echo $"\n\n\n"
echo "-----------------------------------------------------"
echo "STARTING DJANGO ENTRYPOINT $(date)"
echo "-----------------------------------------------------"

# Run NPM
cd /home/web/django_project/geohosting
echo "npm install"
npm install --verbose
echo "npm build-react"
npm run build-react

# Build CloudBench frontend
cd /home/web/kartoza-cloudbench/web
echo "npm install (cloudbench)"
npm install --verbose
echo "npm run build (cloudbench)"
VITE_API_BASE=${VITE_API_BASE:-/api/cloudbench} npm run build

# Run initialization
cd /home/web/django_project
echo 'Running initialize.py...'
python -u initialize.py

echo "-----------------------------------------------------"
echo "FINISHED DJANGO ENTRYPOINT --------------------------"
echo "-----------------------------------------------------"

# Run the CMD
exec "$@"