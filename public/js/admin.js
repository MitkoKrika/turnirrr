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
    //if (!token) window.location.href = '/login.html';
    if (token && dashboard) {
        showDashboard();
    }

    if (window.location.hash === '#news') {
        loadNews();
    }

    // Навигация
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href');
            
            if (section === '#logout') {
                // Handle logout
                return;
            }
    
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(s => {
                s.classList.remove('active');
            });
            
            const activeSection = document.querySelector(section);
            if (activeSection) {
                activeSection.classList.add('active');
                
                // Load data when specific sections are clicked
                if (section === '#news') {
                    loadNews();
                } else if (section === '#tournaments') {
                    loadTournaments();
                }
                // Add other sections as needed
            }
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
        initNavigation();
        initModals();
        initFilters();
        loadDashboardStats();
        loadTournaments();
        loadTeams();
        loadRegistrations();
        loadNews();
        loadUsers();
    }

    // Зареждане на статистики за таблото
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`/api/admin${endpoint}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    async function loadDashboardStats() {
        try {
            const stats = await fetchData('/stats');
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const stats = await response.json();
                document.getElementById('active-tournaments').textContent = stats.activeTournaments;
                document.getElementById('registered-teams').textContent = stats.totalTeams;
                document.getElementById('registered-teams').textContent = stats.registeredTeams;
                document.getElementById('new-registrations').textContent = stats.newRegistrations;
                document.getElementById('new-registrations').textContent = stats.pendingRegistrations;
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
                const tournaments = await fetchData('/tournaments');
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
        const tbody = document.getElementById('tournaments-table');
        tbody.innerHTML = tournaments.map(t => `
            <tr>
                <td>${t._id}</td>
                <td>${t.name}</td>
                <td>${new Date(t.date).toLocaleDateString('bg-BG')}</td>
                <td><span class="status-badge ${t.status}">${t.status}</span></td>
                <td>${t.teams.length}</td>
                <td>
                    <button class="btn btn-edit" onclick="openEditTournament('${t._id}')">✏️</button>
                    <button class="btn btn-delete" onclick="deleteTournament('${t._id}')">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // Зареждане на отбори
    async function loadTeams() {
        const teams = await fetchData('/teams');
        renderTeams(teams);
    }

    // Рендиране на отбори
    function renderTeams(teams) {
        const tbody = document.getElementById('teams-table');
        tbody.innerHTML = teams.map(t => `
            <tr>
                <td>${t._id}</td>
                <td>${t.name}</td>
                <td>${t.captain}</td>
                <td>${t.players.join(', ')}</td>
                <td><span class="status-badge ${t.status}">${t.status}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="openEditTeam('${t._id}')">✏️</button>
                    <button class="btn btn-delete" onclick="deleteTeam('${t._id}')">🗑️</button>
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
            const response = await fetch('/api/news/admin', {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Check if we got valid data
            if (result && Array.isArray(result.data)) {
                renderNews(result.data);
            } else {
                console.error('Invalid data format:', result);
                document.getElementById('news-table').innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">Няма налични новини</td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error('Error loading news:', error);
            document.getElementById('news-table').innerHTML = `
                <tr>
                    <td colspan="5" class="text-center error">Грешка при зареждане на новините</td>
                </tr>
            `;
        }
    }

    // Рендиране на новини
    function renderNews(newsItems) {
        const tbody = document.getElementById('news-table');
        
        if (!newsItems || newsItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Няма налични новини</td>
                </tr>
            `;
            return;
        }
    
        tbody.innerHTML = newsItems.map(news => `
            <tr>
                <td>${news._id}</td>
                <td>${news.title}</td>
                <td>${formatDate(news.createdAt)}</td>
                <td>${news.author || 'Администратор'}</td>
                <td class="actions">
                    <button class="btn btn-edit" onclick="editNews('${news._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="deleteNews('${news._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('bg-BG', options);
    }

    async function saveNews(newsData) {
        try {
            const response = await fetch('/api/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newsData)
            });
    
            if (response.ok) {
                // Refresh the news list after successful save
                await loadNews();
                return true;
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save news');
            }
        } catch (error) {
            console.error('Error saving news:', error);
            alert(`Грешка при запазване: ${error.message}`);
            return false;
        }
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

    function initNavigation() {
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.querySelector(link.getAttribute('href')).classList.add('active');
            });
        });
    }

    function initModals() {
        document.getElementById('add-tournament').addEventListener('click', () => {
            document.getElementById('tournament-form').reset();
            document.getElementById('modal-title').textContent = 'Добави нов турнир';
            document.getElementById('tournament-modal').style.display = 'block';
        });
    
        document.getElementById('add-news').addEventListener('click', () => {
            document.getElementById('news-form').reset();
            document.getElementById('news-modal-title').textContent = 'Добави новина';
            document.getElementById('news-modal').style.display = 'block';
        });

        document.getElementById('news-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newsData = {
                title: document.getElementById('news-title').value,
                content: document.getElementById('news-content').value,
                imageurl: document.getElementById('news-image').value || '/api/placeholder/400/250'
            };
            
            const id = document.getElementById('news-id').value;
            const isEdit = !!id;
            
            try {
                const response = await fetch(isEdit ? `/api/news/${id}` : '/api/news', {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(newsData)
                });
        
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to save news');
                }
        
                // Close modal and refresh news list
                document.getElementById('news-modal').style.display = 'none';
                document.getElementById('news-form').reset();
                await loadNews();
                
                alert(`Новината е ${isEdit ? 'редактирана' : 'добавена'} успешно!`);
            } catch (error) {
                console.error('Грешка при запазване:', error);
                alert(`Грешка при запазване: ${error.message}`);
            }
        });
    
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            });
        });
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
            
            const newsData = {
                title: document.getElementById('news-title').value,
                content: document.getElementById('news-content').value,
                imageurl: document.getElementById('news-image').value || '/api/placeholder/400/250'
            };
            
            const id = document.getElementById('news-id').value;
            const url = id ? `/api/news/${id}` : '/api/news';
            const method = id ? 'PUT' : 'POST';
    
            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newsData)
                });
    
                if (response.ok) {
                    newsModal.style.display = 'none';
                    loadNews(); // Refresh news list in admin
                    alert('Новината е запазена успешно!');
                } else {
                    const errorData = await response.json();
                    alert('Грешка при запазване: ' + (errorData.message || 'Неизвестна грешка'));
                }
            } catch (error) {
                console.error('Грешка при запазване:', error);
                alert('Грешка при връзка със сървъра');
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
            const response = await fetch(`/api/news/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const news = await response.json();
            
            // Make sure the response contains the expected data
            if (!news || !news._id) {
                throw new Error('Invalid news data received');
            }
    
            // Populate the edit form
            document.getElementById('news-modal-title').textContent = 'Редактиране на новина';
            document.getElementById('news-id').value = news._id;
            document.getElementById('news-title').value = news.title;
            document.getElementById('news-content').value = news.content;
            document.getElementById('news-image').value = news.imageurl || '';
            
            // Show the modal
            document.getElementById('news-modal').style.display = 'block';
        } catch (error) {
            console.error('Грешка при зареждане на новината:', error);
            alert(`Грешка при зареждане на новината: ${error.message}`);
        }
    };

    // Изтриване на новина
    window.deleteNews = async (id) => {
        if (confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
            try {
                const response = await fetch(`/api/news/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    loadNews();
                    alert('Новината е изтрита успешно!');
                } else {
                    alert('Грешка при изтриване');
                }
            } catch (error) {
                console.error('Грешка при изтриване:', error);
                alert('Грешка при изтриване на новината');
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