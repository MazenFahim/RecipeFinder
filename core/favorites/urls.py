from django.urls import path
from . import views

urlpatterns = [
    path('', views.favorite_list, name='favorite_list'),
    path('api/favorite/toggle/<int:recipe_id>/', views.fav_toggle, name='fav_toggle'),
    path('toggle/<int:recipe_id>/', views.fav_toggle, name='fav_toggle'),
]