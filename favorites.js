function getFavs() {
  return JSON.parse(localStorage.getItem("recipeFavorites") || "[]");
}

function toggleFav(name) {
  let favs = getFavs();
  if (favs.includes(name)) {
    favs = favs.filter(f => f !== name);
  } else {
    favs.push(name);
  }
  localStorage.setItem("recipeFavorites", JSON.stringify(favs));
  renderFavs();
}

function renderFavs() {
  const favs = getFavs();
  const grid = document.getElementById("favGrid");
  const favRecipes = recipes.filter(r => favs.includes(r.name));

  if (favRecipes.length === 0) {
    grid.innerHTML = `
      <div class="empty-fav">
        <p>💔 لا توجد وصفات في المفضلة</p>
        <a href="index.html">تصفح الوصفات</a>
      </div>`;
    return;
  }

  grid.innerHTML = "";
  favRecipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <div class="recipe-header">
        <img src="${recipe.image}" alt="${recipe.name}">
        <div class="overlay-meta">
          <p class="desc">${recipe.desc}</p>
          <p class="country-tag">${recipe.country}</p>
        </div>
        <button class="fav-btn active" onclick="toggleFav('${recipe.name}')">❤️</button>
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

renderFavs();