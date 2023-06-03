from django.urls import path
from .views import ShoeGeneratorView

urlpatterns = [
    path('generate/', ShoeGeneratorView.as_view()),
]