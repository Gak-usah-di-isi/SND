import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const statusStyles = {
  Berlangsung: { bg: 'rgba(1,82,234,0.1)', color: '#0152EA' },
  Tiba:        { bg: 'rgba(255,174,31,0.1)', color: '#F59E0B' },
  Dijadwalkan: { bg: 'rgba(19,222,185,0.1)', color: '#10B981' },
};

const rows = [
  { time: '10:30am', name: 'Chris Evans',  phone: '083672834764', service: 'Facial, botox', status: 'Berlangsung' },
  { time: '11:00am', name: 'Evelyn Pope',  phone: '083672834764', service: 'Facial, botox', status: 'Tiba' },
  { time: '11:30am', name: 'Michael Doe',  phone: '083672834764', service: 'Facial, botox', status: 'Dijadwalkan' },
  { time: '12:00pm', name: 'Melinda',      phone: '083672834764', service: 'Facial, botox', status: 'Dijadwalkan' },
  { time: '12:30pm', name: 'Micheal Doe',  phone: '083672834764', service: 'Facial, botox', status: 'Tiba' },
];

export default function ScheduleTable() {
  const [date, setDate] = useState(new Date(2025, 5, 12));

  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const prev = () => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const next = () => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Jadwal Klinik</div>
          <div className="text-sm text-gray-500 mt-0.5">Jadwal dan booking yang masuk</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={prev} className="flex items-center justify-center border border-gray-200 rounded-md" style={{ width: 40, height: 40 }}>
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <div className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700">{fmt(date)}</div>
          <button onClick={next} className="flex items-center justify-center border border-gray-200 rounded-md" style={{ width: 40, height: 40 }}>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
          <button className="ml-2 px-4 py-2 text-sm font-medium text-white rounded-md" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
            Lihat Jadwal Lengkap
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm border-y border-gray-200">
                <th className="py-4 font-medium text-gray-500 w-24">Jam</th>
                <th className="py-4 font-medium text-gray-500">Pasien</th>
                <th className="py-4 font-medium text-gray-500">Layanan</th>
                <th className="py-4 font-medium text-gray-500 w-36">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const s = statusStyles[r.status] ?? statusStyles.Dijadwalkan;
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-5 text-sm text-gray-600">{r.time}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                          {r.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
                          <div className="text-xs text-gray-500">{r.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-sm text-gray-600">{r.service}</td>
                    <td className="py-5">
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
