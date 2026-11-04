export default function CountingCard({ label, value, color = 'blue', className = '' }) {
  const mapping = {
    blue:   { bg: 'rgba(93,135,255,0.1)',  color: '#0152EA', avatarSrc: '/images/person-blue.png' },
    green:  { bg: 'rgba(19,222,185,0.1)',  color: '#10B981', avatarSrc: '/images/person-green.png' },
    orange: { bg: 'rgba(255,174,31,0.1)',  color: '#F59E0B', avatarSrc: '/images/person-orange.png' },
  };
  const m = mapping[color] ?? mapping.blue;

  return (
    <div
      className={`flex items-center p-5 ${className}`}
      style={{ backgroundColor: m.bg, height: 132, borderRadius: '8px' }}
    >
      <div className="flex items-center gap-4">
        <img
          src={m.avatarSrc}
          alt={label}
          className="w-16 h-16 object-contain flex-shrink-0"
        />
        <div>
          <p className="font-bold" style={{ fontSize: 18, color: m.color }}>{label}</p>
          <p className="font-bold mt-1" style={{ fontSize: 32, color: m.color, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}
