import io
import json
import os
import re
import shutil
import sys
from django.core.management.base import BaseCommand
from django.conf import settings
from recipes.models import Recipe, Ingredient

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

COURSE_MAP = {
    "وجبات رئيسية": "main course",
    "حلويات": "dessert",
    "مشروبات": "appetizers",
    "سلطات": "appetizers",
    "مقبلات": "appetizers",
    "مخبوزات": "appetizers",
}

def extract_prep_time(time_str):
    match = re.search(r'(\d+)', time_str)
    return int(match.group(1)) if match else None

def js_to_json(text):
    text = re.sub(r'//.*', '', text)
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    text = re.sub(r'([{,]+)\s*(\w+)\s*:', r'\1"\2":', text)
    return text

def determine_course(filters):
    for afilter in filters:
        if afilter in COURSE_MAP:
            return COURSE_MAP[afilter]
    return "main course"


class Command(BaseCommand):
    help = "Seed recipes from data.js into the database"

    def handle(self, *args, **options):
        js_path = os.path.join(settings.BASE_DIR, "static", "scripts", "data.js")
        with open(js_path, "r", encoding="utf-8") as f:
            content = f.read()

        match = re.search(r'const recipes\s*=\s*(\[.*?\]);', content, re.DOTALL)
        if not match:
            self.stderr.write("Could not find recipes array in data.js")
            return

        array_text = match.group(1)
        json_text = js_to_json(array_text)

        try:
            recipes_data = json.loads(json_text)
        except json.JSONDecodeError as e:
            self.stderr.write(f"JSON parse error: {e}")
            return

        static_img_dir = os.path.join(settings.BASE_DIR, "static", "images")
        media_img_dir = os.path.join(settings.MEDIA_ROOT, "recipe_images")
        os.makedirs(media_img_dir, exist_ok=True)

        created = 0
        skipped = 0

        for item in recipes_data:
            name = item.get("name", "").strip()
            if not name:
                continue

            if Recipe.objects.filter(name=name).exists():
                self.stdout.write(f"Skipping existing: {name}")
                skipped += 1
                continue

            desc = item.get("desc", "")
            filters = item.get("filters", [])
            course = determine_course(filters)
            prep_time = extract_prep_time(item.get("time", ""))

            recipe = Recipe(
                name=name,
                course_name=course,
                description=desc,
                prep_time=prep_time,
            )

            src_img = item.get("image", "")
            if src_img:
                orig_name = os.path.basename(src_img)
                src_path = os.path.join(static_img_dir, orig_name)
                if os.path.exists(src_path):
                    dest_path = os.path.join(media_img_dir, orig_name)
                    shutil.copy2(src_path, dest_path)
                    recipe.image = f"recipe_images/{orig_name}"

            recipe.save()

            ingredients_list = item.get("ingredients", [])
            for ing_text in ingredients_list:
                ing, _ = Ingredient.objects.get_or_create(
                    name=ing_text.strip(),
                    defaults={"quantity": ""},
                )
                recipe.ingredients.add(ing)

            created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created}, skipped {skipped}, total {Recipe.objects.count()} recipes."
        ))
