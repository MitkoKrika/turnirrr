import {
    getAllNews,
    createNews,
    deleteNews
} from './services/newsService.js';

export function initNewsAdmin() {
    loadNews();

    const form = document.getElementById('news-form');
    const modal = document.getElementById('news-modal');
    const addBtn = document.getElementById('add-news');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('news-id').value = '';
            modal.classList.add('active');
        });
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('news-id').value;
        const title = document.getElementById('news-title').value;
        const date = document.getElementById('news-date').value;
        const content = document.getElementById('news-content').value;
        const image = document.getElementById('news-image').value;

        await createNews({ id, title, date, content, image });
        modal.classList.remove('active');
        loadNews();
    });

    const table = document.getElementById('news-table');
    if (table) {
        table.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-news')) {
                const id = e.target.dataset.id;
                if (confirm('Сигурен ли си, че искаш да изтриеш тази новина?')) {
                    await deleteNews(id);
                    loadNews();
                }
            }
        });
    }
}

async function loadNews() {
    const table = document.getElementById('news-table');
    if (!table) return;

    const news = await getAllNews();
    table.innerHTML = news.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${new Date(item.date).toLocaleDateString()}</td>
            <td>${item.author || 'admin'}</td>
            <td>
                <button class="delete-news btn" data-id="${item.id}">Изтрий</button>
            </td>
        </tr>
    `).join('');
}