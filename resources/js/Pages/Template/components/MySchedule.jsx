import { Card } from '../../../Components/ui/card';
import { Button } from '../../../Components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../Components/ui/avatar';

const scheduleData = [
  { id: '1', time: '10:30am', patient: { name: 'Chris Evans', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '2', time: '11:00am', patient: { name: 'Evelyn Pope', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '3', time: '11:30am', patient: { name: 'Michael Doe', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '4', time: '12:00pm', patient: { name: 'Melinda', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '5', time: '12:00pm', patient: { name: 'Melinda', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '6', time: '12:00pm', patient: { name: 'Melinda', phone: '083672834764' }, service: 'Facial, botox' },
  { id: '7', time: '12:30pm', patient: { name: 'Michael Doe', phone: '083672834764' }, service: 'Facial, botox' },
];

export default function MySchedule() {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Jadwal Saya</h2>
          <p className="text-sm text-gray-500">Jadwal berdasarkan dokter</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm px-4 py-2">
          Lihat Jadwal Lengkap
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 pb-2 border-b border-gray-100">
          <div>Jam</div>
          <div>Pasien</div>
          <div>Layanan</div>
        </div>
        {scheduleData.map((item) => (
          <div key={item.id} className="grid grid-cols-3 gap-4 py-2">
            <div className="text-sm text-gray-900">{item.time}</div>
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={`https://picsum.photos/seed/${item.id}/200`} alt={item.patient.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  {item.patient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.patient.name}</p>
                <p className="text-xs text-gray-500">{item.patient.phone}</p>
              </div>
            </div>
            <div className="text-sm text-gray-900">{item.service}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
