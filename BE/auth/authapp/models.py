from django.db import models

# Create your models here.
class OAuthCredential(models.Model):
    user_code = models.CharField(max_length=100)
    access_token = models.CharField(max_length=100)
    token_type = models.CharField(max_length=100)
    expires_in = models.IntegerField()
    refresh_token = models.CharField(max_length=100)
    scope = models.CharField(max_length=100)
    created_at = models.IntegerField()
    secret_valid_until = models.IntegerField()
    def __str__(self):
        return self.user_code
    