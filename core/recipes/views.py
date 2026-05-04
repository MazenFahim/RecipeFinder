from rest_framework import generics,mixins,viewsets
from rest_framework.filters import SearchFilter
from .permissions import IsAdminOrReadOnly
from django.shortcuts import render
from .serializer import *
from .models import *
# Create your views here.
class ListCreate(generics.GenericAPIView,mixins.ListModelMixin,mixins.CreateModelMixin):
    queryset=Recipe.objects.all()
    serializer_class=RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]
    #Search
    filter_backends = [SearchFilter]
    search_fields = ['name', 'course_name']
    # List of recipes :user
    def get(self,request):
        return self.list(request)
    #Add :admin only
    def post(self,request):
        return self.create(request)
class GetUpdateDelete(generics.GenericAPIView,mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin):
    queryset=Recipe.objects.all()
    serializer_class=RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]
    #get one recipe :user
    def get(self,request,pk):
        return self.retrieve(request,pk)
    #update :admin only
    def put(self,request,pk):
        return self.update(request,pk)
    #delete :admin only
    def delete(self,request,pk):
        return self.destroy(request,pk)   