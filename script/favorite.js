import { categoryMealFooter } from './footer.js';
import { scrollUpButton } from './scroll-up-button.js';
import {
    hamburgerMenu,
    favoriteSearchInputOverlay,
    buttonSearchInput,
    enterSearchInput,
    favoriteMeal,
    removeFavorite,
    idSaveToStorage,
} from './header.js';

const favoriteDescription = document.querySelector('.favorite-description');
const favoriteSearchContent = document.querySelector(
    '.js-favorite-search-content'
);
const favoriteHeroQuantity = document.querySelector('.favorite-hero-quantity');
const favoriteSearchContainer = document.querySelector(
    '.js-favorite-search-container'
);
const favoriteDeleteButton = document.querySelector(
    '.js-favorite-delete-button'
);
const favoriteClearAllButton = document.querySelector(
    '.js-favorite-clear-all-button'
);

scrollUpButton();
hamburgerMenu();
favoriteSearchInputOverlay();
buttonSearchInput();
enterSearchInput();
renderFavoriteMeal();
toggleFavoriteDeleteButton();
categoryMealFooter();

// Section Rendering

function renderFavoriteMeal() {
    if (!favoriteMeal || favoriteMeal.length === 0) {
        console.log('Lord please help me');
        favoriteDescription.classList.add('active');
        favoriteHeroQuantity.innerHTML = '0 Recipes';
        favoriteSearchContainer.style.display = 'none';
        favoriteDeleteButton.classList.remove('active');
    } else {
        getFavoriteMeal();
        favoriteSearchContainer.style.display = 'block';
        if (favoriteMeal.length === 1) {
            favoriteHeroQuantity.innerHTML = '1 Recipe';
        } else {
            favoriteHeroQuantity.innerHTML = `${favoriteMeal.length} Recipes`;
        }
    }
}

function getFavoriteMeal() {
    let favoriteHTML = '';
    favoriteMeal.forEach((item) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item}`)
            .then((res) => res.json())
            .then((data) => {
                data.meals.forEach((food) => {
                    favoriteHTML += `
                    <div class="favorite-result js-favorite-result" data-id = "${food.idMeal}" data-meal-name = "${food.strMeal}">
                        <div class="favorite-image-container">
                            <img src="${food.strMealThumb}" alt="" class="favorite-image">
                            <i class="fa-solid fa-minus remove-btn"></i>
                        </div>
                        <div class="favorite-details-container">
                            <div class="favorite-details">
                                <h4 class="favorite-meal-name">${food.strMeal}</h4>
                                <h5>${food.strArea}</h5>
                            </div>
                            <a href="${food.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    `;
                });
                favoriteSearchContent.innerHTML = favoriteHTML;
                const removeBtn = document.querySelectorAll('.remove-btn');
                removeBtn.forEach((button) => {
                    showRemoveButton(button);
                });
                clickFavoriteResultContent();
            });
    });
}

// Page Interaction

function clickFavoriteResultContent() {
    const favoriteResultContent = document.querySelectorAll(
        '.js-favorite-result'
    );
    favoriteResultContent.forEach((results) => {
        results.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('favorite-image') ||
                e.target.classList.contains('favorite-meal-name')
            ) {
                const randomMealId = results.dataset.id;
                location.href = './details.html';
                sessionStorage.setItem('RecipeId', randomMealId);
            }
            if (e.target.classList.contains('remove-btn')) {
                const mealId = results.dataset.id;
                Swal.fire({
                    title: 'Remove from your favorites?',
                    text: `Are you sure you want to remove "${results.dataset.mealName}"?`,
                    showCancelButton: true,
                    confirmButtonText: 'Remove',
                    confirmButtonColor: 'rgba(58, 150, 145, 0.901)',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        removeFavorite(mealId);
                        results.remove();
                        if (favoriteMeal.length === 0) {
                            favoriteDescription.classList.add('active');
                            favoriteHeroQuantity.innerHTML = '0 Recipes';
                            renderFavoriteMeal();
                        } else if (favoriteMeal.length === 1) {
                            favoriteHeroQuantity.innerHTML = '1 Recipe';
                        } else {
                            favoriteHeroQuantity.innerHTML = `${favoriteMeal.length} Recipes`;
                        }
                        idSaveToStorage();
                    }
                });
            }
        });
    });
}

function showRemoveButton(container) {
    favoriteDeleteButton.addEventListener('click', () => {
        container.classList.toggle('active');
    });
}

function toggleFavoriteDeleteButton() {
    favoriteDeleteButton.addEventListener('click', (e) => {
        if (!favoriteMeal || favoriteMeal.length === 0) {
            e.preventDefault();
        } else {
            favoriteDeleteButton.classList.toggle('active');
        }
    });
}

favoriteClearAllButton.addEventListener('click', (e) => {
    if (!favoriteMeal || favoriteMeal.length === 0) {
        e.preventDefault();
    } else {
        Swal.fire({
            title: 'All favorites will be deleted!',
            text: 'Are you sure you want to clear all?',
            showCancelButton: true,
            confirmButtonColor: 'rgba(58, 150, 145, 0.901)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear all.',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'All favorite recipes has been deleted.',
                    '',
                    'success'
                ).then((result) => {
                    sessionStorage.clear();
                    location.reload();
                });
            }
        });
    }
});
