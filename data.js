const STORAGE_KEY = 'recipeFinder_recipes';

function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

// Unified function name for reading all recipes
function getAllRecipes() {
    initData();
    const data = localStorage.getItem(STORAGE_KEY);
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveRecipe(recipe) {
    const recipes = getAllRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function updateRecipe(updatedRecipe) {
    let recipes = getAllRecipes();
    const index = recipes.findIndex(r => r.recipeID === updatedRecipe.recipeID);

    if (index !== -1) {
        recipes[index] = updatedRecipe;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        return true;
    }
    return false;
}

function deleteRecipe(id) {
    let recipes = getAllRecipes();
    // Find and physically remove the recipe from the array
    const index = recipes.findIndex(r => r.recipeID === id.trim().toUpperCase());
    if (index !== -1) {
        recipes.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
}

initData();

