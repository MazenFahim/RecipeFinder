from rest_framework import serializers
from .models import Recipe, Ingredient

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = '__all__'

    def create(self, validated_data):
        ingredients = validated_data.pop('ingredients', [])
        recipe = Recipe.objects.create(**validated_data)

        for i in ingredients:
            obj, _ = Ingredient.objects.get_or_create(name=i.strip(), defaults={'quantity': 'N/A'})
            recipe.ingredients.add(obj)

        return recipe

    def update(self, instance, validated_data):
        ingredients = validated_data.pop('ingredients', None)
        instance = super().update(instance, validated_data)

        if ingredients is not None:
            instance.ingredients.clear()
            for i in ingredients:
                obj, _ = Ingredient.objects.get_or_create(name=i.strip(), defaults={'quantity': 'N/A'})
                instance.ingredients.add(obj)

        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ingredients'] = [i.name for i in instance.ingredients.all()]
        return data