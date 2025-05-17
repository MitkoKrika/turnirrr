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
    const container = document.getElementById('news-section');
    const res = await fetch('/api/news/latest');
    if (!res.ok) throw new Error('Грешка при зареждане на новини');

    const response = await res.json();
    const news = response.data;

    if (!container || !Array.isArray(news)) return;

    container.innerHTML = news.map(item => `
        <article class="news-item">
            <div class="news-img">
                <img src="${item.imageurl}" alt="${item.title}">
            </div>
            <div class="news-content">
                <span class="date">${new Date(item.createdAt).toLocaleDateString('bg-BG')}</span>
                <h3>${item.title}</h3>
                <p>${item.content.substring(0, 100)}...</p>
                <a href="news.html?id=${item._id}" class="read-more">Прочети повече</a>
            </div>
        </article>
    `).join('');
}

export async function loadNewsById() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    const titleEl = document.getElementById('news-data-title');
    const contentEl = document.getElementById('news-data-content');
    const dateEl = document.getElementById('news-date-createdAt');
    const imageContainer = document.querySelector('.news-data-imageurl');
    const errorMessage = document.getElementById('error-message');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!newsId) {
        errorMessage.textContent = 'Липсва ID на новината.';
        errorMessage.style.display = 'block';
        return;
    }

    loadingSpinner.style.display = 'flex';

    try {
        const res = await fetch(`/api/news/${newsId}`);
        if (!res.ok) throw new Error('Новината не е намерена.');

        const response = await res.json();
        const news = response.data;

        titleEl.textContent = news.title || 'Без заглавие';
        contentEl.textContent = news.content || 'Няма съдържание.';
        dateEl.textContent = `Дата: ${new Date(news.createdAt).toLocaleDateString('bg-BG')}`;
        imageContainer.innerHTML = `<img src="${news.imageurl || '/api/placeholder/800/400'}" alt="${news.title}">`;

    } catch (err) {
        errorMessage.textContent = 'Грешка при зареждането на новината: ' + err.message;
        errorMessage.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

