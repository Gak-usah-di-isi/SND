import { Clock } from 'lucide-react';
import { Card } from '../../../Components/ui/card';

export default function MyConsultationTime() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <h3 className="text-gray-600 text-sm font-medium mb-2">Rata-rata Waktu Konsultasi</h3>
      <p className="text-2xl font-bold text-blue-600 mb-1">20 Menit</p>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-500">Efisien dari target 25 menit</span>
      </div>
    </Card>
  );
}
