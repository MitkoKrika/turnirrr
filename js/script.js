// Главна JavaScript функционалност за CS Турнири

document.addEventListener('DOMContentLoaded', function() {
    // Мобилна навигация
    setupMobileNav();
    
    // Таймер за обратно броене, ако сме на началната страница
    if (document.querySelector('.countdown-timer')) {
        startCountdown();
    }
    
    // Настройка на формата за бюлетин
    setupNewsletterForm();
    
    // Настройка на формата за регистрация, ако сме на страницата за регистрация
    if (document.getElementById('registration-form')) {
        setupRegistrationForm();
    }
    
    // Настройка на формата за контакт, ако сме на страницата за контакти
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    
    // Добавяне на анимации при скролване
    setupScrollAnimations();
});

// Функция за настройка на мобилната навигация
function setupMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Затваряне на менюто при клик върху линк
        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
}

async function loadUpcomingTournaments() {
  try {
    const response = await fetch('/api/tournaments/upcoming');
    if (response.ok) {
      const tournaments = await response.json();
      updateTurnamentInfo(tournaments);
      initCountdownTimer(tournaments.date);
    } else {
      console.log('No upcoming tournaments found');
    }
  } catch (error) {
    console.error('Error loading tournament:', error);
  }
}

function initCountdownTimer(tournamentDate) {
  const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = new Date(tournamentDate).getTime() - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    if (distance < 0) {
      clearInterval(countdown);
      document.querySelector('.countdown-timer').innerHTML = '<div class="tournament-started">Турнирът започна!</div>';
    }
  }, 1000);
}

async function loadLatestNews() {
  try {
    const response = await fetch('/api/news/latest?limit=3');
    if (response.ok) {
      const news = await response.json();
      renderNews(news);
    } 
  } catch (error) {
      console.error('Error loading news:', error);
    }
}

function renderNews(newsItems) {
  const newsGrid = document.querySelector('.news-grid');

  newsGrid.innerHTML = newsItems.map(news => `
    <div class="news-item">
      <div class="news-img">
        <img src="${news.imageurl || 'images/default-news.jpg'}" alt="${news.title}">
      </div>
      <div class="news-content">
        <span class="date">${new Date(news.date).toLocaleDateString('bg-BG')}</span>
        <h3>${news.title}</h3>
        <p>${news.content.substring(0, 100)}${news.content.length > 100 ? '...' : ''}</p>
        <a href="#" class="read-more">Прочети повече</a>
      </div>
    </div>
  `).join('');
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        if (response.ok) {
          alert('Благодарим ви за абонамента!');
          form.reset();
        } else {
          alert('Грешка при абониране. Моля, опитайте отново.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Възникна грешка при изпращане');
      }
    });
  }
}
// Функция за стартиране на таймера за обратно броене
function startCountdown() {
    // Промени тази дата с датата на турнира
    const tournamentDate = new Date('May 3, 2025 14:00:00').getTime();
    
    // Обновяване на таймера на всяка секунда
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = tournamentDate - now;
        
        // Изчисляване на дни, часове, минути и секунди
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Показване на резултата в елементите
        document.getElementById('days').innerHTML = formatNumber(days);
        document.getElementById('hours').innerHTML = formatNumber(hours);
        document.getElementById('minutes').innerHTML = formatNumber(minutes);
        document.getElementById('seconds').innerHTML = formatNumber(seconds);
        
        // Ако обратното броене е приключило
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('days').innerHTML = '00';
            document.getElementById('hours').innerHTML = '00';
            document.getElementById('minutes').innerHTML = '00';
            document.getElementById('seconds').innerHTML = '00';
            
            // Можете да покажете съобщение, че турнирът е започнал
            const countdownElement = document.querySelector('.countdown-timer');
            if (countdownElement) {
                const tournamentStartedElement = document.createElement('div');
                tournamentStartedElement.className = 'tournament-started';
                tournamentStartedElement.innerHTML = '<p>Турнирът вече е започнал!</p>';
                countdownElement.parentNode.replaceChild(tournamentStartedElement, countdownElement);
            }
        }
    }, 1000);
}

// Форматиране на числата за таймера (добавяне на водеща нула за числа под 10)
function formatNumber(number) {
    return number < 10 ? '0' + number : number;
}

// Функция за настройка на формата за бюлетин
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Симулираме изпращане на формата
                this.innerHTML = '<p class="success-message">Благодарим за абонамента!</p>';
                
                // В реална ситуация тук бихте изпратили данните към сървър
                // fetch('/api/subscribe', {
                //     method: 'POST',
                //     body: JSON.stringify({ email: email }),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // });
            } else {
                emailInput.classList.add('error');
                
                // Показване на съобщение за грешка
                let errorMessage = document.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('p');
                    errorMessage.className = 'error-message';
                    emailInput.parentNode.appendChild(errorMessage);
                }
                errorMessage.textContent = 'Моля, въведете валиден имейл адрес.';
            }
        });
    }
}

// Функция за настройка на формата за регистрация
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        // Добавяне на валидация при изпращане на формата
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Вземане на всички полета, които се нуждаят от валидация
            const teamName = document.getElementById('team-name').value.trim();
            const captainName = document.getElementById('captain-name').value.trim();
            const captainEmail = document.getElementById('captain-email').value.trim();
            const captainPhone = document.getElementById('captain-phone').value.trim();
            const teamMembers = document.getElementById('team-members').value.trim();
            const agreeTerms = document.getElementById('agree-terms');
            
            // Проверка на задължителните полета
            let isValid = true;
            
            if (teamName === '') {
                showError('team-name', 'Моля, въведете име на отбора.');
                isValid = false;
            } else {
                clearError('team-name');
            }
            
            if (captainName === '') {
                showError('captain-name', 'Моля, въведете име на капитана.');
                isValid = false;
            } else {
                clearError('captain-name');
            }
            
            if (!validateEmail(captainEmail)) {
                showError('captain-email', 'Моля, въведете валиден имейл адрес.');
                isValid = false;
            } else {
                clearError('captain-email');
            }
            
            if (captainPhone === '' || !validatePhone(captainPhone)) {
                showError('captain-phone', 'Моля, въведете валиден телефонен номер.');
                isValid = false;
            } else {
                clearError('captain-phone');
            }
            
            if (teamMembers === '') {
                showError('team-members', 'Моля, въведете имената на всички членове на отбора.');
                isValid = false;
            } else {
                clearError('team-members');
            }
            
            if (agreeTerms && !agreeTerms.checked) {
                showError('agree-terms', 'Трябва да се съгласите с условията за участие.');
                isValid = false;
            } else if (agreeTerms) {
                clearError('agree-terms');
            }
            
            // Ако всичко е валидно, изпращаме формата
            if (isValid) {
                // Показване на съобщение за успех
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<p>Вашата регистрация е изпратена успешно! Ще се свържем с вас скоро.</p>';
                
                // Заменяме формата със съобщението за успех
                registrationForm.parentNode.replaceChild(successMessage, registrationForm);
                
                // В реална ситуация тук бихте изпратили данните към сървър
                // fetch('/api/register', {
                //     method: 'POST',
                //     body: new FormData(registrationForm),
                // });
            }
        });
    }
}

// Функция за настройка на формата за контакт
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Вземане на стойностите на полетата
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            // Проверка на задължителните полета
            let isValid = true;
            
            if (name === '') {
                showError('contact-name', 'Моля, въведете вашето име.');
                isValid = false;
            } else {
                clearError('contact-name');
            }
            
            if (!validateEmail(email)) {
                showError('contact-email', 'Моля, въведете валиден имейл адрес.');
                isValid = false;
            } else {
                clearError('contact-email');
            }
            
            if (subject === '') {
                showError('contact-subject', 'Моля, въведете тема на съобщението.');
                isValid = false;
            } else {
                clearError('contact-subject');
            }
            
            if (message === '') {
                showError('contact-message', 'Моля, въведете вашето съобщение.');
                isValid = false;
            } else {
                clearError('contact-message');
            }
            
            // Ако всичко е валидно, изпращаме формата
            if (isValid) {
                // Показване на съобщение за успех
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<p>Вашето съобщение е изпратено успешно! Ще се свържем с вас скоро.</p>';
                
                // Заменяме формата със съобщението за успех
                contactForm.parentNode.replaceChild(successMessage, contactForm);
                
                // В реална ситуация тук бихте изпратили данните към сървър
                // fetch('/api/contact', {
                //     method: 'POST',
                //     body: new FormData(contactForm),
                // });
            }
        });
    }
}

// Функция за валидация на имейл
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Функция за валидация на телефонен номер
function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}

// Функция за показване на грешка
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    // Проверка дали вече съществува съобщение за грешка
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
}

// Функция за изчистване на грешка
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('error');
    
    // Премахване на съобщението за грешка, ако такова съществува
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.parentNode.removeChild(errorElement);
    }
}

// Функция за добавяне на анимации при скролване
function setupScrollAnimations() {
    // Селектираме всички елементи, които искаме да анимираме
    const animatedElements = document.querySelectorAll('.feature, .news-item, .team');
    
    // Създаваме нов IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Ако елементът е видим
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Спираме да наблюдаваме елемента след като е анимиран
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 }); // Елементът трябва да бъде 20% видим преди да се активира анимацията
    
    // Наблюдаваме всички елементи, които искаме да анимираме
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}
// Toggle FAQ answers
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
        
        // Toggle icon
        const icon = question.querySelector('i');
        if (faqItem.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
});

// Form submission handler
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validation logic would go here
    
    // Show success message
    alert('Благодарим за вашето съобщение! Ще се свържем с вас възможно най-скоро.');
    
    // Reset form
    contactForm.reset();
});
// Toggle FAQ answers
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
        
        // Toggle icon
        const icon = question.querySelector('i');
        if (faqItem.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});
// Подобрена валидация на формите
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Валидация на всички задължителни полета
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                showError(field.id, 'Това поле е задължително.');
                isValid = false;
            } else {
                clearError(field.id);
            }

            // Специфична валидация за email полета
            if (field.type === 'email' && !validateEmail(field.value.trim())) {
                showError(field.id, 'Моля, въведете валиден имейл адрес.');
                isValid = false;
            }

            // Специфична валидация за телефонни полета
            if (field.type === 'tel' && !validatePhone(field.value.trim())) {
                showError(field.id, 'Моля, въведете валиден телефонен номер.');
                isValid = false;
            }
        });

        if (isValid) {
            // Показване на съобщение за успех
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<p>Вашето съобщение е изпратено успешно! Ще се свържем с вас скоро.</p>';
            
            // Заменяме формата със съобщението за успех
            form.parentNode.replaceChild(successMessage, form);
        }
    });
}

// Инициализиране на валидацията за всички форми
validateForm('contact-form');
validateForm('registration-form');
validateForm('newsletter-form');
/* Общи стилове за съобщения */
// API база данни (симулирана)
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
  
  // API Routes
  const API = {
    // Връща всички турнири
    getTournaments: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 200,
            data: db.tournaments
          });
        }, 500); // Симулираме мрежово забавяне
      });
    },
  
    // Връща конкретен турнир по ID
    getTournament: (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const tournament = db.tournaments.find(t => t.id === parseInt(id));
          if (tournament) {
            resolve({
              status: 200,
              data: tournament
            });
          } else {
            reject({
              status: 404,
              message: "Турнирът не е намерен"
            });
          }
        }, 500);
      });
    },
  
    // Връща всички отбори
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
  
    // Регистрира нов отбор
    registerTeam: (teamData) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const newTeam = {
            id: db.teams.length + 1,
            ...teamData
          };
          db.teams.push(newTeam);
          resolve({
            status: 201,
            data: newTeam
          });
        }, 800);
      });
    },
  
    // Изпраща контактна форма
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
  
  // Инициализация на API функционалностите
  document.addEventListener('DOMContentLoaded', function() {
    // Зареждане на турнири
    if (document.querySelector('.upcoming-tournament') || document.querySelector('.tournament-details')) {
      loadTournaments();
    }
  
    // Зареждане на отбори
    if (document.querySelector('.teams-container')) {
      loadTeams();
    }
  
    // Обновена регистрационна форма
    if (document.getElementById('registration-form')) {
      setupRegistrationForm();
    }
  
    // Обновена контактна форма
    if (document.getElementById('contact-form')) {
      setupContactForm();
    }
  });
  
  // Зареждане на турнири
  async function loadTournaments() {
    try {
      const response = await API.getTournaments();
      const tournaments = response.data;
      
      // Обработка на турнирите и показване в UI
      if (tournaments.length > 0) {
        const upcomingTournament = tournaments[0];
        
        // Обновяване на таймера
        if (document.querySelector('.countdown-timer')) {
          startCountdown(new Date(upcomingTournament.date).getTime());
        }
        
        // Обновяване на информацията за турнира
        if (document.querySelector('.tournament-header')) {
          document.querySelector('.tournament-title h2').textContent = upcomingTournament.name;
          // Допълнителни UI updates...
        }
      }
    } catch (error) {
      console.error("Грешка при зареждане на турнирите:", error);
    }
  }
  
  // Зареждане на отбори
  async function loadTeams() {
    try {
      const response = await API.getTeams();
      const teams = response.data;
      
      const teamsContainer = document.querySelector('.teams-container');
      if (teamsContainer) {
        // Генериране на HTML за всеки отбор
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
      }
    } catch (error) {
      console.error("Грешка при зареждане на отборите:", error);
    }
  }
  
  // Обновена регистрационна форма
  function setupRegistrationForm() {
    const form = document.getElementById('registration-form');
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Събиране на данните от формата
      const formData = new FormData(form);
      const teamData = {
        name: formData.get('team-name'),
        logo: formData.get('team-logo'),
        description: formData.get('team-description'),
        socials: {
          tiktok: formData.get('team-tiktok'),
          youtube: formData.get('team-youtube'),
          twitch: formData.get('team-twitch')
        },
        captain: {
          name: formData.get('captain-name'),
          email: formData.get('captain-email'),
          phone: formData.get('captain-phone'),
          tiktok: formData.get('captain-tiktok')
        },
        players: [
          {
            nickname: formData.get('player1-nickname'),
            role: formData.get('player1-role'),
            steamId: formData.get('player1-steamid')
          },
          // Добавете останалите играчи...
        ]
      };
  
      try {
        const response = await API.registerTeam(teamData);
        
        // Показване на съобщение за успех
        form.innerHTML = `
          <div class="success-message">
            <h3>Регистрацията е успешна!</h3>
            <p>Вашият отбор "${response.data.name}" е регистриран успешно.</p>
            <p>Ще се свържем с вас на посочения имейл за потвърждение.</p>
          </div>
        `;
      } catch (error) {
        // Показване на съобщение за грешка
        alert(`Грешка при регистрация: ${error.message}`);
      }
    });
  }
  
  // Обновена контактна форма
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const contactData = {
        name: formData.get('contact-name'),
        email: formData.get('contact-email'),
        subject: formData.get('contact-subject'),
        message: formData.get('contact-message')
      };
  
      try {
        const response = await API.submitContact(contactData);
        
        // Показване на съобщение за успех
        form.innerHTML = `
          <div class="success-message">
            <h3>${response.message}</h3>
            <p>Благодарим ви, че се свързахте с нас. Ще отговорим възможно най-скоро.</p>
          </div>
        `;
      } catch (error) {
        alert(`Грешка при изпращане на съобщението: ${error.message}`);
      }
    });
  }
  // admin.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const dashboard = document.getElementById('dashboard');
    const tournamentsSection = document.getElementById('tournaments');
    
    let currentUser = null;
  
    // Login
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = jwtDecode(data.token);
            showDashboard();
          } else {
            alert('Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      });
    }
  
    // Show dashboard
    function showDashboard() {
      loginForm.style.display = 'none';
      dashboard.style.display = 'block';
      loadTournaments();
    }
  
    // Load tournaments
    async function loadTournaments() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/tournaments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const tournaments = await response.json();
          renderTournaments(tournaments);
        }
      } catch (error) {
        console.error('Error loading tournaments:', error);
      }
    }
  
    // Render tournaments
    function renderTournaments(tournaments) {
      tournamentsSection.innerHTML = `
        <h2>Manage Tournaments</h2>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tournaments.map(t => `
              <tr>
                <td>${t.id}</td>
                <td>${t.name}</td>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-delete">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Existing setup functions
    setupMobileNav();
    setupNewsletterForm();
    if (document.getElementById('registration-form')) {
        setupRegistrationForm();
    }
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    setupScrollAnimations();
    setupTabs();

    // Initialize countdown and tournament details
    if (document.querySelector('.tournament-details')) {
        loadTournamentDetails();
    } else if (document.querySelector('.countdown-timer')) {
        // Fallback for other pages with countdown
        startCountdown();
    }
});

// Existing functions (unchanged)
function setupMobileNav() { /* ... */ }
function formatNumber(number) { return number < 10 ? '0' + number : number; }
function setupNewsletterForm() { /* ... */ }
function setupRegistrationForm() { /* ... */ }
function setupContactForm() { /* ... */ }
function validateEmail(email) { /* ... */ }
function validatePhone(phone) { /* ... */ }
function showError(fieldId, message) { /* ... */ }
function clearError(fieldId) { /* ... */ }
function setupScrollAnimations() { /* ... */ }
function setupTabs() { /* ... */ }

// Updated countdown function
function startCountdown(tournamentDate = new Date('May 3, 2025 14:00:00').getTime()) {
    // Check if timer elements exist
    const timerElements = {
        days: document.getElementById('t-days') || document.getElementById('days'),
        hours: document.getElementById('t-hours') || document.getElementById('hours'),
        minutes: document.getElementById('t-minutes') || document.getElementById('minutes'),
        seconds: document.getElementById('t-seconds') || document.getElementById('seconds')
    };

    if (!timerElements.days || !timerElements.hours || !timerElements.minutes || !timerElements.seconds) {
        console.error('Countdown timer elements not found');
        return;
    }

    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = tournamentDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update timer display
        timerElements.days.textContent = formatNumber(days);
        timerElements.hours.textContent = formatNumber(hours);
        timerElements.minutes.textContent = formatNumber(minutes);
        timerElements.seconds.textContent = formatNumber(seconds);

        // Handle timer expiration
        if (distance < 0) {
            clearInterval(countdownTimer);
            Object.values(timerElements).forEach(el => el.textContent = '00');
            const countdownElement = document.querySelector('.countdown-timer');
            if (countdownElement) {
                countdownElement.innerHTML = '<p class="tournament-started">Турнирът вече е започнал!</p>';
            }
        }
    }, 1000);
}

// Updated loadTournamentDetails function
async function loadTournamentDetails() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    if (loading) loading.style.display = 'flex';
    if (errorMessage) errorMessage.style.display = 'none';

    try {
        const response = await API.getTournaments();
        const tournament = response.data[0];

        // Update tournament details
        document.getElementById('tournament-name').textContent = tournament.name;
        document.getElementById('tournament-title').textContent = tournament.name;
        document.getElementById('tournament-date').textContent = new Date(tournament.date).toLocaleDateString('bg-BG');
        document.getElementById('tournament-time').textContent = new Date(tournament.date).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournament-location').textContent = tournament.location;
        document.getElementById('tournament-game').textContent = tournament.game;
        document.getElementById('tournament-description').textContent = `Турнирът ${tournament.name} ще събере топ тиктокъри гейминг стриймъри за вълнуващи мачове в ${tournament.game}.`;
        document.getElementById('tournament-teams').textContent = `${tournament.teams} отбора`;

        // Start countdown with tournament date
        startCountdown(new Date(tournament.date).getTime());

        // Load schedule (simplified for brevity)
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

        // Load bracket (simplified for brevity)
        const bracketContainer = document.getElementById('tournament-bracket');
        bracketContainer.innerHTML = `
            <div class="bracket-teams">
                <div class="bracket-team team-a">
                    <div class="team-logo">
                        <img src="/api/placeholder/60/60" alt="Отбор А">
                    </div>
                    <div class="team-name">🎮│Тигри</div>
                    <div class="team-score" id="team-a-score">0</div>
                </div>
                <span class="vs">VS</span>
                <div class="bracket-team team-b">
                    <div class="team-logo">
                        <img src="/api/placeholder/60/60" alt="Отбор Б">
                    </div>
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
        // Fallback: Start countdown with default date
        startCountdown();
    } finally {
        if (loading) loading.style.display = 'none';
    }
}
// Simulated API for teams (assumed from tournament.html)
const api = {
  getTeams: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
          {
              id: 1,
              name: "Team Alpha",
              logo: "/api/placeholder/100/100",
              captain: "AlphaLeader",
              players: [
                  { nickname: "AlphaLeader", role: "IGL", stats: { kills: 120, deaths: 80 } },
                  { nickname: "BetaFragger", role: "Entry", stats: { kills: 100, deaths: 90 } },
                  { nickname: "GammaSniper", role: "AWPer", stats: { kills: 80, deaths: 60 } },
                  { nickname: "DeltaSupport", role: "Support", stats: { kills: 70, deaths: 85 } },
                  { nickname: "EpsilonLurker", role: "Lurker", stats: { kills: 90, deaths: 70 } }
              ],
              socials: { tiktok: "team_alpha", twitch: "team_alpha" },
              description: "A fierce team ready to dominate!"
          },
          // Add more teams as needed
      ];
  }
};

// Hamburger Menu Toggle (assumed existing)
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.classList.toggle('active');
  });
});

// Teams Page: Load Teams Dynamically
function loadTeams() {
  const teamsContainer = document.getElementById('teams-container');
  const loading = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');

  if (!teamsContainer) return;

  loading.style.display = 'block';
  errorMessage.style.display = 'none';

  api.getTeams()
      .then(teams => {
          loading.style.display = 'none';
          teamsContainer.innerHTML = teams.map(team => `
              <div class="team">
                  <div class="team-header">
                      <div class="team-logo">
                          <img src="${team.logo}" alt="${team.name} Logo">
                      </div>
                      <div class="team-info">
                          <h3>${team.name}</h3>
                          <div class="team-meta">
                              <span><i class="fas fa-user"></i> Капитан: ${team.captain}</span>
                          </div>
                          <div class="team-social">
                              ${team.socials.tiktok ? `<a href="https://tiktok.com/@${team.socials.tiktok}" target="_blank"><i class="fab fa-tiktok"></i></a>` : ''}
                              ${team.socials.twitch ? `<a href="https://twitch.tv/${team.socials.twitch}" target="_blank"><i class="fab fa-twitch"></i></a>` : ''}
                          </div>
                      </div>
                  </div>
                  <div class="team-description">
                      <p>${team.description}</p>
                  </div>
                  <div class="team-players">
                      <h4>Играчи</h4>
                      <div class="players-grid">
                          ${team.players.map(player => `
                              <div class="player">
                                  <div class="player-img">
                                      <img src="/api/placeholder/80/80" alt="${player.nickname}">
                                  </div>
                                  <div class="player-info">
                                      <h5>${player.nickname}</h5>
                                      <p class="player-role">${player.role}</p>
                                      <div class="player-stats">
                                          <span>Убийства: ${player.stats.kills}</span>
                                          <span>Смърти: ${player.stats.deaths}</span>
                                      </div>
                                  </div>
                              </div>
                          `).join('')}
                      </div>
                  </div>
              </div>
          `).join('');
      })
      .catch(error => {
          loading.style.display = 'none';
          errorMessage.style.display = 'block';
          errorMessage.textContent = 'Грешка при зареждане на отборите. Моля, опитайте отново.';
          console.error('Error loading teams:', error);
      });
}

// Rules Page: Collapsible Sections
function initializeCollapsibleSections() {
  const collapsibles = document.querySelectorAll('.rule-section.collapsible');
  collapsibles.forEach(section => {
      const header = section.querySelector('h3');
      header.addEventListener('click', () => {
          section.classList.toggle('active');
      });
  });
}

// Contacts Page: FAQ Toggles
function initializeFAQToggles() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
          item.classList.toggle('active');
      });
  });
}

// Registration Page: Form Validation and Submission
function initializeRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const loading = document.getElementById('form-loading');
      const error = document.getElementById('form-error');
      const success = document.getElementById('form-success');

      // Reset messages
      error.style.display = 'none';
      success.style.display = 'none';
      loading.style.display = 'block';

      // Basic client-side validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
          const errorMessage = document.getElementById(`${field.id}-error`);
          if (!field.value.trim()) {
              field.parentElement.classList.add('error');
              errorMessage.textContent = 'Това поле е задължително.';
              isValid = false;
          } else {
              field.parentElement.classList.remove('error');
              errorMessage.textContent = '';
          }
      });

      // Email validation
      const emailField = document.getElementById('captain-email');
      const emailError = document.getElementById('captain-email-error');
      if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
          emailField.parentElement.classList.add('error');
          emailError.textContent = 'Моля, въведете валиден имейл адрес.';
          isValid = false;
      }

      if (!isValid) {
          loading.style.display = 'none';
          error.style.display = 'block';
          error.textContent = 'Моля, попълнете всички задължителни полета коректно.';
          return;
      }

      try {
          // Simulate API submission
          await new Promise(resolve => setTimeout(resolve, 1000));
          loading.style.display = 'none';
          success.style.display = 'block';
          success.textContent = 'Вашият отбор беше регистриран успешно! Ще получите потвърждение по имейл.';
          form.reset();
      } catch (err) {
          loading.style.display = 'none';
          error.style.display = 'block';
          error.textContent = 'Грешка при регистрацията. Моля, опитайте отново.';
      }
  });
}

// Contacts Page: Contact Form Submission
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const loading = document.getElementById('form-loading');
      const error = document.getElementById('form-error');
      const success = document.getElementById('form-success');

      // Reset messages
      error.style.display = 'none';
      success.style.display = 'none';
      loading.style.display = 'block';

      // Basic client-side validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
          const errorMessage = document.getElementById(`${field.id}-error`);
          if (!field.value.trim()) {
              field.parentElement.classList.add('error');
              errorMessage.textContent = 'Това поле е задължително.';
              isValid = false;
          } else {
              field.parentElement.classList.remove('error');
              errorMessage.textContent = '';
          }
      });

      // Email validation
      const emailField = document.getElementById('contact-email');
      const emailError = document.getElementById('contact-email-error');
      if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
          emailField.parentElement.classList.add('error');
          emailError.textContent = 'Моля, въведете валиден имейл адрес.';
          isValid = false;
      }

      if (!isValid) {
          loading.style.display = 'none';
          error.style.display = 'block';
          error.textContent = 'Моля, попълнете всички задължителни полета коректно.';
          return;
      }

      try {
          // Simulate API submission
          await new Promise(resolve => setTimeout(resolve, 1000));
          loading.style.display = 'none';
          success.style.display = 'block';
          success.textContent = 'Вашето съобщение беше изпратено успешно!';
          form.reset();
      } catch (err) {
          loading.style.display = 'none';
          error.style.display = 'block';
          error.textContent = 'Грешка при изпращането. Моля, опитайте отново.';
      }
  });
}

// Initialize Page-Specific Functionality
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  loadUpcomingTournaments();
  loadLatestNews();
  loadTeams();
  initializeCollapsibleSections();
  initializeFAQToggles();
  initializeRegistrationForm();
  initializeContactForm();
  initNewsletterForm();
});