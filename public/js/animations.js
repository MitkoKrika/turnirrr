export function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature, .news-item, .team');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

export function setupFaqToggles() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');

            const icon = question.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    });
}

export function setupCollapsibles() {
    const collapsibles = document.querySelectorAll('.rule-section.collapsible');
    collapsibles.forEach(section => {
        const header = section.querySelector('h3');
        if (header) {
            header.addEventListener('click', () => {
                section.classList.toggle('active');
            });
        }
    });
}