import { Star } from 'lucide-react';
import { Card } from '../../../Components/ui/card';
import { Badge } from '../../../Components/ui/badge';
import { Button } from '../../../Components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../Components/ui/avatar';

const feedbackData = [
  {
    id: '1',
    patient: { name: 'Roman' },
    rating: 5,
    comment: 'Saya sangat menyukai perawatannya! Kulit saya terasa lebih halus, lebih cerah, dan segar. Stafnya ramah dan profesional.',
  },
  {
    id: '2',
    patient: { name: 'Roman' },
    rating: 4,
    comment: 'Saya sangat menyukai perawatannya! Kulit saya terasa lebih halus, lebih cerah, dan segar. Stafnya ramah dan profesional.',
  },
  {
    id: '3',
    patient: { name: 'Roman' },
    rating: 4,
    comment: 'Saya sangat menyukai perawatannya! Kulit saya terasa lebih halus, lebih cerah, dan segar. Stafnya ramah dan profesional.',
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function MyFeedback() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Feedback Pasien</h3>
        <Badge className="bg-blue-100 text-blue-600 border-0">5 New</Badge>
      </div>

      <div className="space-y-4">
        {feedbackData.map((feedback) => (
          <div key={feedback.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`https://picsum.photos/seed/fb${feedback.id}/200`} alt={feedback.patient.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                {feedback.patient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">{feedback.patient.name}</p>
              <StarRating rating={feedback.rating} />
              <p className="text-xs text-gray-600 leading-relaxed mt-1">{feedback.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">
        Lihat semua feedback
      </Button>
    </Card>
  );
}
