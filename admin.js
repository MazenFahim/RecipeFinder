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




const addRecipeForm = document.getElementById("addRecipeForm");
if (addRecipeForm) {
    document.getElementById("recipeID").addEventListener("blur", () => validateField("recipeID"));
    document.getElementById("recipeName").addEventListener("blur", () => validateField("recipeName"));
    document.getElementById("Course").addEventListener("change", () => validateField("Course"));
    document.getElementById("ingredientID").addEventListener("blur", () => validateField("ingredientID"));
    document.getElementById("Ingredients").addEventListener("blur", () => validateField("Ingredients"));
}


function deleteRecipe() {

    const id = prompt("Enter the Recipe ID to delete (e.g. REC-001):");

    if (id === null) return;

    if (id.trim() === "") {
        alert("Please enter a Recipe ID.");
        return;
    }

    const data = localStorage.getItem("recipes");        
    const recipes = data ? JSON.parse(data) : [];  

    const index = recipes.findIndex(r => r.recipeID === id.trim().toUpperCase());

    if (index === -1) {
        alert("Recipe not found.");
        return;
    }

    recipes.splice(index, 1);

    localStorage.setItem("recipes", JSON.stringify(recipes));

    alert("Recipe deleted successfully!");
}

const deleteBtn = document.getElementById("deleteRecipeBtn");
if (deleteBtn) {
    deleteBtn.addEventListener("click", deleteRecipe);
}