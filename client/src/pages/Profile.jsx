import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../api/user';

const Profile = () => {
    const { token, login } = useAuth(); // login used here to update local user state if needed
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        jobTitle: '',
        department: '',
        joiningDate: '',
        role: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile(token);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    jobTitle: data.jobTitle || '',
                    department: data.department || '',
                    joiningDate: data.joiningDate ? new Date(data.joiningDate).toLocaleDateString() : '',
                    role: data.role || ''
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const updatedUser = await userService.updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            }, token);

            // Update locally if needed, though we might rely on the form state
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Profile</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                        Edit Profile
                    </button>
                )}
            </div>

            {error && <div style={{ background: '#ef444420', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ background: '#22c55e20', color: '#86efac', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Personal Details */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary)' }}>Personal Details</h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={!isEditing ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={!isEditing ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="input-field"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={!isEditing ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                                    placeholder={isEditing ? "Enter phone number" : "Not set"}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Address</label>
                                <textarea
                                    name="address"
                                    className="input-field"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    style={{ minHeight: '100px', ...(!isEditing ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                                    placeholder={isEditing ? "Enter address" : "Not set"}
                                />
                            </div>
                        </div>

                        {/* Job Details (Read Only) */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--secondary)' }}>Job Details</h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Role</label>
                                <div className="input-field" style={{ opacity: 0.7, cursor: 'not-allowed' }}>{formData.role}</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Department</label>
                                <div className="input-field" style={{ opacity: 0.7, cursor: 'not-allowed' }}>{formData.department || 'Not Assigned'}</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Job Title</label>
                                <div className="input-field" style={{ opacity: 0.7, cursor: 'not-allowed' }}>{formData.jobTitle || 'Not Assigned'}</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Joining Date</label>
                                <div className="input-field" style={{ opacity: 0.7, cursor: 'not-allowed' }}>{formData.joiningDate || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
