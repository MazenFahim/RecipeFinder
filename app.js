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

// check if the user is an admin or not 
function checkAdminStatus() {
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (isAdmin) {
    const controls = document.querySelectorAll('.admin-controls');
    controls.forEach(div => div.style.display = 'block');
    const addBtn = document.getElementById('addRecipeBtn');
      if(addBtn)
        addBtn.style.display = 'block';
  }
}