import { useState } from 'react';
import MonthSelect from '../../../Components/ui/month-select';

const doctors = [
  { id: '1', name: 'Sunil Joshi',  specialty: 'Ahli bedah', count: 100 },
  { id: '2', name: 'John Doe',     specialty: 'Kecantikan', count: 80  },
  { id: '3', name: 'Nirav Joshi',  specialty: 'Kecantikan', count: 42  },
  { id: '4', name: 'Yuvraj Sheth', specialty: 'Kecantikan', count: 33  },
];

const months = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return names.map((n, i) => ({ value: `${i}-${year}`, label: `${n} ${year}` }));
})();

function initials(name) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('');
}

export default function TopDoctor() {
  const [month, setMonth] = useState(`${new Date().getMonth()}-${new Date().getFullYear()}`);

  return (
    <div className="bg-white p-6 flex flex-col" style={{ borderRadius: '12px', height: 405, boxShadow: '0px 6px 18px rgba(29,36,60,0.04)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-gray-800" style={{ fontSize: 18 }}>Top Dokter</p>
          <p className="text-sm text-gray-500 mt-0.5">Pasien terbanyak</p>
        </div>
        <MonthSelect value={month} onChange={setMonth} options={months} />
      </div>

      <div className="flex items-center justify-between px-1.5 mb-2">
        <span className="font-semibold text-gray-700 text-sm">Dokter</span>
        <span className="font-semibold text-gray-700 text-sm">Jumlah Pasien</span>
      </div>
      <div className="border-t border-gray-100" />

      <div className="flex-1 overflow-y-auto mt-1">
        {doctors.map((d, idx) => (
          <div
            key={d.id}
            className="flex items-center py-4 px-1"
            style={{ borderBottom: idx < doctors.length - 1 ? '1px solid #f3f3f4' : 'none' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-3 flex-shrink-0" style={{ backgroundColor: '#0152EA' }}>
              {initials(d.name)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-sm">{d.name}</div>
              <div className="text-xs text-gray-500">{d.specialty}</div>
            </div>
            <span className="inline-block px-3 py-1 text-xs font-medium text-white rounded-full mr-7" style={{ backgroundColor: '#49BEFF' }}>
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
