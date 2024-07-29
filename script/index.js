import { categoryMealFooter } from './footer.js';
import {
    hamburgerMenu,
    searchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    savedOverlayContent,
    addFavorite,
    idSaveToStorage,
    getHeaderFavoriteQuantity,
} from './header.js';

const mainRandomMeal = document.querySelector('.js-random-meal');
const coconutMilkContainer = document.querySelector('.js-coconut-milk');
const avocadoContainer = document.querySelector('.js-avocado');
const nutmegContainer = document.querySelector('.js-nutmeg');
const almondsContainer = document.querySelector('.js-almonds');
const coconutPrevious = document.querySelector('.js-coconut-previous');
const coconutNext = document.querySelector('.js-coconut-next');
const avocadoPrevious = document.querySelector('.js-avocado-previous');
const avocadoNext = document.querySelector('.js-avocado-next');
const nutmegPrevious = document.querySelector('.js-nutmeg-previous');
const nutmegNext = document.querySelector('.js-nutmeg-next');
const almondsPrevious = document.querySelector('.js-almonds-previous');
const almondsNext = document.querySelector('.js-almonds-next');
const selectRandomMealContainer = document.querySelector(
    '.js-select-random-meal'
);
let isDraggingStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

hamburgerMenu();
searchInputOverlay();
buttonSearchInput();
enterSearchInput();
savedOverlayContent();
getHeaderFavoriteQuantity();
createRandomMeal();
createIngredientsRecipeCard(
    'coconut milk',
    coconutMilkContainer,
    'coconut-favorite-recipe-btn'
);
createIngredientsRecipeCard(
    'avocado',
    avocadoContainer,
    'avocado-favorite-recipe-btn'
);
createIngredientsRecipeCard(
    'nutmeg',
    nutmegContainer,
    'nutmeg-favorite-recipe-btn'
);
createIngredientsRecipeCard(
    'almonds',
    almondsContainer,
    'almonds-favorite-recipe-btn'
);
renderSelectRandomMeal();
categoryMealFooter();

// Section Rendering

async function createRandomMeal() {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52913`
    );
    const data = await res.json();
    const meal = data.meals[0];
    let mealDetails = '';
    mealDetails += `
    <div class="grid">
        <div class="main-random-meal" data-id = "${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="" class="main-random-meal-image">
            <div class="main-random-meal-title">
                <h5>try our e<span>X</span>tra mouthwatering recipe!</h5>
                <p class="main-random-meal-name">${meal.strMeal}</p>
                <div class="main-random-meal-other-details">
                    <p>Country: ${meal.strArea}</p>
                    <p>Category: ${meal.strCategory}</p>
                </div>
                <a href="${meal.strSource}" target="_blank"><button>View More</button></a>
            </div>
            <div class="image-border"></div>
        </div>
        <div class="other-random-meal"></div>
    </div> 
    `;
    mainRandomMeal.innerHTML = mealDetails;
    clickMainRandomMealCard();
    renderOtherRandomMeal();
}

function renderOtherRandomMeal() {
    const otherRandomMealDetails = document.querySelector('.other-random-meal');
    const mealId = [52777, 52839, 52999, 53056];
    let otherMealDetails = '';
    mealId.forEach((value) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`)
            .then((res) => res.json())
            .then((data) => {
                const mealNameData = data.meals;
                mealNameData.forEach((item) => {
                    otherMealDetails += `
                        <div class="other-random-meal-card"  data-id = "${item.idMeal}">
                            <img src="${item.strMealThumb}" alt="" class="other-random-meal-image">
                            <div class="other-random-meal-details">
                                <p class="other-random-meal-title">${item.strMeal}</p>
                                <div class="other-random-meal-country-category">
                                    <p>${item.strArea}</p>
                                    <p>${item.strCategory}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                otherRandomMealDetails.innerHTML = otherMealDetails;
                clickOtherRandomMealCard();
            });
    });
}

async function createIngredientsRecipeCard(
    ingredients,
    container,
    favoriteButton
) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );
    const data = await res.json();
    let ingredientsHTML = '';
    data.meals.forEach((meal) => {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((food) => {
                    ingredientsHTML += `
                    <div class="ingredients-category-result category-result-content" data-id = "${food.idMeal}" draggable="false">
                                    <div class="ingredients-category-image-container">
                                        <img src="${food.strMealThumb}" alt="" class="ingredients-category-image">
                                        <i class="fa-regular fa-heart ${favoriteButton}"></i>
                                    </div>
                                    <div class="ingredients-category-details-container">
                                        <div class="ingredients-category-details">
                                            <h4 class="ingredients-category-meal-name">${food.strMeal}</h4>
                                            <h5>${food.strArea}</h5>
                                        </div>
                                        <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube ingredients-category-youtube-icon"></i></a>
                                    </div>
                                </div>
                `;
                });
                container.innerHTML = ingredientsHTML;
                clickIngredientsRecipeCard(favoriteButton);
            });
    });
}

async function renderSelectRandomMeal() {
    const res = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    const data = await res.json();
    const meal = data.meals[0];
    let selectMealHTML = '';
    selectMealHTML += `
        <div class="select-random-recipe-content" data-id = "${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="" class="select-random-meal-image">
            <div class="select-random-recipe-title">
                <div class="select-random-meal-name-container">
                    <p class="select-random-meal-name">${meal.strMeal}</p>
                    <div class="select-random-recipe-button-container">
                        <button class="select-random-recipe-button">click for random recipe</button>
                    </div>
                </div>
                <div class="select-random-meal-other-details">
                    <p class="select-random-meal-area">Country: ${meal.strArea}</p>
                    <p class="select-random-meal-category">Category: ${meal.strCategory}</p>
                </div>
                <div class="select-random-meal-link">
                    <a href="${meal.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i> Watch Now</a>
                    <a href="${meal.strSource}" target="_blank">View More ></a>
                </div>
            </div>
            <div class="select-random-image-border"></div>
        </div>
    `;
    selectRandomMealContainer.innerHTML = selectMealHTML;
    clickSelectRandomRecipeButton();
    clickSelectRandomMealCard();
}

// Page Interaction

function clickMainRandomMealCard() {
    const mainRandomMealContent = document.querySelector('.main-random-meal');
    mainRandomMealContent.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('main-random-meal-name') ||
            e.target.classList.contains('main-random-meal-image') ||
            e.target.classList.contains('image-border')
        ) {
            const randomMealId = mainRandomMealContent.dataset.id;
            location.href = './details.html';
            sessionStorage.setItem('RecipeId', randomMealId);
        }
    });
}

function clickOtherRandomMealCard() {
    const otherRandomMealContent = document.querySelectorAll(
        '.other-random-meal-card'
    );
    otherRandomMealContent.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('other-random-meal-title') ||
                e.target.classList.contains('other-random-meal-image')
            ) {
                const randomMealId = result.dataset.id;
                location.href = './details.html';
                sessionStorage.setItem('RecipeId', randomMealId);
            }
        });
    });
}

function clickIngredientsRecipeCard(favoriteButton) {
    const categoryResultContent = document.querySelectorAll(
        '.ingredients-category-result'
    );
    categoryResultContent.forEach((result) => {
        result.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('ingredients-category-image') ||
                e.target.classList.contains('ingredients-category-meal-name')
            ) {
                const randomMealId = result.dataset.id;
                location.href = './details.html';
                sessionStorage.setItem('RecipeId', randomMealId);
            }
            if (e.target.classList.contains(`${favoriteButton}`)) {
                const favoriteId = result.dataset.id;
                const recipeBtnActive = e.target.classList.toggle('active');
                addFavorite(favoriteId, recipeBtnActive);
                idSaveToStorage();
            }
        });
    });
}

function clickSelectRandomRecipeButton() {
    const selectRandomRecipeButton = document.querySelector(
        '.select-random-recipe-button'
    );
    selectRandomRecipeButton.addEventListener('click', renderSelectRandomMeal);
}

function clickSelectRandomMealCard() {
    const selectRandomRecipeContent = document.querySelector(
        '.select-random-recipe-content'
    );
    selectRandomRecipeContent.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('select-random-meal-name') ||
            e.target.classList.contains('select-random-meal-image') ||
            e.target.classList.contains('select-random-image-border')
        ) {
            const randomMealId = selectRandomRecipeContent.dataset.id;
            location.href = './details.html';
            sessionStorage.setItem('RecipeId', randomMealId);
        }
    });
}

function draggingStart(e, container) {
    isDraggingStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = container.scrollLeft;
}

function dragging(e, container) {
    if (!isDraggingStart) return;
    e.preventDefault();
    isDragging = true;
    container.classList.add('dragging');
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    container.scrollLeft = prevScrollLeft - positionDiff;
}

function draggingStop(container) {
    isDraggingStart = false;
    container.classList.remove('dragging');
    if (!isDragging) return;
    isDragging = false;
}

function scrollDimension(scrollValue, container, previous, next) {
    let maxScrollWidth = container.scrollWidth - container.clientWidth;
    if (scrollValue <= 0) {
        previous.style.display = 'none';
    } else {
        previous.style.display = 'block';
    }
    if (maxScrollWidth - scrollValue <= 1) {
        next.style.display = 'none';
    } else {
        next.style.display = 'block';
    }
}

coconutMilkContainer.addEventListener('mousedown', () => {
    draggingStart(event, coconutMilkContainer);
});
coconutMilkContainer.addEventListener('touchstart', () => {
    draggingStart(event, coconutMilkContainer);
});
coconutMilkContainer.addEventListener('touchmove', () => {
    dragging(event, coconutMilkContainer);
    scrollDimension(
        coconutMilkContainer.scrollLeft,
        coconutMilkContainer,
        coconutPrevious,
        coconutNext
    );
});
coconutMilkContainer.addEventListener('touchend', () => {
    draggingStop(coconutMilkContainer);
});
coconutMilkContainer.addEventListener('mousemove', () => {
    dragging(event, coconutMilkContainer);
    scrollDimension(
        coconutMilkContainer.scrollLeft,
        coconutMilkContainer,
        coconutPrevious,
        coconutNext
    );
});

avocadoContainer.addEventListener('mousedown', () => {
    draggingStart(event, avocadoContainer);
});
avocadoContainer.addEventListener('touchstart', () => {
    draggingStart(event, avocadoContainer);
});
avocadoContainer.addEventListener('touchmove', () => {
    dragging(event, avocadoContainer);
    scrollDimension(
        avocadoContainer.scrollLeft,
        avocadoContainer,
        avocadoPrevious,
        avocadoNext
    );
});
avocadoContainer.addEventListener('touchend', () => {
    draggingStop(avocadoContainer);
});
avocadoContainer.addEventListener('mousemove', () => {
    dragging(event, avocadoContainer);
    scrollDimension(
        avocadoContainer.scrollLeft,
        avocadoContainer,
        avocadoPrevious,
        avocadoNext
    );
});

nutmegContainer.addEventListener('mousedown', () => {
    draggingStart(event, nutmegContainer);
});
nutmegContainer.addEventListener('touchstart', () => {
    draggingStart(event, nutmegContainer);
});
nutmegContainer.addEventListener('touchmove', () => {
    dragging(event, nutmegContainer);
    scrollDimension(
        nutmegContainer.scrollLeft,
        nutmegContainer,
        nutmegPrevious,
        nutmegNext
    );
});
nutmegContainer.addEventListener('touchend', () => {
    draggingStop(nutmegContainer);
});
nutmegContainer.addEventListener('mousemove', () => {
    dragging(event, nutmegContainer);
    scrollDimension(
        nutmegContainer.scrollLeft,
        nutmegContainer,
        nutmegPrevious,
        nutmegNext
    );
});

almondsContainer.addEventListener('mousedown', () => {
    draggingStart(event, almondsContainer);
});
almondsContainer.addEventListener('touchstart', () => {
    draggingStart(event, almondsContainer);
});
almondsContainer.addEventListener('touchmove', () => {
    dragging(event, almondsContainer);
    scrollDimension(
        almondsContainer.scrollLeft,
        almondsContainer,
        almondsPrevious,
        almondsNext
    );
});
almondsContainer.addEventListener('touchend', () => {
    draggingStop(almondsContainer);
});
almondsContainer.addEventListener('mousemove', () => {
    dragging(event, almondsContainer);
    scrollDimension(
        almondsContainer.scrollLeft,
        almondsContainer,
        almondsPrevious,
        almondsNext
    );
});

document.addEventListener('mouseup', () => {
    draggingStop(coconutMilkContainer);
    draggingStop(avocadoContainer);
    draggingStop(nutmegContainer);
    draggingStop(almondsContainer);
});

coconutPrevious.addEventListener('click', () => {
    let scrollWidth = (coconutMilkContainer.scrollLeft -= 250);
    scrollDimension(
        scrollWidth,
        coconutMilkContainer,
        coconutPrevious,
        coconutNext
    );
});

coconutNext.addEventListener('click', () => {
    let scrollWidth = (coconutMilkContainer.scrollLeft += 250);
    scrollDimension(
        scrollWidth,
        coconutMilkContainer,
        coconutPrevious,
        coconutNext
    );
});

avocadoPrevious.addEventListener('click', () => {
    let scrollWidth = (avocadoContainer.scrollLeft -= 250);
    scrollDimension(
        scrollWidth,
        avocadoContainer,
        avocadoPrevious,
        avocadoNext
    );
});

avocadoNext.addEventListener('click', () => {
    let scrollWidth = (avocadoContainer.scrollLeft += 250);
    scrollDimension(
        scrollWidth,
        avocadoContainer,
        avocadoPrevious,
        avocadoNext
    );
});

nutmegPrevious.addEventListener('click', () => {
    let scrollWidth = (nutmegContainer.scrollLeft -= 250);
    scrollDimension(scrollWidth, nutmegContainer, nutmegPrevious, nutmegNext);
});

nutmegNext.addEventListener('click', () => {
    let scrollWidth = (nutmegContainer.scrollLeft += 250);
    scrollDimension(scrollWidth, nutmegContainer, nutmegPrevious, nutmegNext);
});

almondsPrevious.addEventListener('click', () => {
    let scrollWidth = (almondsContainer.scrollLeft -= 250);
    scrollDimension(
        scrollWidth,
        almondsContainer,
        almondsPrevious,
        almondsNext
    );
});

almondsNext.addEventListener('click', () => {
    let scrollWidth = (almondsContainer.scrollLeft += 250);
    scrollDimension(
        scrollWidth,
        almondsContainer,
        almondsPrevious,
        almondsNext
    );
});
