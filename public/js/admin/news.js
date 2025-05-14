import { getAllNews, createNews, deleteNews } from './services/newsService.js';

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

        try {
            await createNews({ id, title, date, content, image });
            modal.classList.remove('active');
            loadNews();
        } catch (err) {
            alert('Грешка при запазване на новината.');
            console.error(err);
        }
    });

    const table = document.getElementById('news-table');
    if (table) {
        table.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (!id) return;

            if (e.target.classList.contains('delete-news')) {
                if (confirm('Сигурен ли си, че искаш да изтриеш тази новина?')) {
                    try {
                        await deleteNews(id);
                        loadNews();
                    } catch (err) {
                        alert('Грешка при изтриване на новината.');
                    }
                }
            }

            if (e.target.classList.contains('edit-news')) {
                const newsItem = latestNews.find(n => n._id === id);
                if (newsItem) {
                    document.getElementById('news-id').value = newsItem._id;
                    document.getElementById('news-title').value = newsItem.title;
                    document.getElementById('news-date').value = newsItem.date.split('T')[0];
                    document.getElementById('news-content').value = newsItem.content;
                    document.getElementById('news-image').value = newsItem.image || '';

                    modal.classList.add('active');
                }
            }
        });
    }
}

let latestNews = [];

async function loadNews() {
    const table = document.getElementById('news-table');
    if (!table) return;

    try {
        const news = await getAllNews();
        latestNews = news;

        table.innerHTML = news.map(item => `
            <tr>
                <td>${item._id}</td>
                <td>${item.title}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${item.author || 'admin'}</td>
                <td>
                    <button class="edit-news btn" data-id="${item._id}">Редактирай</button>
                    <button class="delete-news btn" data-id="${item._id}">Изтрий</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Грешка при зареждане на новини:', err);
    }
}