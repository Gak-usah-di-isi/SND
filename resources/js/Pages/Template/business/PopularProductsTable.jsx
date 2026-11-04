import { useState } from 'react';
import MonthSelect from '../../../Components/ui/month-select';

const rows = [
  { city: 'Jakarta',  session: '16,354', views: '164,354' },
  { city: 'Malang',   session: '13,423', views: '105,354' },
  { city: 'Surabaya', session: '12,342', views: '92,354'  },
  { city: 'Bali',     session: '9,933',  views: '80,354'  },
  { city: 'Sidoarjo', session: '9,933',  views: '80,354'  },
];

const months = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return names.map((n, i) => ({ value: `${i}-${year}`, label: `${n} ${year}` }));
})();

export default function PopularProductsTable() {
  const [month, setMonth] = useState(`${new Date().getMonth()}-${new Date().getFullYear()}`);

  return (
    <div className="bg-white p-6" style={{ borderRadius: '12px', height: 465, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Produk Populer</p>
          <p className="text-sm text-gray-500 mt-0.5">Produk</p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelect value={month} onChange={setMonth} options={months} />
          <button className="px-3 py-1.5 text-sm font-medium text-white" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            Penjualan Produk
          </button>
        </div>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3 font-semibold text-gray-700 text-sm">Kota</th>
            <th className="py-3 font-semibold text-gray-700 text-sm text-center">Session</th>
            <th className="py-3 font-semibold text-gray-700 text-sm text-right">Views</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.city} className="border-b border-gray-100 last:border-0">
              <td className="py-4 text-sm text-gray-700">{r.city}</td>
              <td className="py-4 text-sm text-gray-600 text-center">{r.session}</td>
              <td className="py-4 text-sm text-gray-600 text-right">{r.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
