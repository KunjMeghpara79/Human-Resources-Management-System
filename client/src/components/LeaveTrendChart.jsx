import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeaveTrendChart = ({ data = [] }) => {
  // Sample data structure: [{ month: 'Jan', approved: 12, pending: 5, rejected: 2 }]
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', approved: 12, pending: 5, rejected: 2 },
    { month: 'Feb', approved: 15, pending: 3, rejected: 1 },
    { month: 'Mar', approved: 18, pending: 4, rejected: 3 },
    { month: 'Apr', approved: 10, pending: 6, rejected: 2 },
    { month: 'May', approved: 20, pending: 2, rejected: 1 },
    { month: 'Jun', approved: 14, pending: 5, rejected: 3 },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Leave Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="approved"
            stroke="#10b981"
            strokeWidth={2}
            name="Approved"
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Pending"
          />
          <Line
            type="monotone"
            dataKey="rejected"
            stroke="#ef4444"
            strokeWidth={2}
            name="Rejected"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveTrendChart;

