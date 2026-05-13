from django.db import models

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    COURSE_CHOICES = [
        ('appetizers', 'Appetizers'),
        ('main course', 'Main Course'),
        ('dessert', 'Dessert'),
    ]

    name = models.CharField(max_length=200)
    course_name = models.CharField(max_length=20, choices=COURSE_CHOICES)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient, blank=True)
    image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)
    prep_time = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name