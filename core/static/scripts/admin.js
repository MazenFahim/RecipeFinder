async function displayRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    if (!recipesContainer) return;
    try {
        const response = await fetch('/recipes/api/recipes/', { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        const recipes = data.results || data;
        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const imageSrc = recipe.image ? recipe.image : '/static/images/default-recipe.jpg';
            const timeDisplay = recipe.prep_time ? `${recipe.prep_time} mins` : 'Not specified';
            recipesContainer.innerHTML += `
                <div class="recipe-card">
                    <div class="card-header">
                        <img src="${imageSrc}" alt="${recipe.name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
                        <h3>${recipe.name}</h3>
                        <span class="course-badge">${recipe.course_name}</span>
                    </div>
                    <div class="card-body">
                        <p>${recipe.description}</p>
                        <p>⏱️ ${timeDisplay}</p>
                    </div>
                    <div class="card-footer">
                        <span>ID: <b>${recipe.id}</b></span>
                        <button class="btn-delete" onclick="handleDeleteRecipe(${recipe.id})">🗑️ Delete</button>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error(error);
    }
}

window.handleDeleteRecipe = async function (id) {
    if (!confirm(`Delete recipe #${id}?`)) return;
    const response = await fetch(`/recipes/api/recipes/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
        }
    });
    if (response.ok) {
        alert('Deleted successfully!');
        displayRecipes();
    } else {
        alert('Delete failed: ' + response.status);
    }
}

const addForm = document.getElementById('addRecipeForm');
if (addForm) {
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addForm);
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
        try {
            const response = await fetch('/recipes/api/recipes/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRFToken': csrftoken },
                body: formData
            });
            if (response.ok) {
                alert('Added successfully!');
                window.location.href = '/recipes/admin/view-recipes/';
            } else {
                const err = await response.json();
                alert('Error: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    });
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
        const id = document.getElementById('searchID').value.trim();
        if (!id) return alert('Enter ID');
        const response = await fetch(`/recipes/api/recipes/${id}/`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('editRecipeName').value = data.name;
            document.getElementById('editCourse').value = data.course_name;
            document.getElementById('editDescription').value = data.description;
            document.getElementById('editIngredients').value = data.ingredients ? data.ingredients.join(', ') : '';
        } else {
            alert('Recipe not found');
        }
    });
}

const editForm = document.getElementById('editRecipeForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('searchID').value.trim();
        if (!id) return alert('Search first');
        
        const ingredientsVal = document.getElementById('editIngredients').value;
        const ingredientsArray = ingredientsVal ? ingredientsVal.split(',').map(i => i.trim()).filter(i => i !== "") : [];

        const updatedData = {
            name: document.getElementById('editRecipeName').value,
            course_name: document.getElementById('editCourse').value,
            description: document.getElementById('editDescription').value,
            ingredients: ingredientsArray
        };

        const response = await fetch(`/recipes/api/recipes/${id}/`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('Updated successfully!');
            window.location.href = '/recipes/admin/view-recipes/';
        } else {
            const errData = await response.json();
            alert('Update failed: ' + JSON.stringify(errData));
        }
    });
}

document.addEventListener('DOMContentLoaded', displayRecipes);