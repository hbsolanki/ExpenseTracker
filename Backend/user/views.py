from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import User
from django.contrib.auth.hashers import make_password,check_password
from .authentication import generate_token,verify_token,decode_token


class UserViewSet(viewsets.ModelViewSet):

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        name = request.data.get('name')
        username = request.data.get('username')
        password = request.data.get('password')

        if not name or not username or not password:
            return Response({"error": "name, username, password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "username already exists"}, status=400)
        
        user=User.objects.create(name=name,username=username,password=make_password(password))
        token=generate_token(user.id,username)

        return Response({"token":token})
        

    @action(detail=False,methods=['post'],permission_classes=[AllowAny])
    def login(self,request):
        username=request.data.get('username')
        password=request.data.get('password')

        if not username or not password:
            return Response({"error": "name, username, password required"}, status=400)
        
        user=User.objects.filter(username=username).first()
        if user is None:
            return Response({"error":"username not found"},status=400)
        
        if not check_password(password,user.password):
            return Response({"error":"wrong password"},status=400)
        
        token=generate_token(user.id,username)

        return Response({"token":token})
    
    @action(detail=False,methods=["post"])
    def logout(self,request):
        pass
        



