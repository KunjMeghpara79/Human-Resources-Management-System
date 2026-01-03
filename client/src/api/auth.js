const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Check if response is ok before parsing JSON
        if (!response.ok) {
            let errorMessage = 'Registration failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors and other fetch errors
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server. Please check if the server is running.');
        }
        throw error;
    }
};

const login = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Check if response is ok before parsing JSON
        if (!response.ok) {
            let errorMessage = 'Login failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors and other fetch errors
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server. Please check if the server is running.');
        }
        throw error;
    }
};

const authService = {
    register,
    login,
};

export default authService;
