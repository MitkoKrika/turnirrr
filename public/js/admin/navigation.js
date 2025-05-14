export function setupAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            let target = link.getAttribute('data-target');
            if (!target) {
                const href = link.getAttribute('href');
                target = href?.startsWith('#') ? href.substring(1) : null;
            }

            if (!target) return;

            sections.forEach(section => {
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}