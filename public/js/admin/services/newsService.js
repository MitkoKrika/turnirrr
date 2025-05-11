let mockNews = [
    {
        id: 1,
        title: 'Обявен е първият турнир за тиктокъри',
        date: '2025-04-20',
        content: 'Участие на известни тиктокъри в CS 1.6',
        image: '/api/placeholder/400/250',
        author: 'admin'
    }
];

export async function getAllNews() {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockNews), 200);
    });
}

export async function createNews(news) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (news.id) {
                const index = mockNews.findIndex(n => n.id == news.id);
                if (index !== -1) mockNews[index] = { ...mockNews[index], ...news };
            } else {
                news.id = mockNews.length + 1;
                mockNews.push(news);
            }
            resolve();
        }, 200);
    });
}

export async function deleteNews(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockNews = mockNews.filter(n => n.id != id);
            resolve();
        }, 200);
    });
}