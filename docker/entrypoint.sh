#!/bin/sh
set -e

cd /var/www/html

# Run database migrations automatically when the container starts.
php artisan migrate --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
