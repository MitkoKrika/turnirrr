export async function getStats() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                tournaments: 12,
                teams: 28,
                users: 114,
                registrations: 41
            });
        }, 300);
    });
}