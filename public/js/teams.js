import { API } from './api/index.js';

export async function loadTeams() {
    const teamsContainer = document.querySelector('.teams-container');
    if (!teamsContainer) return;

    try {
        const response = await API.getTeams();
        const teams = response.data;

        teamsContainer.innerHTML = teams.map(team => `
            <div class="team">
                <div class="team-header">
                    <div class="team-logo">
                        <img src="${team.logo}" alt="${team.name}">
                    </div>
                    <div class="team-info">
                        <h3>${team.name}</h3>
                        <div class="team-meta">
                            <span><i class="fas fa-users"></i> ${team.players.length} играчи</span>
                            <span><i class="fas fa-globe"></i> България</span>
                        </div>
                        <div class="team-social">
                            ${team.socials.tiktok ? `<a href="#"><i class="fab fa-tiktok"></i></a>` : ''}
                            ${team.socials.youtube ? `<a href="#"><i class="fab fa-youtube"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="team-players">
                    <h4>Играчи</h4>
                    <div class="players-grid">
                        ${team.players.map(player => `
                            <div class="player">
                                <div class="player-img">
                                    <img src="/api/placeholder/100/100" alt="${player.nickname}">
                                </div>
                                <div class="player-info">
                                    <h5>${player.nickname}</h5>
                                    <span class="player-role">${player.role}</span>
                                    <div class="player-stats">
                                        <span><i class="fas fa-crosshairs"></i> ${player.steamId}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Грешка при зареждане на отборите:', error);
    }
}