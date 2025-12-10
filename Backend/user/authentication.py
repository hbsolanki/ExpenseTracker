import jwt
from django.conf import settings
from datetime import datetime, timedelta
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Try Authorization header first
        auth_header = request.headers.get("Authorization")
        
        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                if payload is None:
                    raise AuthenticationFailed("Invalid or expired token")

                try:
                    user = User.objects.get(id=payload["id"])
                    return (user, None)
                except User.DoesNotExist:
                    raise AuthenticationFailed("User not found")
            except IndexError:
                raise AuthenticationFailed("Invalid token format")
        
        return None

def generate_token(user_id, username):
    payload = {
        "id": user_id,
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode_token(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
