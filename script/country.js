import { categoryMealFooter } from './footer.js';
import { scrollUpButton } from './scroll-up-button.js';
import {
    hamburgerMenu,
    countrySearchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    savedOverlayContent,
    addFavorite,
    idSaveToStorage,
    getHeaderFavoriteQuantity,
} from './header.js';

const greekCuisineMealContainer = document.querySelector(
    '.js-greek-cuisine-meal-container'
);
const frenchCuisineMealContainer = document.querySelector(
    '.js-french-cuisine-meal-container'
);
const countryRecipeCategory = document.querySelector(
    '.country-recipe-category p'
);
const countryRecipeCategoryCard = document.querySelector(
    '.js-country-recipe-category-card'
);
const countryRecipeCategoryResultTitleContainer = document.querySelector(
    '.country-recipe-category-result-title-container'
);
const countryResultContent = document.querySelector(
    '.js-country-recipe-category-result-content'
);
const countryRecipeBlurLeft = document.querySelector(
    '.js-country-recipe-blur-left'
);
const countryRecipeBlurRight = document.querySelector(
    '.js-country-recipe-blur-right'
);
const countryRecipeCategoryPrevious = document.querySelector(
    '.js-country-recipe-category-previous'
);
const countryRecipeCategoryNext = document.querySelector(
    '.js-country-recipe-category-next'
);
let countryMedia = window.matchMedia('(min-width: 700px)');
let countryIsDraggingStart = false,
    countryIsDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

scrollUpButton();
hamburgerMenu();
countrySearchInputOverlay();
buttonSearchInput();
enterSearchInput();
savedOverlayContent();
getHeaderFavoriteQuantity();
renderGreekCuisine();
renderFrenchCuisine();
createCountryRecipeCategoryList();
getCountryResult('American');
categoryMealFooter();

// Section Rendering

async function renderGreekCuisine() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken Quinoa Greek Salad`
    );
    const data = await res.json();
    const food = data.meals[0];
    let greekMealHTML = '';
    greekMealHTML += `
        <div class="greek-cuisine-meal">
            <div class="first-greek-cuisine-meal" data-id = "${food.idMeal}">
                <img src="${food.strMealThumb}" alt="" class="first-greek-meal-image">
                <p class="first-greek-meal-name">${food.strMeal}</p>
            </div>
            <div class="other-greek-cuisine-meal"></div>
        </div>
    `;
    greekCuisineMealContainer.innerHTML = greekMealHTML;
    const firstGreekCuisineMeal = document.querySelector(
        '.first-greek-cuisine-meal'
    );
    clickRecipeCard(firstGreekCuisineMeal);
    getOtherGreekCuisine();
}

function getOtherGreekCuisine() {
    const otherGreekCuisineMeal = document.querySelector(
        '.other-greek-cuisine-meal'
    );
    const otherGreekCuisine = ['Moussaka', 'Stuffed Lamb Tomatoes'];
    let otherGreekCuisineHTML = '';
    otherGreekCuisine.forEach((meal) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((item) => {
                    otherGreekCuisineHTML += `
                        <div class="other-greek-cuisine-content" data-id = "${item.idMeal}">
                            <img src="${item.strMealThumb}" alt="" class="other-greek-meal-image">
                            <p class="other-greek-meal-name">${item.strMeal}</p>
                        </div>
                    `;
                });
                otherGreekCuisineMeal.innerHTML = otherGreekCuisineHTML;
                const otherGreekCuisineContent = document.querySelectorAll(
                    '.other-greek-cuisine-content'
                );
                clickRandomRecipeCard(otherGreekCuisineContent);
            });
    });
}

async function renderFrenchCuisine() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=Chocolate Gateau`
    );
    const data = await res.json();
    const food = data.meals[0];
    let frenchMealHTML = '';
    frenchMealHTML += `
        <div class="french-cuisine-meal">
            <div class="other-french-cuisine-meal"></div>
            <div class="last-french-cuisine-meal" data-id = "${food.idMeal}">
                <img src="${food.strMealThumb}" alt="" class="last-french-meal-image">
                <p class="last-french-meal-name">${food.strMeal}</p>
            </div>
        </div>
    `;
    frenchCuisineMealContainer.innerHTML = frenchMealHTML;
    const lastFrenchCuisineMeal = document.querySelector(
        '.last-french-cuisine-meal'
    );
    clickRecipeCard(lastFrenchCuisineMeal);
    getOtherFrenchCuisine();
}

function getOtherFrenchCuisine() {
    const otherFrenchCuisineMeal = document.querySelector(
        '.other-french-cuisine-meal'
    );
    const otherFrenchCuisine = ['Tuna Nicoise', 'Fennel Dauphinoise'];
    let otherFrenchCuisineHTML = '';
    otherFrenchCuisine.forEach((meal) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((item) => {
                    otherFrenchCuisineHTML += `
                        <div class="other-french-cuisine-content" data-id = "${item.idMeal}">
                            <img src="${item.strMealThumb}" alt="" class="other-french-meal-image">
                            <p class="other-french-meal-name">${item.strMeal}</p>
                        </div>
                    `;
                });
                otherFrenchCuisineMeal.innerHTML = otherFrenchCuisineHTML;
                const otherFrenchCuisineContent = document.querySelectorAll(
                    '.other-french-cuisine-content'
                );
                clickRandomRecipeCard(otherFrenchCuisineContent);
            });
    });
}

async function createCountryRecipeCategoryList() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    const data = await res.json();
    const country = data.meals;
    let countryHTML = '';
    country.forEach((area, index) => {
        countryHTML += `
            <div class="country-recipe-category-list" draggable="false">
                <div class="country-recipe-name" data-id="${index}">
                    <p>${area.strArea}</p>
                </div>
            </div>
        `;
    });
    countryRecipeCategoryCard.innerHTML = countryHTML;
    const firstCountryList =
        countryRecipeCategoryCard.querySelector(`[data-id="0"]`);
    firstCountryList.classList.add('active');
    createCountryRecipeTitle(data.meals[0].strArea);
    clickCountryRecipeCard();
}

function createCountryRecipeTitle(title) {
    let countryTitleHTML = '';
    countryTitleHTML += `
        <p>Tasty ${title} Cuisine</p>
    `;
    countryRecipeCategoryResultTitleContainer.innerHTML = countryTitleHTML;
}

async function getCountryResult(countryName) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryName}`
    );
    const data = await res.json();
    let countryResultHTML = '';
    data.meals.forEach((meal) => {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
            .then((response) => response.json())
            .then((details) => {
                details.meals.forEach((food) => {
                    countryResultHTML += `
                <div class="country-result-content js-country-result-content" data-id = "${food.idMeal}">
                    <div class="country-result-content-image-container">
                        <img src="${food.strMealThumb}" alt="" class="country-result-content-image">
                        <i class="fa-regular fa-heart favorite-recipe-btn"></i>
                    </div>
                    <div class="country-result-content-details-container">
                        <div class="country-result-content-details">
                            <h4 class="country-result-content-name">${food.strMeal}</h4>
                            <h5>${food.strArea}</h5>
                        </div>
                        <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube country-result-content-youtube-icon"></i></a>
                    </div>
                </div>
                `;
                });
                countryResultContent.innerHTML = countryResultHTML;
                clickCountryResultContentCard();
            });
    });
}

// Page Interaction

function clickRecipeCard(container) {
    container.addEventListener('click', () => {
        const randomMealId = container.dataset.id;
        location.href = './details.html';
        sessionStorage.setItem('RecipeId', randomMealId);
    });
}

function clickRandomRecipeCard(container) {
    container.forEach((card) => {
        card.addEventListener('click', () => {
            const randomMealId = card.dataset.id;
            location.href = './details.html';
            sessionStorage.setItem('RecipeId', randomMealId);
        });
    });
}

function clickCountryRecipeCard() {
    const countryRecipeName = countryRecipeCategoryCard.querySelectorAll(
        '.country-recipe-name'
    );
    countryRecipeName.forEach((card) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const countryCardActive =
                countryRecipeCategoryCard.querySelector('.active');
            countryCardActive.classList.remove('active');
            card.classList.add('active');
            createCountryRecipeTitle(e.target.innerText);
            getCountryResult(e.target.innerText);
            countryRecipeCategory.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });
}

function clickCountryResultContentCard() {
    const countryResultContentCard = document.querySelectorAll(
        '.js-country-result-content'
    );
    countryResultContentCard.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('country-result-content-image') ||
                e.target.classList.contains('country-result-content-name')
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

function countryDraggingStart(e) {
    countryIsDraggingStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = countryRecipeCategoryCard.scrollLeft;
}

function countryDragging(e) {
    if (!countryIsDraggingStart) return;
    e.preventDefault();
    countryIsDragging = true;
    countryRecipeCategoryCard.classList.add('dragging');
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    countryRecipeCategoryCard.scrollLeft = prevScrollLeft - positionDiff;
}

function countryDraggingStop() {
    countryIsDraggingStart = false;
    countryRecipeCategoryCard.classList.remove('dragging');
    if (!countryIsDragging) return;
    countryIsDragging = false;
}

function countryScrollDimension(scrollValue) {
    if (countryMedia.matches) {
        let maxScrollWidth =
            countryRecipeCategoryCard.scrollWidth -
            countryRecipeCategoryCard.clientWidth;
        if (scrollValue <= 0) {
            countryRecipeCategoryPrevious.style.display = 'none';
            countryRecipeBlurLeft.style.display = 'none';
        } else {
            countryRecipeCategoryPrevious.style.display = 'block';
            countryRecipeBlurLeft.style.display = 'block';
        }
        if (maxScrollWidth - scrollValue <= 1) {
            countryRecipeCategoryNext.style.display = 'none';
            countryRecipeBlurRight.style.display = 'none';
        } else {
            countryRecipeCategoryNext.style.display = 'block';
            countryRecipeBlurRight.style.display = 'block';
        }
    } else {
        let maxScrollWidth =
            countryRecipeCategoryCard.scrollWidth -
            countryRecipeCategoryCard.clientWidth;
        if (scrollValue <= 0) {
            countryRecipeBlurLeft.style.display = 'none';
        } else {
            countryRecipeBlurLeft.style.display = 'block';
        }
        if (maxScrollWidth - scrollValue <= 1) {
            countryRecipeBlurRight.style.display = 'none';
        } else {
            countryRecipeBlurRight.style.display = 'block';
        }
    }
}

countryRecipeCategoryCard.addEventListener('mousedown', countryDraggingStart);
countryRecipeCategoryCard.addEventListener('touchstart', countryDraggingStart);
countryRecipeCategoryCard.addEventListener('touchmove', () => {
    countryDragging(event);
    countryScrollDimension(countryRecipeCategoryCard.scrollLeft);
});
countryRecipeCategoryCard.addEventListener('touchend', countryDraggingStop);
countryRecipeCategoryCard.addEventListener('mousemove', () => {
    countryDragging(event);
    countryScrollDimension(countryRecipeCategoryCard.scrollLeft);
});
document.addEventListener('mouseup', countryDraggingStop);

countryRecipeCategoryPrevious.addEventListener('click', () => {
    let scrollWidth = (countryRecipeCategoryCard.scrollLeft -= 250);
    countryScrollDimension(scrollWidth);
});
countryRecipeCategoryNext.addEventListener('click', () => {
    let scrollWidth = (countryRecipeCategoryCard.scrollLeft += 250);
    countryScrollDimension(scrollWidth);
});
