function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function toggleFav(recipeId) {
    try {
        const response = await fetch('/api/favorite/toggle/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `recipe_id=${recipeId}`
        });

        const data = await response.json();

        if (data.status === 'ok') {
            location.reload();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderFavs() {
    const grid = document.getElementById("favGrid");
    
    if (!recipes || recipes.length === 0) {
        grid.innerHTML = `
            <div class="empty-fav">
                <p>💔 لا توجد وصفات في المفضلة</p>
                <a href="/">تصفح الوصفات</a>
            </div>`;
        return;
    }

    grid.innerHTML = "";
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <div class="recipe-header">
                <img src="${recipe.image}" alt="Recipe">
                <div class="overlay">
                    <h1>${recipe.name}</h1>
                    <div class="overlay-meta">
                        <p class="desc">${recipe.desc}</p>
                        <p class="country-tag">${recipe.country}</p>
                    </div>
                </div>
                <button class="fav-btn active" onclick="toggleFav('${recipe.id}')">❤️</button>
            </div>
            <div class="recipe-body">
                <div class="recipe-section">
                    <h3>😋 المكونات</h3>
                    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
                </div>
                <div class="recipe-section">
                    <h3>👨‍🍳 خطوات التحضير</h3>
                    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>
                </div>
                <div class="recipe-section">
                    <h3>⏱ معلومات</h3>
                    <div class="info-box">
                        <span>⏰ ${recipe.time}</span>
                        <span>🔥 ${recipe.level}</span>
                        <span>💸 ${recipe.price}</span>
                    </div>
                </div>
            </div>`;

        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderFavs);