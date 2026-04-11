function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;

    const recipes = getRecipes();

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p class="no-data">No recipes found.</p>';
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
                    <div class="field-label">Ingredients</div>
                    <div class="ingredients-list">
                        ${recipe.ingredients}
                    </div>
                    <div class="ingredient-id-box">
                        <small>Ingredient Ref: ${recipe.ingredientID}</small>
                    </div>
                </div>
                <div class="card-footer">
                    <span>Recipe ID:</span>
                    <span class="id-tag">${recipe.recipeID}</span>
                </div>
            </div>
        `;
        recipesContainer.innerHTML += recipeHTML;
    });
}


const searchBtn = document.getElementById('searchBtn');
const editForm = document.getElementById('editRecipeForm');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const idToSearch = document.getElementById('searchID').value;
        const recipes = getRecipes();
        const recipe = recipes.find(r => r.recipeID === idToSearch);

        if (recipe) {
            document.getElementById('editRecipeName').value = recipe.recipeName;
            document.getElementById('editCourse').value = recipe.course;
            document.getElementById('editIngredients').value = recipe.ingredients;
            alert('Recipe found! You can now edit.');
        } else {
            alert('Recipe ID not found.');
        }
    });
}

if (editForm) {
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedRecipe = {
            recipeID: document.getElementById('searchID').value,
            recipeName: document.getElementById('editRecipeName').value,
            course: document.getElementById('editCourse').value,
            ingredients: document.getElementById('editIngredients').value
        };

        if (updateRecipe(updatedRecipe)) {
            alert('Recipe updated successfully!');
            window.location.href = 'view-recipe.html';
        }
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);