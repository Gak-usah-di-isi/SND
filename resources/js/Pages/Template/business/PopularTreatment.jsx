import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Bank Transfer', value: 30, color: '#0B5FFF' },
  { name: 'Qris',          value: 40, color: '#66C3FF' },
  { name: 'Cash',          value: 20, color: '#24D39A' },
  { name: 'Credit Card',   value: 10, color: '#FFB33A' },
];

export default function PopularTreatment() {
  return (
    <div className="bg-white p-5 flex items-center justify-between gap-4" style={{ borderRadius: '12px', height: 254, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="flex flex-col gap-5 justify-center">
        <div>
          <p className="font-bold text-gray-800" style={{ fontSize: 16 }}>Metode Pembayaran</p>
          <p className="text-sm text-gray-500 mt-0.5">Metode yang paling sering digunakan</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0">
        <PieChart width={160} height={160}>
          <Pie data={data} cx={75} cy={75} innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={0}>
            {data.map((item, i) => <Cell key={i} fill={item.color} />)}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}
