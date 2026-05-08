from django.contrib import admin
from .models import *
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Registering the CustomUser so we can manage it from the Django Admin Dashboard
admin.site.register(CustomUser, UserAdmin)