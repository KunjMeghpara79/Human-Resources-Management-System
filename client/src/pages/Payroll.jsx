import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import payrollService from '../api/payroll';
import { DollarSign, Download } from 'lucide-react';

const Payroll = () => {
    const { token } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const data = await payrollService.getMyPayroll(token);
                setPayrolls(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayroll();
    }, [token]);

    if (loading) return <div>Loading Payroll...</div>;

    return (
        <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Payroll History</h2>

            {error && <div style={{ background: '#ef444420', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Month/Year</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Base Salary</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Deductions</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Net Salary</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.length > 0 ? payrolls.map((record) => (
                                <tr key={record._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                <DollarSign size={16} color="var(--primary)" />
                                            </div>
                                            {record.month} {record.year}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>${record.baseSalary.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', color: '#fca5a5' }}>-${record.deductions.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#86efac' }}>${record.netSalary.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            background: '#22c55e20',
                                            color: '#86efac'
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }} title="Download Slip">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No payroll records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payroll;
