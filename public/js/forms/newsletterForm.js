export function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.trim();

            if (!validateEmail(email)) {
                showError(form, 'Моля, въведете валиден имейл адрес.');
                return;
            }

            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    form.innerHTML = '<p class="success-message">Благодарим за абонамента!</p>';
                } else {
                    alert('Грешка при абониране. Моля, опитайте отново.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Възникна грешка при изпращане.');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(form, message) {
    const emailInput = form.querySelector('input[type="email"]');
    emailInput.classList.add('error');

    let errorMessage = form.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        emailInput.parentNode.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}