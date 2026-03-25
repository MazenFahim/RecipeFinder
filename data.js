
const STORAGE_KEY = 'recipeFinder_recipes';
function initData(){
    if (!localStorage.getItem(STORAGE_KEY)){
        localStorage.setItem(STORAGE_KEY,JSON.stringify([]));
    }
}
function getRecipes(){
    initData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}
function saveRecipe(recipe){
    const recipes = getRecipes();
    recipes.push(recipe);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(recipes));
}
function updateRecipe(updatedRecipe){
    let recipes = getRecipes();
    const index = recipes.findIndex( r => r.recipeID === updatedRecipe.recipeID );
    if (index !== -1){
        recipes[index]=updatedRecipe;
        localStorage.setItem(STORAGE_KEY,JSON.stringify(recipes));
    }
}
function deleteRecipe(id) {
    let recipes = getRecipes();
    recipes = recipes.filter(r => r.recipeID !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}
initData();