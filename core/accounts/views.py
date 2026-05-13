from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.shortcuts import render
from .serializers import UserSerializer, LoginSerializer
from django.contrib.auth import views as auth_views

class SignupAPI(generics.GenericAPIView):
    authentication_classes = []
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created successfully."
        }, status=status.HTTP_201_CREATED)

class LoginAPI(generics.GenericAPIView):
    authentication_classes = []
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "Logged in successfully."
        }, status=status.HTTP_200_OK)

def signup_view(request):
    return render(request, 'signup.html')

class MyLogoutView(auth_views.LogoutView):
    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)
