const API_URL = 'http://localhost:5000/api/attendance';

const getTodayStatus = async (token) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_URL}?date=${today}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
            let errorMessage = 'Failed to fetch status';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('getTodayStatus response data:', data);
        // If it's an array, get the first item (today's record) or return null
        const result = Array.isArray(data) ? (data[0] || null) : data;
        console.log('getTodayStatus returning:', result);
        return result;
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server');
        }
        throw error;
    }
};

const checkIn = async (token) => {
    try {
        const response = await fetch(`${API_URL}/checkin`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body for now, can add location/biometric later
        });
        
        if (!response.ok) {
            let errorMessage = 'Check-in failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server');
        }
        throw error;
    }
};

const checkOut = async (token) => {
    try {
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Empty body for now, can add location later
        });
        
        if (!response.ok) {
            let errorMessage = 'Check-out failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server');
        }
        throw error;
    }
};

const getHistory = async (token) => {
    try {
        const response = await fetch(`${API_URL}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
            let errorMessage = 'Failed to fetch history';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Network error: Unable to connect to server');
        }
        throw error;
    }
};

const attendanceService = {
    getTodayStatus,
    checkIn,
    checkOut,
    getHistory,
};

export default attendanceService;
