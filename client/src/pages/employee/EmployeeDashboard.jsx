import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, FileText, Clock, TrendingUp, CheckCircle2,
  AlertCircle, DollarSign, Award
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import AttendanceHeatMap from '../../components/AttendanceHeatMap';
import LeaveTrendChart from '../../components/LeaveTrendChart';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = ({ user }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  // Fetch employee dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['employeeDashboard'],
    queryFn: async () => {
      // Replace with actual API call
      return {
        attendanceRate: 95.5,
        leaveBalance: 12,
        pendingRequests: 2,
        thisMonthHours: 160,
        performanceScore: 88,
        nextPayroll: 4500
      };
    }
  });

  useEffect(() => {
    // Fetch attendance data for heat map
    const mockAttendance = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      return {
        date: date.toISOString().split('T')[0],
        status: Math.random() > 0.2 ? 'PRESENT' : 'ABSENT'
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
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 mt-1">Here's your overview for today</p>
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
          title="Attendance Rate"
          value={`${dashboardData?.attendanceRate || 0}%`}
          icon={Clock}
          color="from-green-500 to-green-600"
          trend={2.5}
        />
        <KPICard
          title="Leave Balance"
          value={`${dashboardData?.leaveBalance || 0} Days`}
          icon={Calendar}
          color="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Pending Requests"
          value={dashboardData?.pendingRequests || 0}
          icon={FileText}
          color="from-yellow-500 to-yellow-600"
        />
        <KPICard
          title="This Month Hours"
          value={`${dashboardData?.thisMonthHours || 0}h`}
          icon={TrendingUp}
          color="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Performance Score"
          value={`${dashboardData?.performanceScore || 0}%`}
          icon={Award}
          color="from-indigo-500 to-indigo-600"
        />
        <KPICard
          title="Next Payroll"
          value={`$${dashboardData?.nextPayroll || 0}`}
          icon={DollarSign}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Charts and Heat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceHeatMap attendanceData={attendanceData} />
        <LeaveTrendChart />
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, text: 'Checked in at 9:15 AM', time: 'Today', color: 'text-green-400' },
              { icon: FileText, text: 'Leave request approved', time: 'Yesterday', color: 'text-blue-400' },
              { icon: DollarSign, text: 'Payroll processed', time: '2 days ago', color: 'text-purple-400' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-4 border-b border-slate-700 last:border-0">
                <div className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { title: 'Performance Review', date: 'Dec 20, 2024', type: 'review' },
              { title: 'Team Meeting', date: 'Dec 18, 2024', type: 'meeting' },
              { title: 'Holiday - Christmas', date: 'Dec 25, 2024', type: 'holiday' },
            ].map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-4 border-b border-slate-700 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'review' ? 'bg-indigo-400' : 
                  event.type === 'meeting' ? 'bg-blue-400' : 'bg-green-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
