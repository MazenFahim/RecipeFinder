from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework import generics, mixins
from rest_framework.filters import SearchFilter
from .models import Recipe, Ingredient
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

def view_recipes(request):
    recipes = Recipe.objects.all()
    return render(request, 'accounts/admin_dashboard.html', {'recipes': recipes})

def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'recipes/recipe_detail.html', {'recipe': recipe})

@staff_member_required
def add_recipe_view(request):
    if request.method == 'POST':
        try:
            recipe = Recipe.objects.create(
                recipe_custom_id=request.POST.get('recipeID'),
                name=request.POST.get('recipeName'),
                course_name=request.POST.get('Course'),
                description="Added via Admin Dashboard",
                country=request.POST.get('country', ''),
                image=request.FILES.get('image')
            )
            ingredients_text = request.POST.get('Ingredients')
            if ingredients_text:
                names = [n.strip() for n in ingredients_text.split(',') if n.strip()]
                for name in names:
                    ing_obj, _ = Ingredient.objects.get_or_create(name=name)
                    recipe.ingredients.add(ing_obj)
            return JsonResponse({'success': True, 'message': 'Recipe added successfully! ✅'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return render(request, 'add_recipe.html')

@staff_member_required
def edit_recipe(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    if request.method == 'POST':
        recipe.name = request.POST.get('recipeName')
        recipe.course_name = request.POST.get('course')
        recipe.country = request.POST.get('country')
        if 'image' in request.FILES:
            recipe.image = request.FILES['image']
        recipe.save()
        
        ingredients_text = request.POST.get('ingredients')
        if ingredients_text:
            recipe.ingredients.clear()
            names = [n.strip() for n in ingredients_text.split(',') if n.strip()]
            for name in names:
                ing_obj, _ = Ingredient.objects.get_or_create(name=name)
                recipe.ingredients.add(ing_obj)
        
        messages.success(request, "Recipe updated successfully!")
        return redirect('view_recipes')
    return render(request, 'admin/edit_recipe.html', {'recipe': recipe})

def get_recipe_data(request):
    recipe_id = request.GET.get('recipe_id')
    recipe = get_object_or_404(Recipe, recipe_custom_id=recipe_id)
    ingredients = ", ".join([ing.name for ing in recipe.ingredients.all()])
    return JsonResponse({
        'name': recipe.name,
        'course_name': recipe.course_name,
        'country': recipe.country,
        'ingredients': ingredients
    })