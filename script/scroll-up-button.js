export function scrollUpButton() {
    const detailsScrollUpButton = document.querySelector('.details-btn-scroll-up-icon');
    detailsScrollUpButton.style.display = 'none';
    document.body.onscroll = function() {
        if (window.scrollY > 2500) {
            detailsScrollUpButton.style.display = 'block';
        } else {
            detailsScrollUpButton.style.display = 'none';
        }
    }

    detailsScrollUpButton.addEventListener('click', () => {
        document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
    })
}