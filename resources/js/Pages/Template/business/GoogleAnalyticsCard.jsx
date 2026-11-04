import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const sample = {
  month: [10, 40, 20, 60, 45, 70],
  week:  [5,  20, 10, 30, 25, 35],
  day:   [3,  4,  2,  6,  5,  8],
};

export default function GoogleAnalyticsCard() {
  const [range, setRange] = useState('month');
  const data = monthLabels.map((label, i) => ({ label, value: sample[range][i] }));

  return (
    <div className="bg-white p-6 flex flex-col" style={{ borderRadius: '12px', height: 465, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="mb-4">
        <p className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Laporan Google Analytic</p>
        <p className="text-sm text-gray-500 mt-0.5">Average</p>

        <div className="mt-4 flex rounded-lg overflow-hidden border border-gray-100 bg-gray-50 text-sm">
          {['month', 'week', 'day'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 text-center px-4 py-2 transition-colors ${range === r ? 'font-medium' : 'text-gray-600'}`}
              style={range === r ? { backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA' } : {}}
            >
              {r === 'month' ? 'Month' : r === 'week' ? 'Week' : 'Day'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[120px]">
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="gaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0152EA" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#0152EA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis hide />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e6eb', fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#0152EA" strokeWidth={2} fill="url(#gaGradient)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 mt-4">
        {[
          { label: 'User Baru',   icon: '👤', value: '+68', bg: 'rgba(1,82,234,0.1)', color: '#0152EA' },
          { label: 'Total User',  icon: '👥', value: '+68', bg: '#f0fdf4',            color: '#10B981' },
          { label: 'Views',       icon: '👥', value: '+68', bg: '#f0fdf4',            color: '#10B981' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md" style={{ backgroundColor: item.bg }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
            </div>
            <span className="text-sm font-medium" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
