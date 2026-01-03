import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, FileText, DollarSign, LogOut, 
  TrendingUp, Settings, Briefcase } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/profile', icon: Users, label: 'Profile' },
        { path: '/attendance', icon: Calendar, label: 'Attendance' },
        { path: '/leave', icon: FileText, label: 'Leave' },
        { path: '/payroll', icon: DollarSign, label: 'Payroll' },
    ];

    // Add admin-only routes
    if (user?.role === 'ADMIN' || user?.role === 'HR') {
        navItems.push(
            { path: '/performance', icon: TrendingUp, label: 'Performance' },
            { path: '/settings', icon: Settings, label: 'Settings' }
        );
    }

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Dayflow
                    </h1>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                                active
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-700 p-4 space-y-3">
                <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                    </div>
                </div>
                
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
