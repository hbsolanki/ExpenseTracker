from django.urls import path,include
from .views import ExpenseViewSet
from rest_framework.routers import DefaultRouter

router=DefaultRouter()

router.register(r"",ExpenseViewSet,basename="expense")

urlpatterns = [
    path("",include(router.urls))
]
