import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import leaveService from '../api/leave';
import { Plus, History } from 'lucide-react';

const Leave = () => {
    const { token, user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        leaveType: 'PAID',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        try {
            const data = await leaveService.getMyLeaves(token);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await leaveService.applyLeave(formData, token);
            setSuccess('Leave request submitted successfully');
            setIsApplying(false);
            setFormData({ leaveType: 'PAID', startDate: '', endDate: '', reason: '' });
            await fetchLeaves();
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#22c55e';
            case 'REJECTED': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Leave Management</h2>
                {!isApplying && (
                    <button onClick={() => setIsApplying(true)} className="btn btn-primary">
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Apply Leave
                    </button>
                )}
            </div>

            {error && <div style={{ background: '#ef444420', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ background: '#22c55e20', color: '#86efac', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

            {isApplying && (
                <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>New Leave Request</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Leave Type</label>
                                <select
                                    className="input-field"
                                    value={formData.leaveType}
                                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                >
                                    <option value="PAID">Paid Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="UNPAID">Unpaid Leave</option>
                                    <option value="CASUAL">Casual Leave</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Start Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>End Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Reason</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" onClick={() => setIsApplying(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <History size={20} /> My Leave History
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Type</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>From</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>To</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Reason</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <tr key={leave._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{leave.leaveType}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', maxWidth: '300px' }}>{leave.reason}</td>
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
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No leave history found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {(user.role === 'ADMIN' || user.role === 'HR') && (
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <a href="/admin/leaves" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Manage All Request</a>
                </div>
            )}
        </div>
    );
};

export default Leave;
