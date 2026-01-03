const API_URL = 'http://localhost:5000/api/payroll';

const getMyPayroll = async (token) => {
    const response = await fetch(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch payroll history');
    return response.json();
};

const payrollService = {
    getMyPayroll,
};

export default payrollService;
