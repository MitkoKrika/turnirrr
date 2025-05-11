import { formatNumber } from './utils.js';

export function setupCountdown(tournamentDate = new Date('May 3, 2025 14:00:00').getTime()) {
    const timerElements = {
        days: document.getElementById('t-days') || document.getElementById('days'),
        hours: document.getElementById('t-hours') || document.getElementById('hours'),
        minutes: document.getElementById('t-minutes') || document.getElementById('minutes'),
        seconds: document.getElementById('t-seconds') || document.getElementById('seconds')
    };

    if (!timerElements.days || !timerElements.hours || !timerElements.minutes || !timerElements.seconds) {
        console.error('Countdown timer elements not found');
        return;
    }

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = tournamentDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElements.days.textContent = formatNumber(days);
        timerElements.hours.textContent = formatNumber(hours);
        timerElements.minutes.textContent = formatNumber(minutes);
        timerElements.seconds.textContent = formatNumber(seconds);

        if (distance < 0) {
            clearInterval(countdownTimer);
            Object.values(timerElements).forEach(el => el.textContent = '00');
            const countdownElement = document.querySelector('.countdown-timer');
            if (countdownElement) {
                countdownElement.innerHTML = '<p class="tournament-started">Турнирът вече е започнал!</p>';
            }
        }
    }, 1000);
}