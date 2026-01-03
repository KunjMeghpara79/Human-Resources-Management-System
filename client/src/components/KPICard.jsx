import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:border-indigo-500/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.includes('indigo') ? 'text-indigo-400' : color.includes('green') ? 'text-green-400' : color.includes('yellow') ? 'text-yellow-400' : 'text-purple-400'}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-sm text-slate-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;

