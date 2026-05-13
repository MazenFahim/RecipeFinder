from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q

from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated

from .models import Recipe
from .serializer import RecipeSerializer
from favorites.models import Favorite


@login_required
def recipe_home_view(request):
    query = request.GET.get('q', '').strip()

    recipes = Recipe.objects.prefetch_related('ingredients').all()

    if query:
        recipes = recipes.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(ingredients__name__icontains=query)
        ).distinct()

    favorites_list = Favorite.objects.filter(
        user=request.user
    ).values_list('recipe_id', flat=True)

    return render(request, 'index.html', {
        'recipes': recipes,
        'favorites_list': list(favorites_list),
        'query': query
    })


class ListCreate(generics.ListCreateAPIView):
    queryset = Recipe.objects.prefetch_related('ingredients').all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]

    search_fields = [
        'name',
        'course_name',
        'description',
        'ingredients__name'
    ]


class GetUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.prefetch_related('ingredients').all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]