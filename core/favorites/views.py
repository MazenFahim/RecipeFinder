from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Favorite
from recipes.models import Recipe

@login_required
def fav_toggle(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    favorite_queryset = Favorite.objects.filter(user=request.user, recipe=recipe)

    if favorite_queryset.exists():
        favorite_queryset.delete()
        status = "removed"
    else:
        Favorite.objects.create(user=request.user, recipe=recipe)
        status = "added"

    return JsonResponse({'status': status})

@login_required
def favorite_list(request):
    user_favorites = Favorite.objects.filter(user=request.user).select_related('recipe')
    return render(request, 'favourites.html', {'favorites': user_favorites})

@login_required
def remove_from_favorites(request, favorite_id):
    favorite = get_object_or_404(Favorite, id=favorite_id, user=request.user)
    favorite.delete()
    return redirect('favorite_list')