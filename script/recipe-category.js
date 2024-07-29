import { pageCategoryMealFooter } from './footer.js';
import { scrollUpButton } from './scroll-up-button.js';
import {
    hamburgerMenu,
    categorySearchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    savedOverlayContent,
    addFavorite,
    idSaveToStorage,
    getHeaderFavoriteQuantity,
} from './header.js';

const categoryNameSelected = sessionStorage.getItem('CategoryName');
const foodRecipeCategoryCard = document.querySelector(
    '.js-food-recipe-category-card'
);
const foodRecipeCategoryDetailsContainer = document.querySelector(
    '.js-food-recipe-category-details-container'
);
const foodRecipeCategoryResultTitleContainer = document.querySelector(
    '.food-recipe-category-result-title-container'
);
const foodRecipeCategory = document.querySelector('.food-recipe-category p');
const brunchSectionMealContainer = document.querySelector(
    '.js-brunch-section-meal-container'
);
const soupSectionMealContainer = document.querySelector(
    '.js-soup-section-meal-container'
);
const categoryResultContent = document.querySelector(
    '.js-food-recipe-category-result-content'
);
const foodRecipeBlurLeft = document.querySelector('.js-food-recipe-blur-left');
const foodRecipeBlurRight = document.querySelector(
    '.js-food-recipe-blur-right'
);
const foodRecipeCategoryPrevious = document.querySelector(
    '.js-food-recipe-category-previous'
);
const foodRecipeCategoryNext = document.querySelector(
    '.js-food-recipe-category-next'
);
let media = window.matchMedia('(min-width: 700px)');
let categoryIsDraggingStart = false,
    categoryIsDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

scrollUpButton();
hamburgerMenu();
categorySearchInputOverlay();
buttonSearchInput();
enterSearchInput();
savedOverlayContent();
getHeaderFavoriteQuantity();
createBrunchRecipe();
createSoupRecipe();
createFoodRecipeCategoryList();
getCategoryResultCondition();
pageCategoryMealFooter(foodRecipeCategoryDetailsContainer);

// Section Rendering

async function createBrunchRecipe() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=Chivito Uruguayo`
    );
    const data = await res.json();
    const food = data.meals[0];
    let brunchMealHTML = '';
    brunchMealHTML += `
        <div class="brunch-section-meal">
            <div class="other-brunch-section-meal"></div>
            <div class="last-brunch-section-meal" data-id = "${food.idMeal}">
                <img src="${food.strMealThumb}" alt="">
                <p class="last-brunch-section-name">${food.strMeal}</p>
            </div>
        </div>        
    `;
    brunchSectionMealContainer.innerHTML = brunchMealHTML;
    const lastBrunchSectionMeal = document.querySelector(
        '.last-brunch-section-meal'
    );
    clickRecipeCard(lastBrunchSectionMeal);
    createOtherBrunchRecipe();
}

function createOtherBrunchRecipe() {
    const otherBrunchSectionMeal = document.querySelector(
        '.other-brunch-section-meal'
    );
    const otherBrunchMeal = ['Banana Pancakes', 'Key Lime Pie'];
    let otherBrunchMealHTML = '';
    otherBrunchMeal.forEach((meal) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((item) => {
                    otherBrunchMealHTML += `
                        <div class="other-brunch-meal-content" data-id = "${item.idMeal}">
                            <img src="${item.strMealThumb}" alt="">
                            <p class="other-brunch-meal-name">${item.strMeal}</p>
                        </div>
                    `;
                });
                otherBrunchSectionMeal.innerHTML = otherBrunchMealHTML;
                const otherBrunchMealContent = document.querySelectorAll(
                    '.other-brunch-meal-content'
                );
                clickRandomRecipeCard(otherBrunchMealContent);
            });
    });
}

async function createSoupRecipe() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=Tunisian Lamb Soup`
    );
    const data = await res.json();
    const food = data.meals[0];
    let soupHTML = '';
    soupHTML += `
        <div class="soup-meal">
            <div class="first-soup-meal" data-id = "${food.idMeal}">
                <img src="${food.strMealThumb}" alt="" class="first-soup-meal-image">
                <p class="first-soup-meal-name">${food.strMeal}</p>
            </div>
            <div class="other-soup-meal"></div>
        </div>
    `;
    soupSectionMealContainer.innerHTML = soupHTML;
    const firstSoupMeal = document.querySelector('.first-soup-meal');
    clickRecipeCard(firstSoupMeal);
    createOtherSoupRecipe();
}

function createOtherSoupRecipe() {
    const otherSoupMeal = document.querySelector('.other-soup-meal');
    const otherSoupMealOption = ['Red Peas Soup', 'French Onion Soup'];
    let otherSoupHTML = '';
    otherSoupMealOption.forEach((meal) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((item) => {
                    otherSoupHTML += `
                        <div class="other-soup-content" data-id = "${item.idMeal}">
                            <img src="${item.strMealThumb}" alt="" class="other-soup-image">
                            <p class="other-soup-name">${item.strMeal}</p>
                        </div>
                    `;
                });
                otherSoupMeal.innerHTML = otherSoupHTML;
                const otherSoupContent = document.querySelectorAll(
                    '.other-soup-content'
                );
                clickRandomRecipeCard(otherSoupContent);
            });
    });
}

async function createFoodRecipeCategoryList() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    const data = await res.json();
    const dataCategories = data.categories;
    let foodRecipeHTML = '';
    dataCategories.forEach((food) => {
        foodRecipeHTML += `
            <div class="food-recipe-category-list" draggable="false">
                <div class="food-recipe-name" data-id="${food.idCategory}">
                    <img src="${food.strCategoryThumb}" alt="">
                    <p>${food.strCategory}</p>
                </div>
            </div>
        `;
    });
    foodRecipeCategoryCard.innerHTML = foodRecipeHTML;
    categoryNameSelectedCondition(data, dataCategories);
    clickFoodRecipeCategoryList(data);
}

function createFoodRecipeCategoryDetails(foodDetails) {
    let categoryDetailsHTML = '';
    categoryDetailsHTML += `
        <div class="food-recipe-category-content">
            <div class="recipe-category-content-image-container">
                <div class="category-content-image">
                    <img src="${foodDetails.strCategoryThumb}" alt="">
                </div>
                <h5>${foodDetails.strCategory}</h5>
            </div>
            <div class="recipe-category-name-details">
                <p>${foodDetails.strCategoryDescription}</p>
            </div>
        </div>
    `;
    foodRecipeCategoryDetailsContainer.innerHTML = categoryDetailsHTML;
    let resultTitleHTML = '';
    resultTitleHTML += `
        <p>Tasty ${foodDetails.strCategory} Recipes</p>
    `;
    foodRecipeCategoryResultTitleContainer.innerHTML = resultTitleHTML;
}

async function getCategoryResult(categoryName) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    );
    const data = await res.json();
    let categoryResultHTML = '';
    data.meals.forEach((meal) => {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
            .then((response) => response.json())
            .then((details) => {
                details.meals.forEach((food) => {
                    categoryResultHTML += `
                <div class="category-result-content js-category-result-content" data-id = "${food.idMeal}">
                    <div class="category-result-content-image-container">
                        <img src="${food.strMealThumb}" alt="" class="category-result-content-image">
                        <i class="fa-regular fa-heart favorite-recipe-btn"></i>
                    </div>
                    <div class="category-result-content-details-container">
                        <div class="category-result-content-details">
                            <h4 class="category-result-content-name">${food.strMeal}</h4>
                            <h5>${food.strArea}</h5>
                        </div>
                        <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube category-result-content-youtube-icon"></i></a>
                    </div>
                </div>
                `;
                });
                categoryResultContent.innerHTML = categoryResultHTML;
                clickCategoryResultContentCard();
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

function categoryNameSelectedCondition(data, dataCategories) {
    if (categoryNameSelected === null) {
        const firstList = data.categories[0].idCategory;
        const firstCategoryList = foodRecipeCategoryCard.querySelector(
            `[data-id="${firstList}"]`
        );
        firstCategoryList.classList.add('active');
        createFoodRecipeCategoryDetails(data.categories[0]);
    } else {
        dataCategories.forEach((meal) => {
            if (categoryNameSelected === meal.strCategory) {
                const selectedCategoryList =
                    foodRecipeCategoryCard.querySelector(
                        `[data-id="${meal.idCategory}"]`
                    );
                selectedCategoryList.classList.add('active');
                createFoodRecipeCategoryDetails(meal);
            }
        });
    }
}

function clickFoodRecipeCategoryList(data) {
    const foodRecipeCategoryList =
        foodRecipeCategoryCard.querySelectorAll('.food-recipe-name');
    foodRecipeCategoryList.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryCardActive =
                foodRecipeCategoryCard.querySelector('.active');
            categoryCardActive.classList.remove('active');
            card.classList.add('active');
            const cardDetails = data.categories[index];
            createFoodRecipeCategoryDetails(cardDetails);
            getCategoryResult(cardDetails.strCategory);
            foodRecipeCategory.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });
}

function clickCategoryResultContentCard() {
    const categoryResultContentCard = document.querySelectorAll(
        '.js-category-result-content'
    );
    categoryResultContentCard.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('category-result-content-image') ||
                e.target.classList.contains('category-result-content-name')
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

function getCategoryResultCondition() {
    if (categoryNameSelected === null) {
        getCategoryResult('Beef');
    } else {
        getCategoryResult(categoryNameSelected);
    }
}

function categoryDraggingStart(e) {
    categoryIsDraggingStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = foodRecipeCategoryCard.scrollLeft;
}

function categoryDragging(e) {
    if (!categoryIsDraggingStart) return;
    e.preventDefault();
    categoryIsDragging = true;
    foodRecipeCategoryCard.classList.add('dragging');
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    foodRecipeCategoryCard.scrollLeft = prevScrollLeft - positionDiff;
}

function categoryDraggingStop() {
    categoryIsDraggingStart = false;
    foodRecipeCategoryCard.classList.remove('dragging');

    if (!categoryIsDragging) return;
    categoryIsDragging = false;
}

function categoryScrollDimension(scrollValue) {
    if (media.matches) {
        let maxScrollWidth =
            foodRecipeCategoryCard.scrollWidth -
            foodRecipeCategoryCard.clientWidth;
        if (scrollValue <= 0) {
            foodRecipeCategoryPrevious.style.display = 'none';
            foodRecipeBlurLeft.style.display = 'none';
        } else {
            foodRecipeCategoryPrevious.style.display = 'block';
            foodRecipeBlurLeft.style.display = 'block';
        }
        if (maxScrollWidth - scrollValue <= 1) {
            foodRecipeCategoryNext.style.display = 'none';
            foodRecipeBlurRight.style.display = 'none';
        } else {
            foodRecipeCategoryNext.style.display = 'block';
            foodRecipeBlurRight.style.display = 'block';
        }
    } else {
        let maxScrollWidth =
            foodRecipeCategoryCard.scrollWidth -
            foodRecipeCategoryCard.clientWidth;
        if (scrollValue <= 0) {
            foodRecipeBlurLeft.style.display = 'none';
        } else {
            foodRecipeBlurLeft.style.display = 'block';
        }
        if (maxScrollWidth - scrollValue <= 1) {
            foodRecipeBlurRight.style.display = 'none';
        } else {
            foodRecipeBlurRight.style.display = 'block';
        }
    }
}

foodRecipeCategoryCard.addEventListener('mousedown', categoryDraggingStart);
foodRecipeCategoryCard.addEventListener('touchstart', categoryDraggingStart);
foodRecipeCategoryCard.addEventListener('touchmove', () => {
    categoryDragging(event);
    categoryScrollDimension(foodRecipeCategoryCard.scrollLeft);
});
foodRecipeCategoryCard.addEventListener('touchend', categoryDraggingStop);
foodRecipeCategoryCard.addEventListener('mousemove', () => {
    categoryDragging(event);
    categoryScrollDimension(foodRecipeCategoryCard.scrollLeft);
});
document.addEventListener('mouseup', categoryDraggingStop);
foodRecipeCategoryPrevious.addEventListener('click', () => {
    let scrollWidth = (foodRecipeCategoryCard.scrollLeft -= 250);
    categoryScrollDimension(scrollWidth);
});
foodRecipeCategoryNext.addEventListener('click', () => {
    let scrollWidth = (foodRecipeCategoryCard.scrollLeft += 250);
    categoryScrollDimension(scrollWidth);
});
