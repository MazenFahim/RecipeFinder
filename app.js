// function getRecipes() {    <== This function is no longer needed as we are fetching recipes directly from the server 
//   return recipes;
// }

// function addRecipe(newRecipe) {
//   recipes.push(newRecipe);
// }

// function updateRecipe(updatedRecipe) {
//   const index = recipes.findIndex(r => r.recipeID === updatedRecipe.recipeID);

//   if (index !== -1) {
//     recipes[index] = updatedRecipe;
//   }
// }

// check if the user is an admin or not 
function checkAdminStatus() {
  // we will store the admin status in local storage to be able to check it on different pages 
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (isAdmin) {

    // Show admin controls (edit and delete buttons) for each recipe
    const controls = document.querySelectorAll('.admin-controls');
    controls.forEach(div => div.style.display = 'block');

    // Show the add recipe button for admin users
    const addBtn = document.getElementById('addRecipeBtn');
      if(addBtn)
        addBtn.style.display = 'block';
  }
}

// call this function in case of admin login 
async function deleteRecipe(recipeID) {
  if (!confirm('Are you sure you want to delete this recipe?')) return;

  const token = localStorage.getItem('token');

  // Send DELETE request to server to delete recipe by ID, including the token in the request to authenticate if the user is admin 
  try {
    const response = await fetch(`http://localhost:3000/recipes/${recipeID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`  
      }
    });

    if (response.ok) {
      alert('Recipe deleted successfully!');
      loadAndDisplayRecipes();  
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to delete recipe.');
    }

  } catch (error) {
    console.error("Delete error:", error);
    alert('Connection error. Please try again.');
  }
}

// Redirect to edit page with recipe ID in query parameters for editing
function editRecipe(recipeID) {
  window.location.href = `edit-recipe.html?id=${recipeID}`;
}