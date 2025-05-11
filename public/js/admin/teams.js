import { getAllTeams, deleteTeam, createTeam } from './services/teamService.js';

export function initTeamAdmin() {
    loadTeams();

    const createForm = document.getElementById('create-team-form');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('team-name-input').value;
            const logo = document.getElementById('team-logo-input').value;

            try {
                await createTeam({ name, logo });
                loadTeams();
                createForm.reset();
            } catch (err) {
                console.error('Грешка при създаване на отбор:', err);
            }
        });
    }

    const container = document.getElementById('team-list');
    if (container) {
        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-team')) {
                const id = e.target.dataset.id;
                if (confirm('Сигурен ли си, че искаш да изтриеш този отбор?')) {
                    await deleteTeam(id);
                    loadTeams();
                }
            }
        });
    }
}

async function loadTeams() {
    const container = document.getElementById('team-list');
    if (!container) return;

    try {
        const teams = await getAllTeams();
        container.innerHTML = teams.map(team => `
            <div class="admin-item">
                <span><img src="${team.logo}" width="24" height="24"> ${team.name}</span>
                <button class="delete-team" data-id="${team.id}">Изтрий</button>
            </div>
        `).join('');
    } catch (err) {
        console.error('Грешка при зареждане на отборите:', err);
    }
}