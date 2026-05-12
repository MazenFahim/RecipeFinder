from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.recipe_home_view, name='home'),
   
    path('favorite-list/', views.recipe_home_view, name='favorite_list'), 
    
    path('api/recipes/', views.ListCreate.as_view(), name='recipe-list'),
]