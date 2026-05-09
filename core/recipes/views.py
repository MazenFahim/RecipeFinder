from django.shortcuts import render
from django.http import JsonResponse
from .models import Recipe, Ingredient
from rest_framework import generics, mixins
from rest_framework.filters import SearchFilter
from .permissions import IsAdminOrReadOnly
from .serializer import RecipeSerializer

class ListCreate(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'course_name']

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class GetUpdateDelete(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, pk):
        return self.retrieve(request, pk)

    def put(self, request, pk):
        return self.update(request, pk)

    def delete(self, request, pk):
        return self.destroy(request, pk)

def home(request):
    return render(request, 'index.html')

def admin_dashboard(request): 
    return render(request, 'accounts/admin_dashboard.html')

def add_recipe_view(request):
    if request.method == 'POST':
        r_id = request.POST.get('recipeID')
        r_name = request.POST.get('recipeName')
        r_course = request.POST.get('Course')
        r_ingredients_text = request.POST.get('Ingredients')

        try:
            new_recipe = Recipe.objects.create(
                recipe_custom_id=r_id,
                name=r_name,
                course_name=r_course,
                description="Added via Admin Dashboard" 
            )
            if r_ingredients_text:
                ing, created = Ingredient.objects.get_or_create(name=r_ingredients_text)
                new_recipe.ingredients.add(ing)

            return JsonResponse({'success': True, 'message': 'Recipe added successfully! ✅'})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})

    return render(request, 'add_recipe.html')

def view_recipes(request):
    recipes = Recipe.objects.all()
    return render(request, 'accounts/admin_dashboard.html', {'recipes': recipes})