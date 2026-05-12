from rest_framework import generics
from rest_framework.filters import SearchFilter
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .permissions import IsAdminOrReadOnly
from .serializer import RecipeSerializer
from .models import Recipe

@login_required
def recipe_home_view(request):
    recipes = Recipe.objects.all()
    return render(request, 'index.html', {'recipes': recipes})

class ListCreate(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'course_name']

class GetUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]