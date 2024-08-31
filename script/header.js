const searchOverlay = document.querySelector('#search-overlay');
const searchIngredientsInput = document.querySelector(
    '.search-ingredients-input'
);
const navOverlay = document.querySelector('#nav-overlay');
const navContainer = document.querySelector('.nav-container');
const searchResultInput = document.querySelector('.search-result-input');
const searchResultButton = document.querySelector('.search-input-container i');
const hamburger = document.querySelector('.hamburger');
const closeNavOverlay = document.querySelector('.js-close-nav-overlay');
const navOverlaySearch = document.querySelector('.nav-overlay-search');
const heroSearchButton = document.querySelector('.js-hero-search');
const closeSearchOverlay = document.querySelector('.js-close-search-overlay');
const overlay = document.querySelector('#overlay');
const searchOnFooter = document.querySelector('.search-on-footer');
const searchIngredientsButton = document.querySelector('.search-ingredients i');
const categorySearchContainer = document.querySelector(
    '.js-category-description-search-container'
);
const countrySearchContainer = document.querySelector(
    '.js-country-description-search-container'
);
const favoriteSearchBtn = document.querySelector('.js-favorite-search-btn');
const savedOverlay = document.querySelector('#saved-overlay');
const closeSavedOverlay = document.querySelector('.js-close-saved-overlay');
const savedItemsLink = document.querySelector('.js-saved-items-link');
const removeFavoriteOverlay = document.querySelector(
    '#remove-favorite-overlay'
);
const headerFavoriteQuantity = document.querySelector(
    '.js-header-favorite-quantity'
);

// Favorites Content and Interaction

export let favoriteMeal =
    JSON.parse(sessionStorage.getItem('idFavorite')) || [];

export function idSaveToStorage() {
    sessionStorage.setItem('idFavorite', JSON.stringify(favoriteMeal));
}

export function addFavorite(mealId, buttonActive) {
    const sameId = favoriteMeal.includes(mealId);
    if (!sameId) {
        favoriteMeal.push(mealId);
        openSavedOverlay();
    } else if (sameId && !buttonActive) {
        removeFavorite(mealId);
        popupRemoveFavoriteOverlay();
    } else {
        openSavedOverlay();
    }
    idSaveToStorage();
    getHeaderFavoriteQuantity();
}

export function removeFavorite(mealId) {
    const newIdFavorite = [];
    favoriteMeal.forEach((item) => {
        if (item !== mealId) {
            newIdFavorite.push(item);
        }
    });

    favoriteMeal = newIdFavorite;
    idSaveToStorage();
}

export function getHeaderFavoriteQuantity() {
    headerFavoriteQuantity.innerHTML = `<p>${favoriteMeal.length}</p>`;
}

export function savedOverlayContent() {
    closeSavedOverlay.addEventListener('click', removeSavedOverlay);
    overlay.addEventListener('click', removeSavedOverlay);
    savedItemsLink.addEventListener('click', () => {
        location.href = './favorite.html';
    });
}

export function popupRemoveFavoriteOverlay() {
    function showRemoveFavoriteOverlay() {
        removeFavoriteOverlay.classList.add('active');
    }
    showRemoveFavoriteOverlay();

    function closeRemoveFavoriteOverlay() {
        removeFavoriteOverlay.classList.remove('active');
    }
    setTimeout(closeRemoveFavoriteOverlay, 1000);
}

// Headers-Utility Content and Interaction

export function openSearchOverlay() {
    if (searchOverlay === null) return;
    searchOverlay.classList.add('active');
    overlay.classList.add('active');
    searchIngredientsInput.focus();
    disableScroll();
}

export function removeSearchOverlay() {
    if (searchOverlay === null) return;
    searchOverlay.classList.remove('active');
    overlay.classList.remove('active');
    enableScroll();
}

export function openNavOverlay() {
    if (navOverlay === null) return;
    navOverlay.classList.add('active');
    overlay.classList.add('active');
    navContainer.style.display = 'none';
    disableScroll();
}

export function removeNavOverlay() {
    if (navOverlay === null) return;
    navOverlay.classList.remove('active');
    overlay.classList.remove('active');
    navContainer.style.display = 'flex';
    enableScroll();
}

export function openSavedOverlay() {
    if (savedOverlay === null) return;
    savedOverlay.classList.add('active');
    overlay.classList.add('active');
}

export function removeSavedOverlay() {
    if (savedOverlay === null) return;
    savedOverlay.classList.remove('active');
    overlay.classList.remove('active');
}

export function disableScroll() {
    document.body.classList.add('disable-scrolling');
}

export function enableScroll() {
    document.body.classList.remove('disable-scrolling');
}

export function hamburgerMenu() {
    hamburger.addEventListener('click', openNavOverlay);
    closeNavOverlay.addEventListener('click', removeNavOverlay);
    navOverlaySearch.addEventListener('click', () => {
        removeNavOverlay();
        openSearchOverlay();
    });
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
    window.addEventListener('scroll', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
}

export function searchInputOverlay() {
    heroSearchButton.addEventListener('click', openSearchOverlay);
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
    closeSearchOverlay.addEventListener('click', removeSearchOverlay);
    searchOnFooter.addEventListener('click', openSearchOverlay);
}

export function categorySearchInputOverlay() {
    categorySearchContainer.addEventListener('click', openSearchOverlay);
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
    closeSearchOverlay.addEventListener('click', removeSearchOverlay);
    searchOnFooter.addEventListener('click', openSearchOverlay);
}

export function countrySearchInputOverlay() {
    countrySearchContainer.addEventListener('click', openSearchOverlay);
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
    closeSearchOverlay.addEventListener('click', removeSearchOverlay);
    searchOnFooter.addEventListener('click', openSearchOverlay);
}

export function favoriteSearchInputOverlay() {
    favoriteSearchBtn.addEventListener('click', openSearchOverlay);
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
    });
    closeSearchOverlay.addEventListener('click', removeSearchOverlay);
    searchOnFooter.addEventListener('click', openSearchOverlay);
}

export function footerSearchInputOverlay() {
    searchOnFooter.addEventListener('click', openSearchOverlay);
    closeSearchOverlay.addEventListener('click', removeSearchOverlay);
    overlay.addEventListener('click', () => {
        removeSearchOverlay();
        removeNavOverlay();
        removeSavedOverlay();
    });
}

export function buttonSearchInput() {
    searchIngredientsButton.addEventListener('click', (e) => {
        let searchIngredientsValue = searchIngredientsInput.value.trim();
        if (searchIngredientsInput.value === '') {
            e.preventDefault();
        } else {
            location.href = './search-result.html';
            sessionStorage.setItem('IngredientsValue', searchIngredientsValue);
        }
    });
    searchIngredientsInput.value = '';
    searchIngredientsInput.focus();
}

export function enterSearchInput() {
    document.body.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let searchIngredientsValue = searchIngredientsInput.value.trim();
            if (searchIngredientsInput.value === '') {
                event.preventDefault();
            } else {
                location.href = './search-result.html';
                sessionStorage.setItem(
                    'IngredientsValue',
                    searchIngredientsValue
                );
            }
        }
    });
    searchIngredientsInput.value = '';
    searchIngredientsInput.focus();
}

export function buttonSearchResultInput() {
    searchResultButton.addEventListener('click', (e) => {
        let searchIngredientsValue = searchResultInput.value.trim();
        if (searchResultInput.value === '') {
            e.preventDefault();
        } else {
            location.href = './search-result.html';
            sessionStorage.setItem('IngredientsValue', searchIngredientsValue);
        }
    });
    searchResultInput.value = '';
    searchResultInput.focus();
}

export function enterSearchResultInput() {
    document.body.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let searchIngredientsValue = searchResultInput.value.trim();
            if (searchResultInput.value === '') {
                event.preventDefault();
            } else {
                location.href = './search-result.html';
                sessionStorage.setItem(
                    'IngredientsValue',
                    searchIngredientsValue
                );
            }
        }
    });
    searchResultInput.value = '';
    searchResultInput.focus();
}
