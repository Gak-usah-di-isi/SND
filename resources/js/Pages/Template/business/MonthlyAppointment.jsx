import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { label: 'Apr',  produk: 10, treatment: 5  },
  { label: 'May',  produk: 20, treatment: 10 },
  { label: 'Jun',  produk: 80, treatment: 20 },
  { label: 'Jul',  produk: 60, treatment: 40 },
  { label: 'Aug',  produk: 30, treatment: 25 },
  { label: 'Sept', produk: 45, treatment: 35 },
];

export default function MonthlyAppointment() {
  return (
    <div className="bg-white flex flex-row gap-2" style={{ borderRadius: '12px', height: 254, padding: '25px 30px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex flex-col justify-between shrink-0 gap-4">
        <p className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Jumlah Appointment Bulanan</p>

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

        <button className="px-4 py-2 text-sm font-medium text-white text-left" style={{ backgroundColor: '#0152EA', borderRadius: '9px', width: 157 }}>
          Daftar Transaksi
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barCategoryGap="30%" margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
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
