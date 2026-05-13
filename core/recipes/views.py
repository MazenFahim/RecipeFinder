from rest_framework import generics
from rest_framework.filters import SearchFilter
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .permissions import IsAdminOrReadOnly
from .serializer import RecipeSerializer
from .models import Recipe
from favorites.models import Favorite

@login_required
def recipe_home_view(request):
    recipes = Recipe.objects.all()
    favorites_list = []
    if request.user.is_authenticated:
        favorites_list = Favorite.objects.filter(user=request.user).values_list('recipe_id', flat=True)
    return render(request, 'index.html', {'recipes': recipes, 'favorites_list': favorites_list})

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