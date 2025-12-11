from rest_framework import serializers
from .models import Expense
from datetime import date

class ExpenseSerializer(serializers.ModelSerializer):

    class Meta:
        model=Expense
        fields=["id","title","amount","category","date","created_at"]
        read_only_fields=["created_at"]


    def validate_date(self,value):
        if value>date.today():
            raise serializers.ValidationError("Future Date can not be Allow!! ")
        
        return value
        
    def validate_amount(self,value):
        if value==0:
            raise serializers.ValidationError("Amount Can't be Zero!")
        elif value<0:
            raise serializers.ValidationError("Amount Can't be Negative")
        
        return value