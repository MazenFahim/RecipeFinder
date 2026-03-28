const STORAGE_KEY = 'recipeFinder_recipes';

function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

function getAllRecipes() {   // convert it from getRecipes to getAllRecipes (admin can see all recipes including deleted)
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

// Soft delete: mark as deleted instead of removing from database
function deleteRecipe(id) {
    let recipes = getAllRecipes();
    const index = recipes.findIndex(r => r.recipeID === id.trim().toUpperCase());
    if (index !== -1) {
        recipes[index].deleted = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
}


// Display Recipes in User View 
function getVisibleRecipes() {
    const data = localStorage.getItem(STORAGE_KEY);
    const recipes = data ? JSON.parse(data) : [];

    return recipes.filter(r => !r.deleted);
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