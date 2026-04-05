from django.urls import path
from .views import CalculateView

urlpatterns = [
    path('', CalculateView.as_view(), name='calculate'),
]
