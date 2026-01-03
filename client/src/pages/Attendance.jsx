import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import attendanceService from '../api/attendance';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
    const { token } = useAuth();
    const [todayStatus, setTodayStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setError(null); // Clear errors when fetching fresh data
            console.log('Fetching attendance data...');
            
            const [status, hist] = await Promise.all([
                attendanceService.getTodayStatus(token),
                attendanceService.getHistory(token)
            ]);
            
            console.log('Fetched status:', status);
            console.log('Fetched history length:', hist?.length);
            
            // If status is null but we have history, check if today's record is in history
            let todayStatus = status;
            if (!todayStatus && hist && hist.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                console.log('Status is null, checking history for today:', today);
                const todayRecord = hist.find(record => {
                    // Handle both string dates and Date objects
                    let recordDate;
                    if (typeof record.date === 'string') {
                        recordDate = record.date.split('T')[0]; // Handle ISO strings
                    } else if (record.date instanceof Date) {
                        recordDate = record.date.toISOString().split('T')[0];
                    } else {
                        recordDate = new Date(record.date).toISOString().split('T')[0];
                    }
                    console.log('Comparing record date:', recordDate, 'with today:', today);
                    return recordDate === today;
                });
                if (todayRecord) {
                    console.log('Found today\'s record in history:', todayRecord);
                    todayStatus = todayRecord;
                } else {
                    console.log('No record found in history for today');
                }
            }
            
            console.log('Final todayStatus:', todayStatus);
            setTodayStatus(todayStatus);
            setHistory(hist);
        } catch (err) {
            console.error('Error fetching attendance data:', err);
            // Only set error if it's not a "not found" scenario (which is normal for new days)
            if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('Network error')) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleCheckIn = async () => {
        setActionLoading(true);
        setError(null);
        try {
            console.log('=== CHECK-IN ATTEMPT ===');
            const attendanceData = await attendanceService.checkIn(token);
            console.log('Check-in response received:', attendanceData);
            console.log('Response checkIn field:', attendanceData?.checkIn);
            console.log('Response checkIn type:', typeof attendanceData?.checkIn);
            
            // Always update status if we have attendance data
            if (attendanceData) {
                console.log('✅ Setting todayStatus with check-in response');
                // Force update the state immediately
                setTodayStatus(attendanceData);
                setError(null);
                
                // Also update history
                try {
                    const hist = await attendanceService.getHistory(token);
                    setHistory(hist);
                } catch (histErr) {
                    console.error('Failed to refresh history:', histErr);
                }
                
                // Force a refresh after a short delay to ensure data is synced from server
                setTimeout(async () => {
                    try {
                        console.log('Refreshing data after check-in...');
                        await fetchData();
                    } catch (refreshErr) {
                        console.error('Refresh after check-in failed:', refreshErr);
                    }
                }, 300);
            } else {
                console.log('❌ No attendance data in response, doing full refresh');
                await fetchData();
            }
        } catch (err) {
            console.error('Check-in error:', err);
            // If error is "Already checked in", refresh data and don't show error
            if (err.message && err.message.includes('Already checked in')) {
                // Refresh status to show current state
                try {
                    const status = await attendanceService.getTodayStatus(token);
                    console.log('Already checked in, fetched status:', status);
                    setTodayStatus(status);
                    setError(null); // Clear error since we have valid status
                } catch (fetchErr) {
                    console.error('Failed to fetch status after already checked in:', fetchErr);
                    setError(err.message); // Show original error if refresh fails
                }
            } else {
                setError(err.message);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await attendanceService.checkOut(token);
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div>Loading Attendance...</div>;

    // Check if checked in - simplified check that handles all formats
    // checkIn can be: Date object, ISO string, timestamp, or any truthy value
    const hasCheckIn = todayStatus && todayStatus.checkIn !== null && todayStatus.checkIn !== undefined;
    const hasCheckOut = todayStatus && todayStatus.checkOut !== null && todayStatus.checkOut !== undefined;
    
    // Convert to boolean - if checkIn exists (not null/undefined), user is checked in
    const isCheckedIn = Boolean(hasCheckIn);
    const isCheckedOut = Boolean(hasCheckOut);
    
    // Debug log
    console.log('=== ATTENDANCE STATUS DEBUG ===');
    console.log('todayStatus:', todayStatus);
    console.log('checkIn field:', todayStatus?.checkIn);
    console.log('checkIn type:', typeof todayStatus?.checkIn);
    console.log('hasCheckIn:', hasCheckIn);
    console.log('isCheckedIn result:', isCheckedIn);
    console.log('isCheckedOut result:', isCheckedOut);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Attendance</h2>
                <button 
                    onClick={fetchData}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div style={{ background: '#ef444420', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Today's Status Card */}
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} /> Today's Status
                    </h3>

                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: isCheckedIn ? '#22c55e' : 'var(--text-muted)' }}>
                            {isCheckedIn ? (isCheckedOut ? 'Completed' : 'Checked In') : 'Not Checked In'}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        {!isCheckedIn && (
                            <button
                                onClick={handleCheckIn}
                                disabled={actionLoading}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                {actionLoading ? 'Processing...' : 'Check In'}
                            </button>
                        )}

                        {isCheckedIn && !isCheckedOut && (
                            <button
                                onClick={handleCheckOut}
                                disabled={actionLoading}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                {actionLoading ? 'Processing...' : 'Check Out'}
                            </button>
                        )}

                        {isCheckedOut && (
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.875rem' }}>Total Hours: {todayStatus.workingHours} hrs</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats or Info */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Start Time</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                            {isCheckedIn ? new Date(todayStatus.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </p>
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>End Time</p>
                        <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                            {isCheckedOut ? new Date(todayStatus.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> History
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Check In</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Check Out</th>
                                <th style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((record) => (
                                <tr key={record._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            background: record.status === 'PRESENT' ? '#22c55e20' : '#ef444420',
                                            color: record.status === 'PRESENT' ? '#86efac' : '#fca5a5'
                                        }}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td style={{ padding: '1rem' }}>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                                    <td style={{ padding: '1rem' }}>{record.workingHours || '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
