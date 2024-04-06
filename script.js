
// Get necessary DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const fav =  document.getElementById('fav');
const reset = document.getElementById('reset');
// Initialize an empty array to store fav meals and to store data into favorites 

let favoritesList=JSON.parse(localStorage.getItem('favorites')) || [];

//take value from user and fetch in api
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals === null) {
        alert('No meals found for this search query.');
      } else {
        displaySearchResults(data.meals);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

// Define a function to display meal items on screen
function displaySearchResults(meals) {
  searchResults.innerHTML = '';
 
  
  meals.forEach(meal => {
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');

    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealElement.appendChild(mealImage);

    const mealName = document.createElement('h2');
    mealName.innerText = meal.strMeal;
    mealElement.appendChild(mealName);

    const mealIngredients = document.createElement('ul');
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        const ingredient = document.createElement('li');
        ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
        mealIngredients.appendChild(ingredient);
      } 
      // else {
        // alert('not meal found');
        // alert('No ingredients found for this meal');
        // return;
        // break;
      // }
      
    }

    mealElement.appendChild(mealIngredients);

    const mealDescription = document.createElement('p');
    mealDescription.classList.add('description');
    mealDescription.innerText = meal.strInstructions;
    mealElement.appendChild(mealDescription);

    const readMoreButton = document.createElement('button');
    readMoreButton.innerHTML = 'Read More';
    readMoreButton.addEventListener('click', () => {
      mealDescription.classList.toggle('show');
    });
    mealElement.appendChild(readMoreButton);

    const favoriteButton = document.createElement('button');
    favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
    favoriteButton.addEventListener('click', () => {
      addToFavorites(meal);
    });
    mealElement.appendChild(favoriteButton);

    searchResults.appendChild(mealElement);
  });
}

// Function to save favorites to localStorage
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favoritesList));
}

function addToFavorites(meal){
    if(!favoritesList.includes(meal)){
        favoritesList.push(meal);
        saveFavorites(); 
        alert(`${meal.strMeal} has been added to your favourites..`);
    }else{
        alert(`${meal.strMeal} is already in your favourites..`);
    }
}

fav.addEventListener('click',showFav);

function showFav(){
    searchResults.innerHTML='';
    if(favoritesList.length===0){
      const noFavMessage=document.createElement('p');
      noFavMessage.innerText='You have no Favorite meals.';
      searchResults.appendChild(noFavMessage);
    }else{
      favoritesList.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.classList.add('meal');
    
        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealElement.appendChild(mealImage);
    
        const mealName = document.createElement('h2');
        mealName.innerText = meal.strMeal;
        mealElement.appendChild(mealName);
    
        const mealIngredients = document.createElement('ul');
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
            const ingredient = document.createElement('li');
            ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
            mealIngredients.appendChild(ingredient);
          } else{
            break;
          }

    }
    mealElement.appendChild(mealIngredients);
    //add remove button to favorites meals
    const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.addEventListener('click', () => {
          removeFromFavorites(meal);
      });
      mealElement.appendChild(removeButton);

      searchResults.appendChild(mealElement);
    });
  }
}


function removeFromFavorites(meal) {
  // Find the index of the meal in favoritesList
  let mealIndex = -1; // Initialize with -1 to indicate not found
  for (let i = 0; i < favoritesList.length; i++) {
    if (favoritesList[i].idMeal === meal.idMeal) {
      mealIndex = i; // Found the meal, store its index
      break; // Exit the loop since we found the meal
    }
  }

  // Check if the meal was found in favoritesList
  if (mealIndex !== -1) {
    // Remove the meal from favoritesList
    favoritesList.splice(mealIndex, 1);
    saveFavorites(); 

    // Update the displayed list of favorites
    showFav();

    // Show a notification to the user
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}

// Event listener for page load to check localStorage
window.addEventListener('load', () => {
  const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
  if (storedFavorites) {
    favoritesList = storedFavorites;
  }
});

 
  reset.addEventListener('click',()=>{
  searchResults.innerHTML='';
});


home.addEventListener('click',()=>{
  searchResults.innerHTML='';
})
