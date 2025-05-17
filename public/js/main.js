import { setupMobileNav } from './nav.js';
import { setupCountdown } from './countdown.js';
import { initNewsletterForm } from './forms/newsletterForm.js';
import { initRegistrationForm } from './forms/registrationForm.js';
import { initContactForm } from './forms/contactForm.js';
import { setupScrollAnimations, setupFaqToggles, setupCollapsibles } from './animations.js';
import { loadTournamentDetails } from './tournament.js';
import { loadTeams } from './teams.js';
import { loadNews, loadLatestNews } from './api/index.js';

document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupCountdown();
    initNewsletterForm();
    initRegistrationForm();
    initContactForm();
    setupScrollAnimations();
    setupFaqToggles();
    setupCollapsibles();
    loadNews();
    loadLatestNews();
    loadTeams();
    loadTournamentDetails();
});