from django.http import JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from recipes.models import Recipe
from .models import Favorite
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
\
@login_required
def favorites_list(request):
    user_favorites = Favorite.objects.filter(user=request.user).select_related('recipe')
    return render(request, 'favorites/fav.html', {'favorites': user_favorites})

class FavToggle(LoginRequiredMixin, View): # this is for connecting each user with his fav list
    def post(self, request, *args, **kwargs):

        recipe_id = request.POST.get('recipe_id')
        
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            favorite, created = Favorite.objects.get_or_create(user=request.user, recipe=recipe)
            
            if not created:
                favorite.delete()
                return JsonResponse({'status': 'ok', 'action': 'removed'})
            
            return JsonResponse({'status': 'ok', 'action': 'added'})
            
        except Recipe.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Recipe not found'}, status=404)