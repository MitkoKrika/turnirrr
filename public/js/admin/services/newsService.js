export async function getAllNews() {
    const res = await fetch('/api/news/admin');
    if (!res.ok) throw new Error('Неуспешно зареждане на новини');
    return await res.json();
}

export async function createNews(news) {
    const method = news.id ? 'PUT' : 'POST';
    const url = news.id ? `/api/news/admin/${news.id}` : '/api/news/admin';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(news)
    });

    if (!res.ok) throw new Error('Грешка при запис на новина');
    return await res.json();
}

export async function deleteNews(id) {
    const res = await fetch(`/api/news/admin/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Грешка при изтриване на новина');
}