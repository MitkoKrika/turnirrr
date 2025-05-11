import { showDashboard } from './dashboard.js';

export function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const dashboard = document.getElementById('dashboard');

    if (token && dashboard) {
        showDashboard();
    } else {
        // Ако искаш да пренасочиш към login:
        // window.location.href = '/login.html';
        console.warn('Няма намерен токен за достъп до админ панел.');
    }
}