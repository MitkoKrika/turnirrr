import { getAllRegistrations, approveRegistration, rejectRegistration, deleteRegistration } from './services/registrationService.js';

export function initRegistrationAdmin() {
    loadRegistrations();

    const container = document.getElementById('registration-list');
    if (container) {
        container.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains('approve')) {
                await approveRegistration(id);
                loadRegistrations();
            }

            if (e.target.classList.contains('reject')) {
                await rejectRegistration(id);
                loadRegistrations();
            }

            if (e.target.classList.contains('delete')) {
                if (confirm('Сигурен ли си, че искаш да изтриеш регистрацията?')) {
                    await deleteRegistration(id);
                    loadRegistrations();
                }
            }
        });
    }
}

async function loadRegistrations() {
    const container = document.getElementById('registration-list');
    if (!container) return;

    try {
        const registrations = await getAllRegistrations();
        container.innerHTML = registrations.map(reg => `
            <div class="admin-item">
                <strong>${reg.teamName}</strong> - ${reg.captainName} (${reg.email})
                <div class="actions">
                    <button class="approve" data-id="${reg.id}">Одобри</button>
                    <button class="reject" data-id="${reg.id}">Откажи</button>
                    <button class="delete" data-id="${reg.id}">Изтрий</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Грешка при зареждане на регистрации:', err);
    }
}