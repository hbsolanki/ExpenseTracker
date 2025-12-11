from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from .models import User
from .authentication import generate_token
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .serializers import UserSerializer,UserUpdateSerializer

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    serializer_class=UserSerializer

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        name = request.data.get("name")
        username = request.data.get("username")
        password = request.data.get("password")
        image=request.FILES.get("image")

        if not name or not username or not password:
            return Response({"error": "Missing fields"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "username exists"}, status=400)
        
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error":list(e.messages)},status=400)


        user = User.objects.create(
            name=name,
            username=username,
            password=make_password(password),
            image=image
        )

        token = generate_token(user.id, username)

        return Response({
            "message": "register success",
            "token": token,
            "id":user.id,
        })

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Missing fields"}, status=400)

        user = User.objects.filter(username=username).first()
        if not user:
            return Response({"error": "username not found"}, status=400)

        if not check_password(password, user.password):
            return Response({"error": "wrong password"}, status=400)
        
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error":list(e.messages)},status=400)

        token = generate_token(user.id, username)

        return Response({
            "message": "login success",
            "token": token,
            "id":user.id
        })

    @action(detail=False, methods=["post"])
    def logout(self, request):
        return Response({"message": "logout success"})
  
    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()

        if request.user.id != user.id:
            return Response({"error": "Forbidden"}, status=403)

        return Response({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "image": user.image.url if user.image else None
        })
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)  
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)