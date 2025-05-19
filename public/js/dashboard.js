import { checkAuth } from './auth.js';

checkAuth();

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  attachProfileFormHandler();
  attachPasswordFormHandler(); // 👈 добавена функция за смяна на парола
  attachAvatarFormHandler(); // 👈 добавена функция за качване на аватар
});

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success) throw new Error('Невалиден отговор от сървъра');

    const user = result.data;

    document.getElementById('dashboard-username').textContent = user.username;
    document.getElementById('dashboard-email').textContent = user.email;
    document.getElementById('dashboard-role').textContent = user.role;
    document.getElementById('dashboard-name').textContent = `${user.firstName} ${user.lastName}`;

    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('discord').value = user.discord || '';
    document.getElementById('current-avatar').src = user.avatar || '/img/default-avatar.png';

  } catch (err) {
    console.error('❌ Грешка при зареждане на потребителските данни:', err);
    window.location.href = '/login.html';
  }
}

function attachProfileFormHandler() {
  const form = document.getElementById('profile-form');
  const message = document.getElementById('form-message');

  if (!form) {
    console.error('❌ Form with ID #profile-form not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const updateData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      discord: document.getElementById('discord').value,
    };

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await res.json();

      if (result.success) {
        message.textContent = '✅ Промените са записани успешно.';
        message.style.color = 'green';
      } else {
        throw new Error(result.message || 'Неуспешен запис');
      }

    } catch (err) {
      console.error('❌ Грешка при запис:', err);
      message.textContent = '❌ Възникна грешка при запис.';
      message.style.color = 'red';
    }
  });
}

function attachPasswordFormHandler() {
  const form = document.getElementById('password-form');
  const message = document.getElementById('password-message');

  if (!form) {
    console.warn('ℹ️ Формата за смяна на парола не е намерена.');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
      message.textContent = '❌ Новите пароли не съвпадат.';
      message.style.color = 'red';
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const result = await res.json();

      if (result.success) {
        message.textContent = '✅ Паролата е успешно сменена.';
        message.style.color = 'green';
        form.reset();
      } else {
        message.textContent = `❌ ${result.message || 'Грешка при смяната.'}`;
        message.style.color = 'red';
      }
    } catch (err) {
      console.error('❌ Грешка при заявка за смяна на парола:', err);
      message.textContent = '❌ Възникна грешка при заявката.';
      message.style.color = 'red';
    }
  });
}

function attachAvatarFormHandler() {
  console.log('📦 Стартира attachAvatarFormHandler');

  const avatarForm = document.getElementById('avatar-form');
  const avatarInput = document.getElementById('avatar-upload');
  const avatarPreview = document.getElementById('avatar-preview');
  const currentAvatar = document.getElementById('current-avatar');

  if (!avatarForm || !avatarInput) {
    console.error('❌ Не е намерен avatar-form или avatar-upload');
    return;
  }

  let selectedFile = null; // 🔐 съхраняваме избрания файл извън обхвата на събитието

  avatarInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    console.log('📷 Промяна на файл:', selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarPreview.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  });

  avatarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📤 Започва submit...');
    console.log('🧪 fileInput:', avatarInput);

    console.log('🧪 Избран файл:', selectedFile);

    if (!selectedFile) {
      alert('❗ Моля, изберете изображение.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      console.log('📩 Отговор от сървъра:', result);

      if (result.success) {
        currentAvatar.src = result.avatar;
        alert('✅ Аватарът е успешно обновен!');
      } else {
        alert(`❌ Грешка: ${result.message}`);
      }
    } catch (err) {
      console.error('❌ Грешка при fetch:', err);
      alert('❌ Възникна грешка при качване на аватар.');
    }
  });
}