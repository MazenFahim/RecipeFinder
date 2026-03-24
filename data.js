const recipes = [
  {
    name: "Koshary",
    image: "images/kushary.png",
    desc: "Egyptian Street Food 🇪🇬",
    ingredients: ["Rice", "Pasta", "Lentils", "Tomato Sauce"],
    steps: [
      "Cook rice & lentils",
      "Boil pasta",
      "Prepare sauce",
      "Combine everything"
    ],
    time: "30 min",
    level: "Easy",
    price: "Cheap"
  },
  {
    name: "Molokhia",
    image: "images/Molokhia.png",
    desc: "Traditional Egyptian Dish 🇪🇬",
    ingredients: ["Molokhia leaves", "Garlic", "Coriander", "Chicken"],
    steps: [
      "Cook chicken",
      "Prepare molokhia",
      "Add garlic mix",
      "Serve hot"
    ],
    time: "40 min",
    level: "Medium",
    price: "Affordable"
  },
  {
    name: "Ta’ameya",
    image: "images/Ta’ameya.png",
    desc: "Egyptian Falafel 🇪🇬",
    ingredients: ["Fava beans", "Parsley", "Onion", "Spices"],
    steps: [
      "Soak and grind fava beans",
      "Mix with herbs and spices",
      "Form patties",
      "Fry until golden"
    ],
    time: "25 min",
    level: "Easy",
    price: "Cheap"
  },
  {
    name: "Hawawshi",
    image: "images/hawawshi.png",
    desc: "Spiced Meat in Bread 🇪🇬",
    ingredients: ["Bread", "Minced meat", "Onion", "Spices"],
    steps: [
      "Prepare meat mixture",
      "Stuff bread with meat",
      "Bake until golden",
      "Serve hot"
    ],
    time: "35 min",
    level: "Medium",
    price: "Affordable"
  },
  {
    name: "Ful Medames",
    image: "images/ful_medames.png",
    desc: "Slow-cooked Fava Beans 🇪🇬",
    ingredients: ["Fava beans", "Olive oil", "Lemon", "Garlic"],
    steps: [
      "Cook fava beans until soft",
      "Mash slightly",
      "Add olive oil, lemon, and garlic",
      "Serve with bread"
    ],
    time: "45 min",
    level: "Easy",
    price: "Cheap"
  }
];
const parent = document.querySelector(".parentEg");

recipes.forEach(recipe => {

  const card = document.createElement("div");
  card.classList.add("recipe-card");

  card.innerHTML = `
    <div class="recipe-header">
      <img src="${recipe.image}" alt="Recipe">
      <div class="overlay">
        <h1>${recipe.name}</h1>
        <p>${recipe.desc}</p>
      </div>
    </div>

    <div class="recipe-body">

      <div class="recipe-section">
        <h3>🧂 Ingredients</h3>
        <ul>
          ${recipe.ingredients.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="recipe-section">
        <h3>👨‍🍳 Steps</h3>
        <ol>
          ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
        </ol>
      </div>

      <div class="recipe-section">
        <h3>⏱ Info</h3>
        <div class="info-box">
          <span>⏰ ${recipe.time}</span>
          <span>🔥 ${recipe.level}</span>
          <span>💸 ${recipe.price}</span>
        </div>
      </div>

    </div>
  `;

  parent.appendChild(card);
});