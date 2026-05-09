from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('ListCreate/',views.ListCreate.as_view()),
    path('getUpdDel/<int:pk>/',views.GetUpdateDelete.as_view(), name='recipe-list'),
    path('add-recipe/', views.add_recipe_view, name='add_recipe'),
    path('view-recipes/', views.view_recipes, name='view_recipes'),
    path('account/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('edit-recipe/<int:pk>/', views.edit_recipe, name='edit_recipe'),
    path('<int:pk>/', views.recipe_detail, name='recipe_detail'),
]