from rest_framework import generics, status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import requests

from .models import OAuthCredential
from .serializers import OAuthCredentialSerializer

import os

UID = os.environ.get('FORTYTWO_UID')
SECRET = os.environ.get('FORTYTWO_SECRET')

import logging

# 로거 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create your views here.
class OAuthCredentialCreate(generics.CreateAPIView):
    queryset = OAuthCredential.objects.all()
    serializer_class = OAuthCredentialSerializer

    @swagger_auto_schema(
        operation_description="Retrieve OAuth token using authorization code",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'code': openapi.Schema(type=openapi.TYPE_STRING, description='Authorization code')
            }
        ),
        responses={200: 'Success', 400: 'Code is required'}
    )

    def post(self, request, *args, **kwargs):
        
        logger.info(f"request.data: {request.data}")

        code = request.data.get('code')
        if not code:
            return Response({"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # query if it is already in the database
        oAuthCredential = OAuthCredential.objects.filter(user_code=code).first()
        logger.info(f"oAuthCredential: {oAuthCredential}")
        if oAuthCredential:
            return Response(OAuthCredentialSerializer(oAuthCredential).data, status=status.HTTP_200_OK)

        token_url = 'https://api.intra.42.fr/oauth/token'
        code_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': UID,
            'client_secret': SECRET,
            'redirect_uri': 'http://localhost',
        }

        resp = requests.post(token_url, data=code_data)
        if not (200 <= resp.status_code < 300):
            logger.info(f"code_data: {code_data}")
            logger.info(f"Status Code: {resp.status_code}")
            logger.info(f"Response JSON: {resp.json()}")
            return Response(resp.json(), status=resp.status_code)

        token_data = resp.json()
        oAuthCredential = OAuthCredential(
            user_code=code,
            access_token=token_data.get('access_token'),
            token_type=token_data.get('token_type'),
            expires_in=token_data.get('expires_in'),
            refresh_token=token_data.get('refresh_token'),
            scope=token_data.get('scope'),
            created_at=token_data.get('created_at'),
            secret_valid_until=token_data.get('secret_valid_until')
        )
        oAuthCredential.save()

        return Response(OAuthCredentialSerializer(oAuthCredential).data, status=status.HTTP_201_CREATED)


class OAuthCredentialList(generics.ListAPIView):
    queryset = OAuthCredential.objects.all()
    serializer_class = OAuthCredentialSerializer

    @swagger_auto_schema(
        operation_description="Retrieve all OAuth credentials",
        responses={200: 'Success'}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)