export function initSettingsSection() {
    const form = document.getElementById('settings-form');
    const status = document.getElementById('settings-status');

    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const settings = {};

        data.forEach((value, key) => {
            settings[key] = value;
        });

        setTimeout(() => {
            status.textContent = 'Настройките са запазени успешно!';
            status.classList.add('success');

            setTimeout(() => {
                status.textContent = '';
                status.classList.remove('success');
            }, 3000);
        }, 500);
    });
}