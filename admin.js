function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;

    const recipes = getRecipes(); 

    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <h3 style="color: #7f8c8d; font-size: 1.5rem;">No recipes found.</h3>
            </div>`;
        return;
    }

    recipesContainer.innerHTML = ''; 

    recipes.forEach(recipe => {
        const recipeHTML = `
            <div class="recipe-card">
                <div class="card-header">
                    <h3>${recipe.recipeName}</h3>
                    <span class="course-badge">${recipe.course}</span>
                </div>
                <div class="card-body">
                    <div class="field-label" style="font-size: 1.2rem; font-weight: bold; color: #f39c12; margin-bottom: 10px;">Ingredients:</div>
                    <div class="ingredients-list">
                        ${recipe.ingredients}
                    </div>
                </div>
                <div class="card-footer">
                    <span>ID: <b class="id-tag">${recipe.recipeID}</b></span>
                    <span>Ref: ${recipe.ingredientID || 'N/A'}</span>
                </div>
            </div>
        `;
        recipesContainer.innerHTML += recipeHTML;
    });
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const idInput = document.getElementById('searchID');
        if (!idInput) return;

        const idToSearch = idInput.value.trim();
        const recipes = getRecipes();
        const recipe = recipes.find(r => r.recipeID === idToSearch);

        if (recipe) {
            document.getElementById('editRecipeName').value = recipe.recipeName;
            document.getElementById('editCourse').value = recipe.course;
            document.getElementById('editIngredients').value = recipe.ingredients;
        } else {
            alert('Recipe ID not found.');
        }
    });
}

const editForm = document.getElementById('editRecipeForm');
if (editForm) {
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedRecipe = {
            recipeID: document.getElementById('searchID').value.trim(),
            recipeName: document.getElementById('editRecipeName').value.trim(),
            course: document.getElementById('editCourse').value,
            ingredients: document.getElementById('editIngredients').value.trim()
        };

        if (!updatedRecipe.recipeName || !updatedRecipe.ingredients) {
            alert('Please fill in all fields.');
            return;
        }

        if (typeof updateRecipe === "function" && updateRecipe(updatedRecipe)) {
            alert('Recipe updated successfully!');
            window.location.href = 'view-recipe.html';
        } else {
            alert('Update failed.');
        }
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);