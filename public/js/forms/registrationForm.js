import { validateEmail, validatePhone, showError, clearError } from '../utils.js';

export function initRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');

    if (!registrationForm) return;

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const teamName = document.getElementById('team-name').value.trim();
        const captainName = document.getElementById('captain-name').value.trim();
        const captainEmail = document.getElementById('captain-email').value.trim();
        const captainPhone = document.getElementById('captain-phone').value.trim();
        const teamMembers = document.getElementById('team-members').value.trim();
        const agreeTerms = document.getElementById('agree-terms');

        let isValid = true;

        if (teamName === '') {
            showError('team-name', 'Моля, въведете име на отбора.');
            isValid = false;
        } else {
            clearError('team-name');
        }

        if (captainName === '') {
            showError('captain-name', 'Моля, въведете име на капитана.');
            isValid = false;
        } else {
            clearError('captain-name');
        }

        if (!validateEmail(captainEmail)) {
            showError('captain-email', 'Моля, въведете валиден имейл адрес.');
            isValid = false;
        } else {
            clearError('captain-email');
        }

        if (captainPhone === '' || !validatePhone(captainPhone)) {
            showError('captain-phone', 'Моля, въведете валиден телефонен номер.');
            isValid = false;
        } else {
            clearError('captain-phone');
        }

        if (teamMembers === '') {
            showError('team-members', 'Моля, въведете имената на всички членове на отбора.');
            isValid = false;
        } else {
            clearError('team-members');
        }

        if (agreeTerms && !agreeTerms.checked) {
            showError('agree-terms', 'Трябва да се съгласите с условията за участие.');
            isValid = false;
        } else if (agreeTerms) {
            clearError('agree-terms');
        }

        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<p>Вашата регистрация е изпратена успешно! Ще се свържем с вас скоро.</p>';

            registrationForm.parentNode.replaceChild(successMessage, registrationForm);
        }
    });
}