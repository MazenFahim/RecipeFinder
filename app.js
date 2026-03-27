function getRecipes() {
  return recipes;
}

function addRecipe(newRecipe) {
  recipes.push(newRecipe);
}

function updateRecipe(updatedRecipe) {
  const index = recipes.findIndex(r => r.recipeID === updatedRecipe.recipeID);

  if (index !== -1) {
    recipes[index] = updatedRecipe;
  }
}