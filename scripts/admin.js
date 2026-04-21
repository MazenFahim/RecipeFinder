function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;

    // FIX: Changed from getRecipes() to getAllRecipes() to match data.js
    const recipes = getAllRecipes();

    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <h3 style="color: #7f8c8d; font-size: 1.5rem;">No recipes found. Start adding some!</h3>
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
                <!-- Applying Nielsen's Heuristics: Replaced text with standard Trash Can icon -->
                <button class="btn-delete-recipe" style="margin: 15px; width: calc(100% - 30px); background-color: #ffeaea; border: 1px solid #ffcccc; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 1.5rem; transition: 0.3s;" onclick="handleDeleteRecipe('${recipe.recipeID}')" title="Delete Recipe" aria-label="Delete Recipe">
                    🗑️
                </button>
                </div>
        `;
        recipesContainer.innerHTML += recipeHTML;
    });
}

// NEW: Delete handler function
window.handleDeleteRecipe = function(id) {
    if(confirm(`Are you sure you want to delete recipe ${id}?`)) {
        deleteRecipe(id); // Calls the function from data.js
        displayRecipes(); // Refresh
    }
}

//  SEARCH / EDIT LOGIC
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const idInput = document.getElementById('searchID');
        if (!idInput) return;

        const idToSearch = idInput.value.trim().toUpperCase();
        // FIX: Changed from getRecipes() to getAllRecipes()--
        const recipes = getAllRecipes();
        const recipe = recipes.find(r => r.recipeID.toUpperCase() === idToSearch);

        if (recipe) {
            document.getElementById('editRecipeName').value = recipe.recipeName;

            // Map the course string to the select value in edit-recipe.html
            const editCourse = document.getElementById('editCourse');
            for(let i=0; i < editCourse.options.length; i++) {
                if(editCourse.options[i].text === recipe.course || editCourse.options[i].value === recipe.course) {
                    editCourse.selectedIndex = i;
                    break;
                }
            }

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

        const courseSelect = document.getElementById('editCourse');
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;

        const updatedRecipe = {
            recipeID: document.getElementById('searchID').value.trim().toUpperCase(),
            recipeName: document.getElementById('editRecipeName').value.trim(),
            course: courseSelect.value ? courseSelect.value : courseText,
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

// ===== NEW: ADD RECIPE LOGIC =====
const addForm = document.getElementById('addRecipeForm');
if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh

        const recipeID = document.getElementById('recipeID').value.trim();
        const recipeName = document.getElementById('recipeName').value.trim();
        const courseSelect = document.getElementById('Course');
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;
        const ingredientID = document.getElementById('ingredientID').value.trim();
        const ingredients = document.getElementById('Ingredients').value.trim();

        const errorSpan = document.getElementById('form-error');
        const successSpan = document.getElementById('form-success');

        // Validation
        if (!recipeID || !recipeName || !ingredients || courseSelect.value === "") {
            errorSpan.textContent = "Please fill in all required fields (ID, Name, Course, Ingredients).";
            successSpan.textContent = "";
            return;
        }

        // Check for duplicate ID
        const existingRecipes = getAllRecipes();
        if (existingRecipes.some(r => r.recipeID.toUpperCase() === recipeID.toUpperCase())) {
            errorSpan.textContent = `A recipe with ID '${recipeID}' already exists!`;
            successSpan.textContent = "";
            return;
        }

        // Create Object
        const newRecipe = {
            recipeID: recipeID.toUpperCase(),
            recipeName: recipeName,
            course: courseText, // Save the text (e.g. "Main Course") instead of "1" or "2"
            ingredientID: ingredientID,
            ingredients: ingredients
        };

        // Save to localStorage using data.js function
        saveRecipe(newRecipe);

        // Feedback and Reset
        errorSpan.textContent = "";
        successSpan.textContent = "Recipe added successfully!";
        addForm.reset();

        // Remove success message after 3 seconds
        setTimeout(() => {
            successSpan.textContent = "";
        }, 3000);
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);