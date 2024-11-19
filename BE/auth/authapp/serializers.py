from rest_framework import serializers
from .models import OAuthCredential

class OAuthCredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = OAuthCredential
        fields = '__all__'