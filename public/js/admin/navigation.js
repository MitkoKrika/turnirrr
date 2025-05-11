export function setupAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const target = link.getAttribute('data-target');
            if (!target) return;

            sections.forEach(section => {
                section.style.display = 'none';
            });

            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}