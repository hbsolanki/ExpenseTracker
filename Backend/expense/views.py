from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .serializers import ExpenseSerializer
from .models import Expense

class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    serializer_class=ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


