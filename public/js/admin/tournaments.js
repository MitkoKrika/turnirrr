import { getAllTournaments, createTournament, deleteTournament } from './services/tournamentService.js';

export function initTournamentAdmin() {
    loadTournaments();

    const createForm = document.getElementById('create-tournament-form');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('tournament-name-input').value;
            const date = document.getElementById('tournament-date-input').value;

            try {
                await createTournament({ name, date });
                loadTournaments();
                createForm.reset();
            } catch (err) {
                console.error('Грешка при създаване на турнир:', err);
            }
        });
    }

    const container = document.getElementById('tournament-list');
    if (container) {
        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-tournament')) {
                const id = e.target.dataset.id;
                if (confirm('Сигурен ли си, че искаш да изтриеш този турнир?')) {
                    await deleteTournament(id);
                    loadTournaments();
                }
            }
        });
    }
}

async function loadTournaments() {
    const container = document.getElementById('tournament-list');
    if (!container) return;

    try {
        const tournaments = await getAllTournaments();
        container.innerHTML = tournaments.map(t => `
            <div class="admin-item">
                <span>${t.name} — ${new Date(t.date).toLocaleDateString()}</span>
                <button class="delete-tournament" data-id="${t.id}">Изтрий</button>
            </div>
        `).join('');
    } catch (err) {
        console.error('Грешка при зареждане на турнири:', err);
    }
}