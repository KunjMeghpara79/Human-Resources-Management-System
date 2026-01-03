const API_URL = 'http://localhost:5000/api/users';

const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
};

const updateProfile = async (userData, token) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
    }
    return data;
};

const userService = {
    getProfile,
    updateProfile,
};

export default userService;
