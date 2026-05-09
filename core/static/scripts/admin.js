const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const idInput = document.getElementById('searchID');
        const idToSearch = idInput.value.trim();

        if (!idToSearch) {
            alert('Please enter a Recipe ID');
            return;
        }

        fetch(`/admin/get-recipe-data/?recipe_id=${idToSearch}`)
        .then(response => {
            if (!response.ok) throw new Error('Recipe not found');
            return response.json();
        })
        .then(data => {
            document.getElementById('editRecipeName').value = data.name;
            document.getElementById('editCourse').value = data.course_name;
            document.getElementById('editCountry').value = data.country || '';
            document.getElementById('editIngredients').value = data.ingredients;
        })
        .catch(error => {
            alert('Recipe ID not found in Database.');
            console.error(error);
        });
    });
}

const editForm = document.getElementById('editRecipeForm');
if (editForm) {
    editForm.addEventListener('submit', (e) => {
        const recipeName = document.getElementById('editRecipeName').value.trim();
        if (!recipeName) {
            alert('Recipe Name is required.');
            e.preventDefault();
        }
    });
}

window.handleDeleteRecipe = function(id) {
    if(confirm(`Are you sure you want to delete recipe ${id}?`)) {
        fetch(`/admin/delete-recipe/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Deleted successfully');
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Delete failed.');
        });
    }
}

const addForm = document.getElementById('addRecipeForm');
if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const formData = new FormData(addForm); 
        const errorSpan = document.getElementById('form-error');
        const successSpan = document.getElementById('form-success');

        fetch('/add-recipe/', { 
            method: 'POST',
            body: formData, 
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                errorSpan.textContent = "";
                successSpan.textContent = "Recipe added successfully to Database! ✅";
                addForm.reset();
                setTimeout(() => { successSpan.textContent = ""; }, 3000);
            } else {
                errorSpan.textContent = data.message;
                successSpan.textContent = "";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorSpan.textContent = "Failed to connect to the server.";
        });
    });
}