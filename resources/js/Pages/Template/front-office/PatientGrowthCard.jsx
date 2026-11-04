import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const sample = {
  month: [10, 40, 20, 60, 45, 70],
  week:  [5,  20, 10, 30, 25, 35],
  day:   [3,  4,  2,  6,  5,  8],
};

export default function PatientGrowthCard() {
  const [range, setRange] = useState('month');

  const data = monthLabels.map((label, i) => ({ label, value: sample[range][i] }));

  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="mb-4">
        <div className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Pertumbuhan Pasien</div>
        <div className="text-sm text-gray-500 mt-0.5">Rata-rata pasien datang</div>

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

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="pgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0152EA" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#0152EA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e6eb', fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="#0152EA" strokeWidth={2} fill="url(#pgGradient)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md" style={{ backgroundColor: 'rgba(1,82,234,0.1)' }}>
              <span style={{ fontSize: 16 }}>👤</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Pasien Baru</span>
          </div>
          <span className="text-sm font-medium" style={{ color: '#0152EA' }}>+68</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-green-50">
              <span style={{ fontSize: 16 }}>👥</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Pasien Repeat</span>
          </div>
          <span className="text-sm font-medium text-green-500">+68</span>
        </div>
      </div>
    </div>
  );
}
