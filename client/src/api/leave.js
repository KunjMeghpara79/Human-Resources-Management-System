const API_URL = 'http://localhost:5000/api/leave';

const applyLeave = async (leaveData, token) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to apply for leave');
    }
    return data;
};

const getMyLeaves = async (token) => {
    const response = await fetch(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch leaves');
    return response.json();
};

const getAllLeaves = async (token) => {
    const response = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch leaves');
    return response.json();
};

const updateLeaveStatus = async (id, statusData, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update leave status');
    }
    return data;
};

const leaveService = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
};

export default leaveService;
