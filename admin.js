function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;

    const recipes = getRecipes();

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
                </tr>
            </thead>
            <tbody>
    `;

    recipes.forEach(recipe => {
        tableHTML += `
            <tr>
                <td>${recipe.recipeID}</td>
                <td>${recipe.recipeName}</td>
                <td>${recipe.course}</td>
                <td>${recipe.ingredientID}</td>
                <td>${recipe.ingredients}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    recipesContainer.innerHTML = tableHTML;
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


// Add Recipe Form Handling

const addRecipeForm = document.getElementById("addRecipeForm");

if (addRecipeForm) {
    addRecipeForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const newRecipe = {
            recipeID: document.getElementById("recipeID").value.trim(),
            recipeName: document.getElementById("recipeName").value.trim(),
            course: document.getElementById("Course").value,
            ingredientID: document.getElementById("ingredientID").value.trim(),
            ingredients: document.getElementById("Ingredients").value.trim()
        };

        if ( !newRecipe.recipeID || !newRecipe.recipeID || !newRecipe.recipeName 
            || !newRecipe.ingredientID || !newRecipe.ingredients) {
            alert("Please fill in all fields!");
            return;
        }

        if (newRecipe.course === "Select Course") {
            alert("Please select a course!");
            return;
        }

        saveRecipe(newRecipe);
        alert("Recipe saved successfully!");

        addRecipeForm.reset();
        window.location.href = "view-recipe.html";
    });
}

// Delete Recipe button Handling
const deleteBtn = document.getElementById("deleteRecipeBtn");

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        const id = prompt("Enter the Recipe ID:");

        if (!id || id.trim() === "") {
            alert("Invalid ID");
            return;
        }

        deleteRecipe(id.trim().toUpperCase());
        alert("Deleted successfully!");
    });
}

