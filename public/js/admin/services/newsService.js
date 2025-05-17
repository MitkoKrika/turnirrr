export async function getAllNews() {
    const res = await fetch('/api/news/admin');
    if (!res.ok) throw new Error('Неуспешно зареждане на новини');
    const response = await res.json();
    return response.data;
}

export async function getNewsById(id) {
    const method = news.id;
    const url = await fetch(`/api/news/${id}`);
    if (!res.ok) throw new Error('Неуспешно зареждане на новина');
    //const response = await res.json();

    const payload = {
        title: news.title,
        content: news.content,
        imageurl: news.image || '',
    };

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        console.error('Грешка от сървъра:', text);
    }
    //return response.data;
    return await res.json();
}

export async function createNews(news) {
    const method = news.id ? 'PUT' : 'POST';
    const url = news.id ? `/api/news/${news.id}` : '/api/news';

    const payload = {
        title: news.title,
        content: news.content,
        imageurl: news.image || '',
    };

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text();
        console.error('Грешка от сървъра:', text);
        throw new Error('Грешка при запис на новина');
    }

    return await res.json();
}

export async function deleteNews(id) {
    const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
            ...(localStorage.getItem('token') && {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        }
    });

    if (!res.ok) {
        const text = await res.text();
        console.error('Грешка при изтриване:', text);
        throw new Error('Грешка при изтриване на новина');
    }
}