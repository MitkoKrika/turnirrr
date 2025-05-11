let mockTeams = [
    { id: 1, name: '🎮│Тигри', logo: '/api/placeholder/60/60' },
    { id: 2, name: '🎮│Седмици', logo: '/api/placeholder/60/60' }
];

export async function getAllTeams() {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockTeams), 200);
    });
}

export async function createTeam(team) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockTeams.push({ id: mockTeams.length + 1, ...team });
            resolve();
        }, 200);
    });
}

export async function deleteTeam(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockTeams = mockTeams.filter(team => team.id != id);
            resolve();
        }, 200);
    });
}