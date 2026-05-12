// 1. ضع دالة getCookie خارجاً لتكون عامة
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function toggleFav(btnElement) {
    const recipeId = btnElement.getAttribute('data-id');
    const url = `/favorites/api/favorite/toggle/${recipeId}/`;
    const csrftoken = getCookie('csrftoken');

    fetch(url, {
        method: 'GET', 
        headers: { 
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.status === 'added') {
            btnElement.innerText = "❤️";
        } else if (data.status === 'removed') {
            if (window.location.pathname.includes('favorites')) {
                const recipeCard = btnElement.closest('.recipe-card');
                if (recipeCard) recipeCard.remove();
            } else {
                btnElement.innerText = "🤍";
            }
        }
    })
    .catch(error => console.error('Error:', error));
}