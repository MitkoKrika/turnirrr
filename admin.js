document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.getElementById('dashboard');
    const tournamentsSection = document.getElementById('tournaments');
    const teamsSection = document.getElementById('teams');
    const registrationsSection = document.getElementById('registrations');
    const newsSection = document.getElementById('news');
    const settingsSection = document.getElementById('settings');
    const addTournamentBtn = document.getElementById('add-tournament');
    const addNewsBtn = document.getElementById('add-news');
    const addUserBtn = document.getElementById('add-user');
    const tournamentModal = document.getElementById('tournament-modal');
    const teamModal = document.getElementById('team-modal');
    const newsModal = document.getElementById('news-modal');
    const userModal = document.getElementById('user-modal');
    const tournamentForm = document.getElementById('tournament-form');
    const teamForm = document.getElementById('team-form');
    const newsForm = document.getElementById('news-form');
    const userForm = document.getElementById('user-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const navLinks = document.querySelectorAll('.admin-nav a');
    const tabButtons = document.querySelectorAll('.settings-tabs .tab-btn');
    const teamFilter = document.getElementById('team-filter');
    const registrationFilter = document.getElementById('registration-filter');
    const searchInput = document.getElementById('admin-search');

    // Проверка за токен
    const token = localStorage.getItem('token');
    if (token && dashboard) {
        showDashboard();
    }

    // Навигация
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.getAttribute('href') === '#logout') {
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                return;
            }
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            document.querySelector(link.getAttribute('href')).classList.add('active');
        });
    });

    // Табове в Настройки
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.querySelector(`#${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Показване на таблото
    function showDashboard() {
        dashboard.classList.add('active');
        loadDashboardStats();
        loadTournaments();
        loadTeams();
        loadRegistrations();
        loadNews();
        loadUsers();
    }

    // Зареждане на статистики за таблото
    async function loadDashboardStats() {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const stats = await response.json();
                document.getElementById('active-tournaments').textContent = stats.activeTournaments;
                document.getElementById('registered-teams').textContent = stats.registeredTeams;
                document.getElementById('new-registrations').textContent = stats.newRegistrations;
                document.getElementById('new-messages').textContent = stats.newMessages;

                // Пример за последна активност
                const activityList = document.getElementById('activity-list');
                activityList.innerHTML = `
                    <div class="activity-item">Нов турнир добавен: CS:GO Summer Cup</div>
                    <div class="activity-item">Отбор Team Alpha регистриран</div>
                    <div class="activity-item">Новина публикувана: Турнир 2025</div>
                `;
            }
        } catch (error) {
            console.error('Грешка при зареждане на статистиките:', error);
        }
    }

    // Зареждане на турнири
    async function loadTournaments() {
        try {
            const response = await fetch('/api/admin/tournaments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const tournaments = await response.json();
                renderTournaments(tournaments);
            } else {
                alert('Грешка при зареждане на турнирите');
            }
        } catch (error) {
            console.error('Грешка при зареждане на турнирите:', error);
        }
    }

    // Рендиране на турнири
    function renderTournaments(tournaments) {
        const table = tournamentsSection.querySelector('#tournaments-table');
        const searchTerm = searchInput.value.toLowerCase();
        table.innerHTML = tournaments
            .filter(t => t.name.toLowerCase().includes(searchTerm))
            .map(t => `
                <tr>
                    <td>${t._id}</td>
                    <td>${t.name}</td>
                    <td>${new Date(t.date).toLocaleDateString('bg-BG')}</td>
                    <td>${t.status || 'Активен'}</td>
                    <td>${t.teams}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editTournament('${t._id}')">Редактирай</button>
                        <button class="btn btn-delete" onclick="deleteTournament('${t._id}')">Изтрий</button>
                    </td>
                </tr>
            `).join('');
    }

    // Зареждане на отбори
    async function loadTeams() {
        try {
            const response = await fetch('/api/admin/teams', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const teams = await response.json();
                renderTeams(teams);
            }
        } catch (error) {
            console.error('Грешка при зареждане на отборите:', error);
        }
    }

    // Рендиране на отбори
    function renderTeams(teams) {
        const table = teamsSection.querySelector('#teams-table');
        const filter = teamFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        let filteredTeams = teams;
        if (filter !== 'all') {
            filteredTeams = teams.filter(t => t.status === filter);
        }
        filteredTeams = filteredTeams.filter(t => t.name.toLowerCase().includes(searchTerm));
        table.innerHTML = filteredTeams.map(t => `
            <tr>
                <td>${t._id}</td>
                <td>${t.name}</td>
                <td>${t.captain}</td>
                <td>${t.players?.length || 0}</td>
                <td>${t.status || 'Чакащ'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editTeam('${t._id}')">Редактирай</button>
                    <button class="btn btn-delete" onclick="deleteTeam('${t._id}')">Изтрий</button>
                </td>
            </tr>
        `).join('');
    }

    // Зареждане на регистрации
    async function loadRegistrations() {
        try {
            const response = await fetch('/api/admin/registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const registrations = await response.json();
                renderRegistrations(registrations);
            }
        } catch (error) {
            console.error('Грешка при зареждане на регистрациите:', error);
        }
    }

    // Рендиране на регистрации
    function renderRegistrations(registrations) {
        const filter = registrationFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        let filteredRegistrations = registrations;
        if (filter !== 'all') {
            filteredRegistrations = registrations.filter(r => r.status === filter);
        }
        filteredRegistrations = filteredRegistrations.filter(r => r.teamName.toLowerCase().includes(searchTerm));

        const pending = filteredRegistrations.filter(r => r.status === 'pending');
        const approved = filteredRegistrations.filter(r => r.status === 'approved');

        registrationsSection.querySelector('#pending-count').textContent = pending.length;
        registrationsSection.querySelector('#approved-count').textContent = approved.length;

        registrationsSection.querySelector('#pending-registrations').innerHTML = pending.map(r => `
            <div class="registration-item">
                <h4>${r.teamName}</h4>
                <p>Капитан: ${r.captain}</p>
                <p>Турнир: ${r.tournamentName}</p>
                <div class="registration-actions">
                    <button class="btn btn-approve" onclick="approveRegistration('${r._id}')">Одобри</button>
                    <button class="btn btn-reject" onclick="rejectRegistration('${r._id}')">Отхвърли</button>
                </div>
            </div>
        `).join('');

        registrationsSection.querySelector('#approved-registrations').innerHTML = approved.map(r => `
            <div class="registration-item">
                <h4>${r.teamName}</h4>
                <p>Капитан: ${r.captain}</p>
                <p>Турнир: ${r.tournamentName}</p>
                <div class="registration-actions">
                    <button class="btn btn-delete" onclick="deleteRegistration('${r._id}')">Изтрий</button>
                </div>
            </div>
        `).join('');
    }

    // Зареждане на новини
    async function loadNews() {
        try {
            const response = await fetch('/api/admin/news', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const news = await response.json();
                renderNews(news);
            }
        } catch (error) {
            console.error('Грешка при зареждане на новините:', error);
        }
    }

    // Рендиране на новини
    function renderNews(news) {
        const table = newsSection.querySelector('#news-table');
        const searchTerm = searchInput.value.toLowerCase();
        table.innerHTML = news
            .filter(n => n.title.toLowerCase().includes(searchTerm))
            .map(n => `
                <tr>
                    <td>${n._id}</td>
                    <td>${n.title}</td>
                    <td>${new Date(n.date).toLocaleDateString('bg-BG')}</td>
                    <td>${n.author}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editNews('${n._id}')">Редактирай</button>
                        <button class="btn btn-delete" onclick="deleteNews('${n._id}')">Изтрий</button>
                    </td>
                </tr>
            `).join('');
    }

    // Зареждане на потребители
    async function loadUsers() {
        try {
            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const users = await response.json();
                renderUsers(users);
            }
        } catch (error) {
            console.error('Грешка при зареждане на потребителите:', error);
        }
    }

    // Рендиране на потребители
    function renderUsers(users) {
        const table = document.querySelector('#users-table');
        const searchTerm = searchInput.value.toLowerCase();
        table.innerHTML = users
            .filter(u => u.username.toLowerCase().includes(searchTerm))
            .map(u => `
                <tr>
                    <td>${u._id}</td>
                    <td>${u.username}</td>
                    <td>${u.role}</td>
                    <td>${u.status || 'Активен'}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editUser('${u._id}')">Редактирай</button>
                        <button class="btn btn-delete" onclick="deleteUser('${u._id}')">Изтрий</button>
                    </td>
                </tr>
            `).join('');
    }

    // Търсене
    searchInput.addEventListener('input', () => {
        loadTournaments();
        loadTeams();
        loadRegistrations();
        loadNews();
        loadUsers();
    });

    // Филтри
    teamFilter.addEventListener('change', loadTeams);
    registrationFilter.addEventListener('change', loadRegistrations);

    // Отваряне на модали
    if (addTournamentBtn) {
        addTournamentBtn.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Добавяне на нов турнир';
            tournamentForm.reset();
            document.getElementById('tournament-id').value = '';
            tournamentModal.style.display = 'block';
        });
    }

    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', () => {
            document.getElementById('news-modal-title').textContent = 'Добавяне на новина';
            newsForm.reset();
            document.getElementById('news-id').value = '';
            newsModal.style.display = 'block';
        });
    }

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('user-modal-title').textContent = 'Добавяне на потребител';
            userForm.reset();
            document.getElementById('user-id').value = '';
            userModal.style.display = 'block';
        });
    }

    // Затваряне на модали
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tournamentModal.style.display = 'none';
            teamModal.style.display = 'none';
            newsModal.style.display = 'none';
            userModal.style.display = 'none';
        });
    });

    // Запазване на турнир
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tournament = {
                name: document.getElementById('tournament-name').value,
                date: document.getElementById('tournament-date').value,
                location: document.getElementById('tournament-location').value,
                game: document.getElementById('tournament-game').value,
                teams: parseInt(document.getElementById('tournament-teams').value),
                prize: parseInt(document.getElementById('tournament-prize').value),
                description: document.getElementById('tournament-desc').value
            };
            const id = document.getElementById('tournament-id').value;

            try {
                const url = id ? `/api/admin/tournaments/${id}` : '/api/admin/tournaments';
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(tournament)
                });

                if (response.ok) {
                    tournamentModal.style.display = 'none';
                    loadTournaments();
                    loadDashboardStats();
                } else {
                    alert('Грешка при запазване на турнира');
                }
            } catch (error) {
                console.error('Грешка при запазване:', error);
            }
        });
    }

    // Запазване на отбор
    if (teamForm) {
        teamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const team = {
                name: document.getElementById('team-name').value,
                captain: document.getElementById('team-captain').value,
                players: document.getElementById('team-players').value.split(',').map(p => p.trim()).filter(p => p),
                status: document.getElementById('team-status').value
            };
            const id = document.getElementById('team-id').value;

            try {
                const url = id ? `/api/admin/teams/${id}` : '/api/admin/teams';
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(team)
                });

                if (response.ok) {
                    teamModal.style.display = 'none';
                    loadTeams();
                    loadDashboardStats();
                } else {
                    alert('Грешка при запазване на отбора');
                }
            } catch (error) {
                console.error('Грешка при запазване:', error);
            }
        });
    }

    // Запазване на новина
    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const news = {
                title: document.getElementById('news-title').value,
                date: document.getElementById('news-date').value,
                content: document.getElementById('news-content').value,
                image: document.getElementById('news-image').value,
                author: 'Администратор'
            };
            const id = document.getElementById('news-id').value;

            try {
                const url = id ? `/api/admin/news/${id}` : '/api/admin/news';
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(news)
                });

                if (response.ok) {
                    newsModal.style.display = 'none';
                    loadNews();
                } else {
                    alert('Грешка при запазване на новината');
                }
            } catch (error) {
                console.error('Грешка при запазване:', error);
            }
        });
    }

    // Запазване на потребител
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = {
                username: document.getElementById('user-username').value,
                password: document.getElementById('user-password').value,
                role: document.getElementById('user-role').value
            };
            const id = document.getElementById('user-id').value;

            try {
                const url = id ? `/api/admin/users/${id}` : '/api/admin/users';
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(user)
                });

                if (response.ok) {
                    userModal.style.display = 'none';
                    loadUsers();
                } else {
                    alert('Грешка при запазване на потребителя');
                }
            } catch (error) {
                console.error('Грешка при запазване:', error);
            }
        });
    }

    // Редактиране на турнир
    window.editTournament = async (id) => {
        try {
            const response = await fetch(`/api/admin/tournaments/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const tournament = await response.json();
                document.getElementById('modal-title').textContent = 'Редактиране на турнир';
                document.getElementById('tournament-id').value = tournament._id;
                document.getElementById('tournament-name').value = tournament.name;
                document.getElementById('tournament-date').value = new Date(tournament.date).toISOString().slice(0, 16);
                document.getElementById('tournament-location').value = tournament.location;
                document.getElementById('tournament-game').value = tournament.game;
                document.getElementById('tournament-teams').value = tournament.teams;
                document.getElementById('tournament-prize').value = tournament.prize;
                document.getElementById('tournament-desc').value = tournament.description;
                tournamentModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Грешка при зареждане на турнира:', error);
        }
    };

    // Изтриване на турнир
    window.deleteTournament = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете този турнир?')) {
            try {
                const response = await fetch(`/api/admin/tournaments/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    loadTournaments();
                    loadDashboardStats();
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
            }
        }
    };

    // Редактиране на отбор
    window.editTeam = async (id) => {
        try {
            const response = await fetch(`/api/admin/teams/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const team = await response.json();
                document.getElementById('team-modal-title').textContent = 'Редактиране на отбор';
                document.getElementById('team-id').value = team._id;
                document.getElementById('team-name').value = team.name;
                document.getElementById('team-captain').value = team.captain;
                document.getElementById('team-players').value = team.players.join(', ');
                document.getElementById('team-status').value = team.status;
                teamModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Грешка при зареждане на отбора:', error);
        }
    };

    // Изтриване на отбор
    window.deleteTeam = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете този отбор?')) {
            try {
                const response = await fetch(`/api/admin/teams/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    loadTeams();
                    loadDashboardStats();
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
            }
        }
    };

    // Одобряване на регистрация
    window.approveRegistration = async (id) => {
        try {
            const response = await fetch(`/api/admin/registrations/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                loadRegistrations();
                loadDashboardStats();
            } else {
                alert('Грешка при одобряване');
            }
        } catch (error) {
            console.error('Грешка при одобряване:', error);
        }
    };

    // Отхвърляне на регистрация
    window.rejectRegistration = async (id) => {
        try {
            const response = await fetch(`/api/admin/registrations/${id}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                loadRegistrations();
                loadDashboardStats();
            } else {
                alert('Грешка при отхвърляне');
            }
        } catch (error) {
            console.error('Грешка при отхвърляне:', error);
        }
    };

    // Изтриване на регистрация
    window.deleteRegistration = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете тази регистрация?')) {
            try {
                const response = await fetch(`/api/admin/registrations/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    loadRegistrations();
                    loadDashboardStats();
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
            }
        }
    };

    // Редактиране на новина
    window.editNews = async (id) => {
        try {
            const response = await fetch(`/api/admin/news/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const news = await response.json();
                document.getElementById('news-modal-title').textContent = 'Редактиране на новина';
                document.getElementById('news-id').value = news._id;
                document.getElementById('news-title').value = news.title;
                document.getElementById('news-date').value = new Date(news.date).toISOString().slice(0, 10);
                document.getElementById('news-content').value = news.content;
                document.getElementById('news-image').value = news.image;
                newsModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Грешка при зареждане на новината:', error);
        }
    };

    // Изтриване на новина
    window.deleteNews = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
            try {
                const response = await fetch(`/api/admin/news/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    loadNews();
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
            }
        }
    };

    // Редактиране на потребител
    window.editUser = async (id) => {
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const user = await response.json();
                document.getElementById('user-modal-title').textContent = 'Редактиране на потребител';
                document.getElementById('user-id').value = user._id;
                document.getElementById('user-username').value = user.username;
                document.getElementById('user-password').value = '';
                document.getElementById('user-role').value = user.role;
                userModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Грешка при зареждане на потребителя:', error);
        }
    };

    // Изтриване на потребител
    window.deleteUser = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
            try {
                const response = await fetch(`/api/admin/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    loadUsers();
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
            }
        }
    };

    // Настройки
    document.getElementById('general-settings')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Общите настройки са запазени (симулация)');
    });

    document.getElementById('email-settings')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Имейл настройките са запазени (симулация)');
    });

    document.getElementById('security-settings')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Настройките за сигурност са запазени (симулация)');
    });
});