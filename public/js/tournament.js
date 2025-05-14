import { API } from './api/index.js';
import { setupCountdown } from './countdown.js';

export async function loadTournamentDetails() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    if (loading) loading.style.display = 'flex';
    if (errorMessage) errorMessage.style.display = 'none';

    try {
        const response = await API.getTournaments();
        const tournament = response.data[0];

        document.getElementById('tournament-name').textContent = tournament.name;
        document.getElementById('tournament-title').textContent = tournament.name;
        document.getElementById('tournament-date').textContent = new Date(tournament.date).toLocaleDateString('bg-BG');
        document.getElementById('tournament-time').textContent = new Date(tournament.date).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournament-location').textContent = tournament.location;
        document.getElementById('tournament-game').textContent = tournament.game;
        document.getElementById('tournament-description').textContent = `Турнирът ${tournament.name} ще събере топ тиктокъри гейминг стриймъри за вълнуващи мачове в ${tournament.game}.`;
        document.getElementById('tournament-teams').textContent = `${tournament.teams} отбора`;

        setupCountdown(new Date(tournament.date).getTime());

        const scheduleContainer = document.getElementById('tournament-schedule');
        scheduleContainer.innerHTML = `
            <div class="schedule-item">
                <div class="schedule-time">
                    <span class="date">${new Date(tournament.date).toLocaleDateString('bg-BG')}</span>
                    <span class="time">14:00</span>
                </div>
                <div class="schedule-event">
                    <h4>Откриване на турнира</h4>
                    <p>Представяне на отборите и коментаторите</p>
                </div>
            </div>
        `;

        const bracketContainer = document.getElementById('tournament-bracket');
        bracketContainer.innerHTML = `
            <div class="bracket-teams">
                <div class="bracket-team team-a">
                    <div class="team-logo"><img src="/api/placeholder/60/60" alt="Отбор А"></div>
                    <div class="team-name">🎮│Тигри</div>
                    <div class="team-score" id="team-a-score">0</div>
                </div>
                <span class="vs">VS</span>
                <div class="bracket-team team-b">
                    <div class="team-logo"><img src="/api/placeholder/60/60" alt="Отбор Б"></div>
                    <div class="team-name">🎮│Седмици</div>
                    <div class="team-score" id="team-b-score">0</div>
                </div>
            </div>
            <div class="bracket-maps">
                ${['de_dust2', 'de_inferno', 'de_nuke', 'de_train', 'de_mirage'].map((map, i) => `
                    <div class="map-item">
                        <div class="map-name">${map}</div>
                        <div class="map-result">
                            <span id="map${i + 1}-team-a">0</span> : <span id="map${i + 1}-team-b">0</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Error loading tournament details:', error);
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Грешка при зареждане на данните за турнира. Моля, опитайте отново.';
        }

        setupCountdown();
    } finally {
        if (loading) loading.style.display = 'none';
    }
}