// --- 1. VIEW RECIPES LOGIC ---
function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;

    const recipes = getAllRecipes();

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p class="no-data">No recipes found.</p>';
        return;
    }

    let tableHTML = `
        <table class="recipe-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Ingredient ID</th>
                    <th>Ingredients</th>
                    <th>Actions</th> 
                </tr>
            </thead>
            <tbody>
    `;

    recipes.forEach(recipe => {
        tableHTML += `
            <tr>
                <td><strong>${recipe.recipeID}</strong></td>
                <td>${recipe.recipeName}</td>
                <td>${recipe.course}</td>
                <td>${recipe.ingredientID}</td>
                <td>${recipe.ingredients}</td>
                <td>
                    <button class="btn-delete-recipe" onclick="handleDelete('${recipe.recipeID}')">
                        &#128465; Delete
                    </button>
                </td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    recipesContainer.innerHTML = tableHTML;
}

// Global function to safely handle delete clicks from the table
window.handleDelete = function(id) {
    if (confirm(`Are you sure you want to permanently delete recipe ${id}?`)) {
        deleteRecipe(id);
        displayRecipes();
    }
};

document.addEventListener('DOMContentLoaded', displayRecipes);


// --- 2. ADD RECIPE LOGIC ---
const addRecipeForm = document.getElementById("addRecipeForm");

if (addRecipeForm) {
    addRecipeForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const courseSelect = document.getElementById("Course");
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;

        const newRecipe = {
            recipeID: document.getElementById("recipeID").value.trim(),
            recipeName: document.getElementById("recipeName").value.trim(),
            course: courseText,
            ingredientID: document.getElementById("ingredientID").value.trim(),
            ingredients: document.getElementById("Ingredients").value.trim()
        };

        if (!newRecipe.recipeID || !newRecipe.recipeName || !newRecipe.ingredientID || !newRecipe.ingredients) {
            alert("Please fill in all text fields!");
            return;
        }
        if (courseSelect.value === "") {
            alert("Please select a course!");
            return;
        }

        saveRecipe(newRecipe);
        alert("Recipe saved successfully!");
        addRecipeForm.reset();
        window.location.href = "view-recipe.html";
    });
}


// --- 3. EDIT RECIPE LOGIC ---
const searchBtn = document.getElementById('searchBtn');
const editForm = document.getElementById('editRecipeForm');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const idToSearch = document.getElementById('searchID').value;
        const recipes = getAllRecipes();
        const recipe = recipes.find(r => r.recipeID === idToSearch);

        if (recipe) {
            document.getElementById('editRecipeName').value = recipe.recipeName;

            const courseDropdown = document.getElementById('editCourse');
            for(let i=0; i < courseDropdown.options.length; i++) {
                if(courseDropdown.options[i].text === recipe.course) {
                    courseDropdown.selectedIndex = i;
                    break;
                }
            }

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

        const courseSelect = document.getElementById("editCourse");
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;

        const updatedRecipe = {
            recipeID: document.getElementById('searchID').value,
            recipeName: document.getElementById('editRecipeName').value,
            course: courseText,
            ingredients: document.getElementById('editIngredients').value
        };

        if (updateRecipe(updatedRecipe)) {
            alert('Recipe updated successfully!');
            window.location.href = 'view-recipe.html';
        } else {
            alert('Error updating recipe.');
        }
    });
}


// --- 4. DELETE RECIPE LOGIC ---
const deleteBtn = document.getElementById("deleteRecipeBtn");

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        window.location.href = "view-recipe.html";
    });
}