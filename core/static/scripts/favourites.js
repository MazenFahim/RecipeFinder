function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        document.cookie.split(';').forEach(function (c) {
            c = c.trim();
            if (c.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(c.split('=')[1]);
            }
        });
    }
    return cookieValue;
}


// ===== TOGGLE FAVORITE =====
function toggleFav(btn) {

    var id = btn.dataset.id;
    var url = "/favorites/api/favorite/toggle/" + id + "/";

    fetch(url, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
    .then(function (r) {
        return r.json();
    })
    .then(function (data) {

        if (data.status === "added") {
            btn.innerHTML = "❤️";
        }

        if (data.status === "removed") {
            btn.innerHTML = "🤍";

            // remove only in favorites page
            if (document.getElementById("favContainer")) {
                var card = btn.closest(".recipe-card");
                if (card) {
                    card.remove();
                }
            }
        }
    });
}


// ===== SEARCH FIXED =====
async function searchRecipes() {

    var q = document.getElementById("searchBox").value;

    var res = await fetch("/recipes/api/recipes/?search=" + q);
    var data = await res.json();

    var container = document.getElementById("recipesContainer");
    container.innerHTML = "";

    var results = data.results || data;

    results.forEach(function (r) {

        var ingredients = "";

        if (r.ingredients && r.ingredients.length > 0) {

            ingredients = r.ingredients.map(function (i) {

                return typeof i === "string" ? i : i.name;

            }).join(", ");
        }

        container.innerHTML += `
            <div class="recipe-card">
                <h3>${r.name}</h3>
                <p>${r.description}</p>
                <p>${r.prep_time ? r.prep_time : "N/A"} min</p>
                <p>${ingredients ? ingredients : "No ingredients"}</p>

                <button onclick="toggleFav(this)" data-id="${r.id}">
                    🤍
                </button>
            </div>
        `;
    });
}
