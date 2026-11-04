import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, ResponsiveContainer, CartesianGrid } from 'recharts';
import MonthSelect from '../../../Components/ui/month-select';

const data = [
  { date: '16/03', product: 200,  treatment: 800  },
  { date: '17/03', product: 100,  treatment: 900  },
  { date: '18/03', product: 150,  treatment: 1200 },
  { date: '19/03', product: 700,  treatment: 2800 },
  { date: '20/03', product: 200,  treatment: 2000 },
  { date: '21/03', product: 450,  treatment: 2500 },
  { date: '22/03', product: 900,  treatment: 3200 },
];

const months = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return names.map((n, i) => ({ value: `${i}-${year}`, label: `${n} ${year}` }));
})();

export default function OmzetTrendCard({ title = 'Omzet Trend' }) {
  const [month, setMonth] = useState(`${new Date().getMonth()}-${new Date().getFullYear()}`);

  return (
    <div className="bg-white p-6" style={{ borderRadius: '12px', height: 405, boxShadow: '0px 6px 18px rgba(29,36,60,0.04)' }}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className="font-bold text-gray-800" style={{ fontSize: 18 }}>{title}</p>
          <p className="text-sm text-gray-500 mt-0.5">Laporan harian pemasukan klinik</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0A62FF' }} />
              <span className="text-xs text-gray-500">Produk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#7ED1FF' }} />
              <span className="text-xs text-gray-500">Treatment</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelect value={month} onChange={setMonth} options={months} />
          <button className="px-3 py-1.5 text-sm font-medium text-white" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            Laporan Penjualan
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <defs>
            <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E7AFF" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#0E7AFF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 4000]} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e6eb', fontSize: 12 }} />
          <Area type="monotone" dataKey="treatment" stroke="#7ED1FF" strokeWidth={3} fill="url(#omzetGradient)" dot={false} />
          <Line type="monotone" dataKey="product" stroke="#0A62FF" strokeWidth={3} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
