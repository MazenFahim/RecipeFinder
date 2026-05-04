from django.urls import path
from .views import *
urlpatterns = [
    path('ListCreate/',ListCreate.as_view()),
    path('getUpdDel/<int:pk>/',GetUpdateDelete.as_view()),
]