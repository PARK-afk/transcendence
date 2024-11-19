# base image
FROM python:3.9-slim

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# set work directory
WORKDIR /code

# install dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# copy project
COPY . /code/

# copy entrypoint.sh
COPY entrypoint.sh /code/entrypoint.sh

# copy env
COPY .env /code/

# List contents of /code to debug
RUN ls -la /code/

# Ensure entrypoint.sh is executable
RUN chmod +x /code/entrypoint.sh

# set entrypoint
ENTRYPOINT ["/code/entrypoint.sh"]
CMD python manage.py runserver 0.0.0.0:8001