export function checkAuth(expectedRole = null) {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('🔒 Няма токен – пренасочване към login.html');
    window.location.href = '/login.html';
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    // Ако очакваме роля (напр. admin), проверяваме
    if (expectedRole && role !== expectedRole) {
      console.warn(`🔒 Ролята "${role}" не съответства на "${expectedRole}"`);
      window.location.href = '/login.html';
      return;
    }

    // Всичко наред, можеш да продължиш
    console.log(`✅ Добре дошъл, ${role}`);
  } catch (err) {
    console.error('❌ Невалиден токен');
    window.location.href = '/login.html';
  }
}