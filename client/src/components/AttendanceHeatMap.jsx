import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

const AttendanceHeatMap = ({ attendanceData = [] }) => {
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = attendanceData.find(a => a.date === dateStr);
    if (!record) return 'none';
    if (record.status === 'PRESENT') return 'present';
    if (record.status === 'ABSENT') return 'absent';
    if (record.status === 'LEAVE') return 'leave';
    return 'half';
  };

  const getColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'leave':
        return 'bg-blue-500';
      case 'half':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-700';
    }
  };

  const getTooltip = (date, status) => {
    const dateStr = format(date, 'MMM dd, yyyy');
    const statusLabels = {
      present: 'Present',
      absent: 'Absent',
      leave: 'On Leave',
      half: 'Half Day',
      none: 'No Record'
    };
    return `${dateStr}: ${statusLabels[status]}`;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Attendance Heat Map</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-slate-400 font-medium py-2">
            {day}
          </div>
        ))}
        {daysInMonth.map((date, idx) => {
          const status = getAttendanceStatus(date);
          const dayOfWeek = date.getDay();
          const isToday = isSameDay(date, currentDate);
          
          return (
            <div
              key={idx}
              className={`aspect-square rounded-lg ${getColor(status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group ${
                dayOfWeek === 0 || dayOfWeek === 6 ? 'opacity-60' : ''
              } ${isToday ? 'ring-2 ring-indigo-400' : ''}`}
              title={getTooltip(date, status)}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-slate-400">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-slate-400">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-slate-400">Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-700"></div>
          <span className="text-slate-400">No Record</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatMap;

