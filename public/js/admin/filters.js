export function setupListFilters() {
    document.querySelectorAll('[data-filter-input]').forEach(input => {
        const targetId = input.getAttribute('data-filter-input');
        const listContainer = document.getElementById(targetId);

        if (!listContainer) return;

        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();

            listContainer.querySelectorAll('.admin-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    });
}