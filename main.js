const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchbtn = document.getElementById("search");
getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await response.json();
  const randomMeal = respData.meals[0];
  console.log(randomMeal);
  addMeal(randomMeal, true);
}
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();

  const meal = respData.meals[0];
  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  respData = await resp.json();
  const meals = respData.meals;
  return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
        <div class="meal-header">
        ${random ? `<span class="random"> Random recipe </span>` : ""}
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        </div>
        <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn" id="heartbtn">
            <i class="fa fa-heart"></i>
        </button>
        </div>
    `;
  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeFromLs(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLs(mealData.idMeal);
      btn.classList.add("active");
    }
    fetchFavMeals();
  });

  mealsEl.appendChild(meal);
}

function addMealToLs(mealId) {
  const mealIds = getMealsFromLs();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
function removeFromLs(mealId) {
  const mealIds = getMealsFromLs();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id != mealId))
  );
}
function getMealsFromLs() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  //clean the container
  favoriteContainer.innerHTML = "";
  const mealIds = getMealsFromLs();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];

    const meal = await getMealById(mealId);
    addMealToFav(meal);
  }

  //add them to the screen
}

function addMealToFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
  
    <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}"
    /><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fa-regular fa-circle-xmark" style="color: #9b9b8f;"></i></button>
        
    `;

  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeFromLs(mealData.idMeal);
    fetchFavMeals();
  });

  favoriteContainer.appendChild(favMeal);
}
searchbtn.addEventListener("click", async () => {
    mealsEl.innerHTML = ''
  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);
  if(meals){
    meals.forEach(meal => {
        addMeal(meal);
    });
  }

});
