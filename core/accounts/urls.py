from django.urls import path
from .views import SignupAPI, LoginAPI
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('api/signup/', SignupAPI.as_view(), name='signup'),
    path('api/login/', LoginAPI.as_view(), name='login-api'),
    path('signup/', views.signup_view, name='signup-page'),
]