from functools import wraps
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Recipe


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not getattr(request.user, "is_admin", False):
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper


@admin_required
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')


@admin_required
def add_recipe(request):
    return render(request, 'add-recipe.html')  # بس كده، الـ AJAX بيتولى الباقي


@admin_required
def edit_recipe(request):
    return render(request, 'edit-recipe.html')


@admin_required
def view_recipes(request):
    return render(request, 'view-recipe.html')


@admin_required
def recipe_details(request):
    return render(request, 'recipe-details.html')