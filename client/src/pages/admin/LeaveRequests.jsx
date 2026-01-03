import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../api/leave';

const AdminLeaveRequests = () => {
    const { token } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeaves = async () => {
        try {
            const data = await leaveService.getAllLeaves(token);
            setLeaves(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [token]);

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
        try {
            await leaveService.updateLeaveStatus(id, { status }, token);
            await fetchLeaves();
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#22c55e';
            case 'REJECTED': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    if (loading) return <div>Loading Requests...</div>;

    return (
        <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>All Leave Requests</h2>

            {error && <div style={{ background: '#ef444420', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Employee</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Type</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Duration</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Reason</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <tr key={leave._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{leave.user?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leave.user?.email}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{leave.leaveType}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(leave.startDate).toLocaleDateString()} - <br />
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '250px' }}>{leave.reason}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500',
                                            background: `${getStatusColor(leave.status)}20`,
                                            color: getStatusColor(leave.status)
                                        }}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {leave.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'APPROVED')}
                                                    style={{ padding: '0.5rem', background: '#22c55e20', color: '#86efac', borderRadius: '6px' }}
                                                    title="Approve"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'REJECTED')}
                                                    style={{ padding: '0.5rem', background: '#ef444420', color: '#fca5a5', borderRadius: '6px' }}
                                                    title="Reject"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLeaveRequests;
