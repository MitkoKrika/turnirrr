import { validateEmail, showError, clearError } from '../utils.js';

export function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        let isValid = true;

        if (name === '') {
            showError('contact-name', 'Моля, въведете вашето име.');
            isValid = false;
        } else {
            clearError('contact-name');
        }

        if (!validateEmail(email)) {
            showError('contact-email', 'Моля, въведете валиден имейл адрес.');
            isValid = false;
        } else {
            clearError('contact-email');
        }

        if (subject === '') {
            showError('contact-subject', 'Моля, въведете тема на съобщението.');
            isValid = false;
        } else {
            clearError('contact-subject');
        }

        if (message === '') {
            showError('contact-message', 'Моля, въведете вашето съобщение.');
            isValid = false;
        } else {
            clearError('contact-message');
        }

        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<p>Вашето съобщение е изпратено успешно! Ще се свържем с вас скоро.</p>';

            contactForm.parentNode.replaceChild(successMessage, contactForm);
        }
    });
}