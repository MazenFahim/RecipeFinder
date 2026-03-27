const STORAGE_KEY = 'recipeFinder_recipes';

function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

function getRecipes() {
    initData();
    const data = localStorage.getItem(STORAGE_KEY);
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveRecipe(recipe) {
    const recipes = getRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function updateRecipe(updatedRecipe) {
    let recipes = getRecipes();
    const index = recipes.findIndex(r => r.recipeID === updatedRecipe.recipeID);
    
    if (index !== -1) {
        recipes[index] = updatedRecipe;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        return true;
    }
    return false;
}

function deleteRecipe(id) {
    let recipes = getRecipes();
    recipes = recipes.filter(r => r.recipeID !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

initData();


/- For Test View_recipe -/
if (getRecipes().length === 0) {
    saveRecipe({
        recipeID: "REC-001",
        recipeName: "Kushary",
        course: "Main Course",
        ingredientID: "ING-001",
        ingredients: "Rice, Lentils, Pasta, Tomato Sauce"
    });
    saveRecipe({
        recipeID: "REC-002",
        recipeName: "Konafa",
        course: "Dessert",
        ingredientID: "ING-002",
        ingredients: "Pastry, Cream, Syrup"
    });
}