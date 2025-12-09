import jwt 
from django.conf import settings
from datetime import datetime,timedelta
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BaseAuthentication
from .models import User


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get("Authorization")

        if not auth or not auth.startswith("Bearer "):
            return None  # no authentication → DRF will handle

        token = auth.split(" ")[1]
        payload = decode_token(token)

        if payload is None:
            raise AuthenticationFailed("Invalid or expired token")

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)

def generate_token(user_id, username):
    # create payload
    payload = {
        "id": user_id,
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token):
    # return payload or None
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def verify_token(token):
    # True if valid
    return decode_token(token) is not None
