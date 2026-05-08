from django.urls import path
from .views import SignupAPI, LoginAPI

urlpatterns = [
    # These match the blueprint endpoints
    path('api/signup/', SignupAPI.as_view(), name='api-signup'),
    path('api/login/', LoginAPI.as_view(), name='api-login'),
]