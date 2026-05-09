from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100) 
    quantity = models.CharField(max_length=50) 

    def __str__(self):
        return self.name

class Recipe(models.Model):
    COURSE_CHOICES = [
        ('1', 'Appetizers'),
        ('2', 'Main Course'),
        ('3', 'Dessert'),
    ]

    recipe_custom_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    name = models.CharField(max_length=200)
    course_name = models.CharField(max_length=20, choices=COURSE_CHOICES)
    description = models.TextField() 
    ingredients = models.ManyToManyField(Ingredient, related_name='recipes')

    def __str__(self):
        return self.name