from functools import wraps
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

def admin_required(view_func):
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_admin:
            return HttpResponseForbidden("Admin access required.")
        return view_func(request, *args, **kwargs)
    return _wrapped_view

@admin_required
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')

@admin_required
def add_recipe(request):
    return render(request, 'add-recipe.html')

@admin_required
def edit_recipe(request):
    return render(request, 'edit-recipe.html')

@admin_required
def view_recipes(request):
    return render(request, 'view-recipe.html')

@admin_required
def recipe_details(request):
    return render(request, 'recipe-details.html')
