from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from . import admin_views

urlpatterns = [
    path('home/', views.recipe_home_view, name='home'),

    path('api/recipes/', views.ListCreate.as_view(), name='recipe-list'),
    path('api/recipes/<int:pk>/', views.GetUpdateDelete.as_view(), name='recipe-detail'),

    path('admin/dashboard/', admin_views.admin_dashboard, name='admin-dashboard'),
    path('admin/add-recipe/', admin_views.add_recipe, name='admin-add-recipe'),
    path('admin/edit-recipe/', admin_views.edit_recipe, name='admin-edit-recipe'),
    path('admin/view-recipes/', admin_views.view_recipes, name='admin-view-recipes'),
    path('admin/recipe-details/', admin_views.recipe_details, name='admin-recipe-details'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)