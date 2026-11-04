const doctors = [
  { name: 'Sunil Joshi', shift: 'Pagi' },
  { name: 'John Doe',    shift: 'Siang' },
  { name: 'Nirav Joshi', shift: 'Siang' },
  { name: 'Yuvraj Sheth',shift: 'Pagi' },
  { name: 'Micheal Doe', shift: 'Pagi' },
  { name: 'Micheal Doe', shift: 'Pagi' },
  { name: 'Micheal Doe', shift: 'Pagi' },
];

const shiftStyle = {
  Pagi:  { bg: 'rgba(1,82,234,0.08)',  color: '#0152EA' },
  Siang: { bg: 'rgba(19,222,185,0.1)', color: '#10B981' },
};

export default function DoctorScheduleCard() {
  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: '12px', boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold text-gray-800" style={{ fontSize: 18 }}>Dokter</div>
          <div className="text-sm text-gray-500 mt-0.5">Sedang bertugas hari ini</div>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#0152EA', borderRadius: '9px' }}>
          Buat Janji
        </button>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-h-[420px] overflow-y-auto">
          {doctors.map((d, i) => {
            const s = shiftStyle[d.shift] ?? shiftStyle.Pagi;
            return (
              <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                    {d.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{d.name}</div>
                  </div>
                </div>
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {d.shift}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
