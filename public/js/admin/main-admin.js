import { checkAuth } from '../auth.js';
import { checkAdminAuth } from './auth.js';
import { setupAdminNavigation } from './navigation.js';
import { showDashboard } from './dashboard.js';
import { initTournamentAdmin } from './tournaments.js';
import { initTeamAdmin } from './teams.js';
import { initRegistrationAdmin } from './registrations.js';
import { initModals } from './modals.js';
import { setupListFilters } from './filters.js';
import { initSettingsSection } from './settings.js';
import { initNewsAdmin } from './news.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth('admin'); // Проверка на токена и евентуално пренасочване към admin.html
    checkAdminAuth();               // Проверка на токена и евентуално показване на dashboard
    setupAdminNavigation();         // Активиране на навигацията между секции
    initModals();                   // Управление на модалните прозорци
    setupListFilters();             // Активиране на търсене/филтриране в списъци
    initSettingsSection();          // Инициализация на формата с настройки
    initNewsAdmin();               // Инициализация на секцията с новини
    // Инициализация на секции
    initTournamentAdmin();
    initTeamAdmin();
    initRegistrationAdmin();
    // Начално показване на dashboard
    showDashboard();
});