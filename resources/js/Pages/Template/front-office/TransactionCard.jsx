import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sample = {
  bulan: {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept'],
    produk:    [10, 20, 80, 60, 30, 45],
    treatment: [5,  10, 20, 40, 25, 35],
  },
  minggu: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    produk:    [5, 12, 18, 9],
    treatment: [2,  6, 12, 7],
  },
  hari: {
    labels: ['6am', '9am', '12pm', '3pm'],
    produk:    [3, 6, 8, 2],
    treatment: [1, 2, 4, 1],
  },
};

export default function TransactionCard() {
  const [range, setRange] = useState('bulan');
  const d = sample[range];
  const chartData = d.labels.map((label, i) => ({ label, produk: d.produk[i], treatment: d.treatment[i] }));

  return (
    <div className="bg-white flex flex-row gap-2" style={{ borderRadius: '12px', padding: '25px 30px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex flex-col gap-6 shrink-0">
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Jumlah Transaksi</p>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden text-sm">
            {['hari', 'minggu', 'bulan'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 transition-colors ${range === r ? 'font-medium' : 'text-gray-600'}`}
                style={range === r ? { backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA' } : {}}
              >
                {r === 'hari' ? 'Hari ini' : r === 'minggu' ? 'Minggu ini' : 'Bulan ini'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0152EA' }} />
              <span className="text-sm text-gray-500">Produk</span>
            </div>
            <p className="font-semibold text-gray-800 pl-1" style={{ fontSize: 28 }}>30</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <span className="text-sm text-gray-500">Treatment</span>
            </div>
            <p className="font-semibold text-gray-800 pl-1" style={{ fontSize: 28 }}>100</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e6eb', fontSize: 12 }} />
            <Bar dataKey="produk" fill="#0152EA" radius={[4, 4, 0, 0]} />
            <Bar dataKey="treatment" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
