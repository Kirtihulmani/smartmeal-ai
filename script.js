const API_KEY = "44516cf80ea049b581b004538814c8c2";

async function getRecipesSpoonacular() {
  const ingredients = document.getElementById("ingredients").value;
  if (!ingredients) {
    alert("Please enter ingredients!");
    return;
  }

  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let recipeHtml = "";
    let shoppingItems = new Set();

    data.forEach(recipe => {
      recipeHtml += `
        <div class="recipe-card">
          <h3>${recipe.title}</h3>
          <img src="${recipe.image}" alt="${recipe.title}" width="150">
          <p><b>Used Ingredients:</b> ${recipe.usedIngredientCount}</p>
          <p><b>Missing Ingredients:</b> ${recipe.missedIngredientCount}</p>
        </div>
      `;

      recipe.missedIngredients.forEach(ing => {
        shoppingItems.add(ing.original);
      });
    });

    document.getElementById("recipeOutput").innerHTML = recipeHtml;

    let shoppingHtml = "<ul>";
    shoppingItems.forEach(item => {
      shoppingHtml += `<li><input type="checkbox"> ${item}</li>`;
    });
    shoppingHtml += "</ul>";

    document.getElementById("shoppingOutput").innerHTML = shoppingHtml;

  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.getElementById("recipeOutput").innerText = "❌ Failed to load recipes.";
  }
}

// 📌 Function to download shopping list as PDF
function downloadShoppingList() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let items = document.querySelectorAll("#shoppingOutput li");
  let text = "🛒 Shopping List\n\n";

  items.forEach((item, index) => {
    text += `${index + 1}. ${item.innerText.replace("☐ ", "")}\n`;
  });

  doc.text(text, 10, 10);
  doc.save("shopping-list.pdf");
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

