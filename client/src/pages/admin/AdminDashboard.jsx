import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, FileText, AlertCircle, TrendingUp, Clock, 
  DollarSign, Calendar, Activity, ArrowUpRight 
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import AttendanceHeatMap from '../../components/AttendanceHeatMap';
import LeaveTrendChart from '../../components/LeaveTrendChart';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      // Replace with actual API call
      return {
        totalEmployees: 124,
        onLeaveToday: 8,
        pendingApprovals: 12,
        attendanceRate: 94.5,
        monthlyPayroll: 245000,
        activeProjects: 15
      };
    }
  });

  useEffect(() => {
    // Fetch attendance data for heat map
    // Replace with actual API call
    const mockAttendance = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      return {
        date: date.toISOString().split('T')[0],
        status: ['PRESENT', 'PRESENT', 'ABSENT', 'LEAVE', 'PRESENT'][Math.floor(Math.random() * 5)]
      };
    });
    setAttendanceData(mockAttendance);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="text-sm text-slate-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Employees"
          value={dashboardData?.totalEmployees || 0}
          icon={Users}
          color="from-indigo-500 to-indigo-600"
          trend={5.2}
        />
        <KPICard
          title="On Leave Today"
          value={dashboardData?.onLeaveToday || 0}
          icon={Calendar}
          color="from-yellow-500 to-yellow-600"
        />
        <KPICard
          title="Pending Approvals"
          value={dashboardData?.pendingApprovals || 0}
          icon={FileText}
          color="from-orange-500 to-orange-600"
        />
        <KPICard
          title="Attendance Rate"
          value={`${dashboardData?.attendanceRate || 0}%`}
          icon={Clock}
          color="from-green-500 to-green-600"
          trend={2.1}
        />
        <KPICard
          title="Monthly Payroll"
          value={`$${(dashboardData?.monthlyPayroll || 0).toLocaleString()}`}
          icon={DollarSign}
          color="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Active Projects"
          value={dashboardData?.activeProjects || 0}
          icon={Activity}
          color="from-blue-500 to-blue-600"
        />
      </div>

      {/* Charts and Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceHeatMap attendanceData={attendanceData} />
        <LeaveTrendChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'submitted a leave request', time: '5 min ago' },
              { user: 'Jane Smith', action: 'checked in', time: '15 min ago' },
              { user: 'Mike Johnson', action: 'updated profile', time: '1 hour ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-4 border-b border-slate-700 last:border-0">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-slate-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-colors text-left">
              <Users className="w-6 h-6 text-indigo-400 mb-2" />
              <p className="text-sm font-medium">Add Employee</p>
            </button>
            <button className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 transition-colors text-left">
              <FileText className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-sm font-medium">Generate Report</p>
            </button>
            <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 transition-colors text-left">
              <Calendar className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-sm font-medium">View Calendar</p>
            </button>
            <button className="p-4 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg border border-yellow-500/20 transition-colors text-left">
              <TrendingUp className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-sm font-medium">Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
