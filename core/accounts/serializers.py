from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # We include is_admin so the frontend knows the user's role
        fields = ('id', 'username', 'email', 'password', 'is_admin')
        # Ensure the password is never sent back in API responses
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Use create_user to ensure the password is properly hashed
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_admin=validated_data['is_admin']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Authenticate checks the username and password against the database
        user = authenticate(username=data.get('email'), password=data.get('password'))
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")