
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-right">
      <div className="flex items-center justify-between flex-row-reverse mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</span>
        {icon && <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between flex-row-reverse">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
