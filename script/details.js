import { categoryMealFooter } from './footer.js';
import { scrollUpButton } from './scroll-up-button.js';
import {
    hamburgerMenu,
    footerSearchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    savedOverlayContent,
    addFavorite,
    idSaveToStorage,
    getHeaderFavoriteQuantity,
} from './header.js';

const randomMealId = sessionStorage.getItem('RecipeId');
const mealRecipeDetailsContainer = document.querySelector(
    '.js-meal-recipe-details-container'
);
const alsoLoveMealContent = document.querySelector(
    '.js-also-love-meal-content'
);

scrollUpButton();
hamburgerMenu();
footerSearchInputOverlay();
buttonSearchInput();
enterSearchInput();
savedOverlayContent();
getHeaderFavoriteQuantity();
mealRecipeDetails();
renderRandomCategoryRecipe();
categoryMealFooter();

// Section Rendering

async function mealRecipeDetails() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMealId}`
    );
    const data = await res.json();
    let apiRecipeDetails = '';
    data.meals.forEach((item) => {
        apiRecipeDetails += `
        <div class="meal-recipe" data-id = "${item.idMeal}">
            <div class="meal-recipe-wrapper">
                <div class="meal-recipe-details">
                    <h1>${item.strMeal}</h1>
                    <h2>Ingredients</h2>
                    <div class="meal-recipe-ingredients">
                        <div class="meal-ingredients">
                            <ul>
                                <li>${item.strIngredient1}</li>
                                <li>${item.strIngredient2}</li>
                                <li>${item.strIngredient3}</li>
                                <li>${item.strIngredient4}</li>
                                <li>${item.strIngredient5}</li>
                                <li>${item.strIngredient6}</li>
                                <li>${item.strIngredient7}</li>
                                <li>${item.strIngredient8}</li>
                                <li>${item.strIngredient9}</li>
                                <li>${item.strIngredient10}</li>
                                <li>${item.strIngredient11}</li>
                                <li>${item.strIngredient12}</li>
                                <li>${item.strIngredient13}</li>
                                <li>${item.strIngredient14}</li>
                                <li>${item.strIngredient15}</li>
                                <li>${item.strIngredient16}</li>
                                <li>${item.strIngredient17}</li>
                                <li>${item.strIngredient18}</li>
                                <li>${item.strIngredient19}</li>
                                <li>${item.strIngredient20}</li>
                            </ul>
                        </div>
                        <div class="divider"></div>
                        <div class="meal-measures">
                            <ul>
                                <li>${item.strMeasure1}</li>
                                <li>${item.strMeasure2}</li>
                                <li>${item.strMeasure3}</li>
                                <li>${item.strMeasure4}</li>
                                <li>${item.strMeasure5}</li>
                                <li>${item.strMeasure6}</li>
                                <li>${item.strMeasure7}</li>
                                <li>${item.strMeasure8}</li>
                                <li>${item.strMeasure9}</li>
                                <li>${item.strMeasure10}</li>
                                <li>${item.strMeasure11}</li>
                                <li>${item.strMeasure12}</li>
                                <li>${item.strMeasure13}</li>
                                <li>${item.strMeasure14}</li>
                                <li>${item.strMeasure15}</li>
                                <li>${item.strMeasure16}</li>
                                <li>${item.strMeasure17}</li>
                                <li>${item.strMeasure18}</li>
                                <li>${item.strMeasure19}</li>
                                <li>${item.strMeasure20}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="meal-recipe-image">
                    <img src="${item.strMealThumb}" alt="">
                </div>
            </div>
            <div class="details-btn-container">
                <button class="details-btn-direction js-details-btn-direction">Direction</button>
                <a href="${item.strSource}" target="_blank"><button class="details-btn-read-more js-details-btn-read-more">Read More</button></a>
                <a href="${item.strYoutube}" target="_blank"><button class="details-btn-watch"><i class="fa-brands fa-youtube"></i>Watch now</button></a>
            </div>
            <div class="meal-directions-container js-meal-directions-container">
                <div class="meal-directions">
                    <h3 class="meal-direction-title">How to Make ${item.strMeal}</h3>
                    <p class="meal-directions-details">${item.strInstructions}</p>
                </div>
            </div>    
        </div>
        `;
    });
    mealRecipeDetailsContainer.innerHTML = apiRecipeDetails;
    removeEmptyIngredientsMeasures();
    splitDirectionDetails();
    clickDirectionButton();
}

function removeEmptyIngredientsMeasures() {
    const valueIngredients = document.querySelectorAll(
        '.meal-ingredients ul li'
    );
    const valueMeasures = document.querySelectorAll('.meal-measures ul li');
    for (let i = 0; i < valueIngredients.length; i++) {
        const stringIngredients = valueIngredients[i].innerHTML;
        const stringMeasures = valueMeasures[i].innerHTML;
        if (stringIngredients === 'null' || stringMeasures === 'null') {
            valueIngredients[i].innerHTML = '';
            valueMeasures[i].innerHTML = '';
        }
    }
}

function splitDirectionDetails() {
    const directionDetails = document.querySelector('.meal-directions-details');
    const directionSplit = directionDetails.innerHTML.split(/[.]/);
    let directionValue = '';
    directionSplit.forEach((direction) => {
        if (direction === '') return;
        else {
            directionValue += `
                <p> <span>☛</span> ${direction}</p>
            `;
        }
    });
    directionDetails.innerHTML = directionValue;
}

async function randomCategoryRecipeName() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );
    const data = await res.json();
    const randomCategory = Math.floor(Math.random() * data.meals.length);
    const randomCategoryName = data.meals[randomCategory].strCategory;
    return randomCategoryName;
}

async function randomCategoryRecipeId() {
    const categoryName = await randomCategoryRecipeName();
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    );
    const data = await res.json();
    const recipeId = data.meals;
    return recipeId;
}

async function renderRandomCategoryRecipe() {
    const categoryRecipeId = await randomCategoryRecipeId();
    let randomCategoryHTML = '';
    categoryRecipeId.forEach((meal) => {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((food) => {
                    randomCategoryHTML += `
                    <div class="also-love-result js-also-love-result" data-id = "${food.idMeal}">
                        <div class="also-love-image-container">
                            <img src="${food.strMealThumb}" alt="" class="also-love-image">
                            <i class="fa-regular fa-heart favorite-recipe-btn"></i>
                        </div>
                        <div class="also-love-details-container">
                            <div class="also-love-details">
                                <h4 class="also-love-meal-name">${food.strMeal}</h4>
                                <h5>${food.strArea}</h5>
                            </div>
                            <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    `;
                });
                alsoLoveMealContent.innerHTML = randomCategoryHTML;
                clickRandomCategoryRecipeCard();
            });
    });
}

// Page Interaction

function clickDirectionButton() {
    const directionContainer = document.querySelector(
        '.js-meal-directions-container'
    );
    const buttonDirection = document.querySelector('.js-details-btn-direction');
    buttonDirection.addEventListener('click', () => {
        buttonDirection.classList.toggle('active');
        directionContainer.classList.toggle('active');
        directionContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    });
}

function clickRandomCategoryRecipeCard() {
    const alsoLoveResultContent = document.querySelectorAll(
        '.js-also-love-result'
    );
    alsoLoveResultContent.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('also-love-image') ||
                e.target.classList.contains('also-love-meal-name')
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
