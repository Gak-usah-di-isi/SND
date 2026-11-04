export default function InitialBadge({ label = '' }) {
  const initial = label.trim().charAt(0).toUpperCase();

  return (
    <div
      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(1,82,234,0.08)' }}
      aria-label={label}
      title={label}
    >
      <span className="text-xs font-bold" style={{ color: '#0152EA' }}>
        {initial || '-'}
      </span>
    </div>
  );
}
