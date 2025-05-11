let mockTournaments = [
    { id: 1, name: 'TikTok CS турнир', date: '2025-06-01' },
    { id: 2, name: 'Junior BG League', date: '2025-07-15' }
];

export async function getAllTournaments() {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockTournaments), 200);
    });
}

export async function createTournament(tournament) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockTournaments.push({
                id: mockTournaments.length + 1,
                ...tournament
            });
            resolve();
        }, 200);
    });
}

export async function deleteTournament(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockTournaments = mockTournaments.filter(t => t.id != id);
            resolve();
        }, 200);
    });
}