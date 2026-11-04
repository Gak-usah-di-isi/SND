export default function MetricCard({ label, value, color = 'blue', icon, className = '' }) {
  const mapping = {
    blue:   { bg: 'rgba(93,135,255,0.1)',  color: '#1E40AF', iconBg: '#3B82F6' },
    green:  { bg: 'rgba(19,222,185,0.1)',  color: '#059669', iconBg: '#10B981' },
    purple: { bg: 'rgba(168,85,247,0.1)', color: '#7C3AED', iconBg: '#A855F7' },
  };
  const m = mapping[color] ?? mapping.blue;

  return (
    <div
      className={`flex items-center p-5 ${className}`}
      style={{ backgroundColor: m.bg, height: 132, borderRadius: '8px' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: m.iconBg }}
        >
          {icon}
        </div>
        <div>
          <p className="font-medium" style={{ fontSize: 16, color: m.color }}>{label}</p>
          <p className="font-bold mt-1" style={{ fontSize: 32, color: m.color, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}
