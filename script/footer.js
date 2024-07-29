export async function categoryMealFooter() {
    const categoryFooter = document.querySelector(
        '.js-category-footer-container'
    );
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );
    const data = await res.json();
    let categoryHTML = '';
    data.meals.forEach((meal) => {
        categoryHTML += `
            <li>${meal.strCategory}</li>
        `;
    });
    categoryFooter.innerHTML = categoryHTML;
    const categoryFooterLink = document.querySelectorAll(
        '.js-category-footer-container li'
    );
    categoryFooterLink.forEach((link, index) => {
        link.addEventListener('click', () => {
            const selectedCategory = data.meals[index].strCategory;
            location.href =
                './category.html#food-recipe-category-description-result';
            sessionStorage.setItem('CategoryName', selectedCategory);
        });
    });
}

export async function pageCategoryMealFooter(container) {
    const pageCategoryFooter = document.querySelector(
        '.js-page-category-footer-container'
    );
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );
    const data = await res.json();
    let pageCategoryHTML = '';
    data.meals.forEach((meal) => {
        pageCategoryHTML += `
            <li>${meal.strCategory}</li>
        `;
    });
    pageCategoryFooter.innerHTML = pageCategoryHTML;
    const pageCategoryFooterLink = document.querySelectorAll(
        '.js-page-category-footer-container li'
    );
    pageCategoryFooterLink.forEach((link, index) => {
        link.addEventListener('click', () => {
            const selectedCategory = data.meals[index].strCategory;
            sessionStorage.setItem('CategoryName', selectedCategory);
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            location.reload();
        });
    });
}
