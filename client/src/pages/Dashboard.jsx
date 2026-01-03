import { useAuth } from '../context/AuthContext';
import EmployeeDashboard from './employee/EmployeeDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'ADMIN' || user?.role === 'HR') {
        return <AdminDashboard />;
    }

    return <EmployeeDashboard user={user} />;
};

export default Dashboard;
