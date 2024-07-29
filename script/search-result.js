import { categoryMealFooter } from './footer.js';
import { scrollUpButton } from './scroll-up-button.js';
import {
    hamburgerMenu,
    footerSearchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    buttonSearchResultInput,
    enterSearchResultInput,
    savedOverlayContent,
    addFavorite,
    idSaveToStorage,
    getHeaderFavoriteQuantity,
} from './header.js';

const searchInputValue = sessionStorage.getItem('IngredientsValue');
const searchResultContainer = document.querySelector(
    '.search-result-container'
);
const recommendedSearchContainer = document.querySelector(
    '.recommended-search-container'
);
const searchResultDescription = document.querySelector(
    '.js-search-result-description'
);
const searchResultRecipeContent = document.querySelector(
    '.js-search-result-recipe-content'
);
const recommendedSearchContent = document.querySelector(
    '.js-recommended-search-content'
);
const recommendedSearchTitle = document.querySelector(
    '.js-recommended-search-title'
);

scrollUpButton();
hamburgerMenu();
footerSearchInputOverlay();
buttonSearchInput();
enterSearchInput();
buttonSearchResultInput();
enterSearchResultInput();
savedOverlayContent();
getHeaderFavoriteQuantity();
renderSearchByMainIngredients();
categoryMealFooter();

// Section Rendering

async function renderSearchByMainIngredients() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputValue}`
    );
    const data = await res.json();
    let searchResultHTML = '';
    if (data.meals) {
        data.meals.forEach((meal) => {
            fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            )
                .then((res) => res.json())
                .then((details) => {
                    details.meals.forEach((food) => {
                        searchResultHTML += `
                        <div class="search-content-result js-search-content-result" data-id = "${food.idMeal}">
                            <div class="search-content-image-container">
                                <img src="${food.strMealThumb}" alt="" class="search-content-image">
                                <i class="fa-regular fa-heart favorite-recipe-btn"></i>
                            </div>
                            <div class="search-content-details-container">
                                <div class="search-content-details">
                                    <h4 class="search-content-meal-name">${food.strMeal}</h4>
                                    <h5>${food.strArea}</h5>
                                </div>
                                <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                            </div>
                        </div>
                    `;
                    });
                    searchResultRecipeContent.innerHTML = searchResultHTML;
                    renderSearchResultDescription();
                    clickSearchContentResultCard();
                });
        });
    } else {
        renderNullSearchResultDescription();
    }
}

function renderSearchResultDescription() {
    searchResultDescription.innerHTML = `
                    <div class="search-description-content">
                        <p>Search result for <span class="user-input">'${searchInputValue}'</span></p>
                    </div>
                `;
    recommendedSearchContainer.style.display = 'none';
}

function renderNullSearchResultDescription() {
    searchResultDescription.innerHTML = `
            <div class="search-description-content">
                <p>Search result for <span class="user-input">'${searchInputValue}'</span></p>
                <div class="no-found-description-content">
                    <p>Sorry we didn't find any meal for your ingredients!</p>
                    <p>Please try other ingredients or see <span class="recommended-recipes-btn">recommended recipes</span>.</p>
                    <p><span class="be-specific">Be specific in your search.</span> Example: pepper, vinegar, butter</p>
                </div>
            </div>
        `;
    recommendedSearchContainer.style.display = 'none';
    clickRecommendedRecipeButton();
}

async function getRandomCategoryRecipeName() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );
    const data = await res.json();
    const randomCategory = Math.floor(Math.random() * data.meals.length);
    const randomCategoryName = data.meals[randomCategory].strCategory;
    return randomCategoryName;
}

async function getRandomCategoryRecipeId() {
    const categoryName = await getRandomCategoryRecipeName();
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    );
    const data = await res.json();
    const recipeId = data.meals;
    return recipeId;
}

async function renderRecommendedMeal() {
    const categoryRecipeId = await getRandomCategoryRecipeId();
    let randomHTML = '';
    categoryRecipeId.forEach((meal) => {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((food) => {
                    randomHTML += `
                    <div class="recommended-result js-recommended-result" data-id = "${food.idMeal}">
                        <div class="recommended-image-container">
                            <img src="${food.strMealThumb}" alt="" class="recommended-image">
                            <i class="fa-regular fa-heart favorite-recipe-btn"></i>
                        </div>
                        <div class="recommended-details-container">
                            <div class="recommended-details">
                                <h4 class="recommended-meal-name">${food.strMeal}</h4>
                                <h5>${food.strArea}</h5>
                            </div>
                            <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    `;
                });
                recommendedSearchContent.innerHTML = randomHTML;
                recommendedSearchTitle.innerHTML = `
                <p>Recommended For You</p>
            `;
                clickRecommendedResultContent();
            });
    });
}

// Page Interaction

function clickSearchContentResultCard() {
    const searchContentResultCard = document.querySelectorAll(
        '.js-search-content-result'
    );
    searchContentResultCard.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('search-content-image') ||
                e.target.classList.contains('search-content-meal-name')
            ) {
                const randomMealId = result.dataset.id;
                location.href = './details.html';
                sessionStorage.setItem('RecipeId', randomMealId);
            }
            if (e.target.classList.contains('favorite-recipe-btn')) {
                const favoriteId = result.dataset.id;
                const recipeBtnActive = e.target.classList.toggle('active');
                addFavorite(favoriteId, recipeBtnActive);
                idSaveToStorage();
            }
        });
    });
}

function clickRecommendedRecipeButton() {
    const recommendedRecipesBtn = document.querySelector(
        '.recommended-recipes-btn'
    );
    recommendedRecipesBtn.addEventListener('click', () => {
        renderRecommendedMeal();
        recommendedSearchContainer.style.display = 'block';
        searchResultContainer.style.display = 'none';
    });
}

function clickRecommendedResultContent() {
    const recommendedResultContent = document.querySelectorAll(
        '.js-recommended-result'
    );
    recommendedResultContent.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('recommended-image') ||
                e.target.classList.contains('recommended-meal-name')
            ) {
                const randomMealId = result.dataset.id;
                location.href = './details.html';
                sessionStorage.setItem('RecipeId', randomMealId);
            }
            if (e.target.classList.contains('favorite-recipe-btn')) {
                const favoriteId = result.dataset.id;
                const recipeBtnActive = e.target.classList.toggle('active');
                addFavorite(favoriteId, recipeBtnActive);
                idSaveToStorage();
            }
        });
    });
}
