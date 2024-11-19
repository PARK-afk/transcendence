#!/bin/bash

# docker-compose 에서만 사용, kube 에서는 사용하지 않을 것
# 데이터베이스가 준비될 때까지 대기
# while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
#   echo "Waiting for the Postgres database to be available..."
#   sleep 1
# done
# docker-compose 에서만 사용, kube 에서는 사용하지 않을 것

# 데이터베이스 마이그레이션 적용
python manage.py makemigrations authapp
python manage.py migrate --noinput

# Django 애플리케이션 실행
python manage.py runserver 0.0.0.0:8001
# exec "$@"
