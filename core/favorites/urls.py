from django.urls import path
from .views import FavToggle, favorites_list
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', favorites_list, name='favorites_list'),
    path('api/favorite/toggle/', FavToggle.as_view(), name='fav-toggle'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)