const db = {
    tournaments: [
        {
            id: 1,
            name: "TikTok CS 1.6 Турнир - BG",
            date: "2025-05-03T14:00:00",
            location: "Онлайн",
            game: "Counter-Strike 1.6",
            teams: 2,
            prizePool: 7500,
            status: "upcoming"
        }
    ],
    teams: [
        {
            id: 1,
            name: "🎮│Тигри",
            logo: "/api/placeholder/150/150",
            players: [
                { id: 1, nickname: "TigerKing", role: "IGL", steamId: "STEAM_1:1:123456" },
                { id: 2, nickname: "TigerAim", role: "Entry", steamId: "STEAM_1:1:123457" }
            ],
            socials: {
                tiktok: "@tigergaming",
                youtube: "tigergamingbg"
            }
        }
    ],
    registrations: []
};

export const API = {
    getTournaments: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    data: db.tournaments
                });
            }, 500);
        });
    },

    getTournament: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tournament = db.tournaments.find(t => t.id === parseInt(id));
                if (tournament) {
                    resolve({ status: 200, data: tournament });
                } else {
                    reject({ status: 404, message: "Турнирът не е намерен" });
                }
            }, 500);
        });
    },

    getTeams: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    data: db.teams
                });
            }, 500);
        });
    },

    registerTeam: (teamData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newTeam = {
                    id: db.teams.length + 1,
                    ...teamData
                };
                db.teams.push(newTeam);
                resolve({ status: 201, data: newTeam });
            }, 800);
        });
    },

    submitContact: (contactData) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 200,
                    message: "Съобщението е изпратено успешно!"
                });
            }, 500);
        });
    }
};

export async function loadLatestNews() {
    const res = await fetch('/api/news/latest');
    if (!res.ok) throw new Error('Грешка при зареждане на новини');

    const news = await res.json();
    const container = document.getElementById('news-section');

    if (!container) return;

    container.innerHTML = news.map(item => `
        <article class="news-item">
            <h3>${item.title}</h3>
            <p class="news-date">${new Date(item.date).toLocaleDateString()}</p>
            <p>${item.content}</p>
        </article>
    `).join('');
}