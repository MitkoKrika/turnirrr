let mockRegistrations = [
    {
        id: 1,
        teamName: 'Нинджа Хакери',
        captainName: 'Георги Петров',
        email: 'geo@example.com',
        approved: false
    }
];

export async function getAllRegistrations() {
    return new Promise(resolve => {
        setTimeout(() => resolve(mockRegistrations), 200);
    });
}

export async function approveRegistration(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            const reg = mockRegistrations.find(r => r.id == id);
            if (reg) reg.approved = true;
            resolve();
        }, 150);
    });
}

export async function rejectRegistration(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            const reg = mockRegistrations.find(r => r.id == id);
            if (reg) reg.approved = false;
            resolve();
        }, 150);
    });
}

export async function deleteRegistration(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            mockRegistrations = mockRegistrations.filter(r => r.id != id);
            resolve();
        }, 150);
    });
}