from django.urls import path
from .views import OAuthCredentialCreate, OAuthCredentialList

urlpatterns = [
    path('credentials/', OAuthCredentialCreate.as_view(), name='credentials-create'),
    # path('credentials/list/', OAuthCredentialList.as_view(), name='credentials-list'),
]