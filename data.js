// const recipes = [
//   {
//     recipeID: "REC-1",
//     recipeName: "Spaghetti",
//     course: "Main Course",
//     ingredients: "Pasta, Tomato Sauce"
//   },
//   {
//     recipeID: "REC-2",
//     recipeName: "Cake",
//     course: "Dessert",
//     ingredients: "Flour, Sugar, Eggs"
//   }
// ];


// function to load and display recipes from the backend

// query = '' which means if there is no search query, it will load all recipes by default 
async function loadAndDisplayRecipes(query = '') {
  const container = document.getElementById("recipesContainer");  
  try {
    let url = 'http://localhost:3000/recipes';    // the backend server that fetch the recipes from it

    // if user use search button so we sill add this query to the url to filter the recipes 
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }  

    // request and rsponse from the server 
    const response = await fetch(url);
    const recipes = await response.json();

    if (!recipes || recipes.length === 0) {
      container.innerHTML = "<p>No recipes found matching your search.</p>";
      return;
    }

    let html = '<div class="recipes-grid">';
    recipes.forEach(recipe => {
      html += `
        <div class="recipe-card">
          <h3>${recipe.recipeName}</h3>
          <p><strong>Course:</strong> ${recipe.course}</p>
          <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
              
          <!-- Admin controls (edit and delete buttons) will be shown only if the user is admin, we will check this in the checkAdminStatus function -->
              
          <div class="admin-controls" style="display: none;">
            <hr>
            <button onclick="editRecipe('${recipe.recipeID}')">Edit</button>
            <button onclick="deleteRecipe('${recipe.recipeID}')">Delete</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;

        
    checkAdminStatus();

    } catch (error) {
      console.error("Search error:", error);
    }
  }