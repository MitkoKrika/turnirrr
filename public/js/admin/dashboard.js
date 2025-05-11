import { getStats } from './services/dataService.js';

export function showDashboard() {
    const dashboard = document.getElementById('dashboard');
    const sections = document.querySelectorAll('.admin-section');

    sections.forEach(section => section.style.display = 'none');
    if (dashboard) dashboard.style.display = 'block';

    loadDashboardStats();
}

export async function loadDashboardStats() {
    try {
        const stats = await getStats();
        updateStatsUI(stats);
    } catch (error) {
        console.error('Грешка при зареждане на статистики:', error);
    }
}

function updateStatsUI(stats) {
    const tournamentCount = document.getElementById('tournament-count');
    const teamCount = document.getElementById('team-count');
    const userCount = document.getElementById('user-count');
    const registrationCount = document.getElementById('registration-count');

    if (tournamentCount) tournamentCount.textContent = stats.tournaments;
    if (teamCount) teamCount.textContent = stats.teams;
    if (userCount) userCount.textContent = stats.users;
    if (registrationCount) registrationCount.textContent = stats.registrations;
}