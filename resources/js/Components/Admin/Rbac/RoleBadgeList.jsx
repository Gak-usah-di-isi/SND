const ROLE_TONES = [
  { bg: 'rgba(1,82,234,0.1)', color: '#0152EA' },
  { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  { bg: 'rgba(245,158,11,0.12)', color: '#D97706' },
  { bg: 'rgba(139,92,246,0.12)', color: '#7C3AED' },
  { bg: 'rgba(14,165,233,0.12)', color: '#0284C7' },
];

function toneFor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 7)) % 997;
  }
  return ROLE_TONES[hash % ROLE_TONES.length];
}

export default function RoleBadgeList({ roles = [], emptyLabel = 'Belum ada role' }) {
  if (!roles.length) {
    return (
      <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
        {emptyLabel}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {roles.map((role) => {
        const tone = toneFor(role.name);
        return (
          <span
            key={role.id ?? role.name}
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: tone.bg, color: tone.color, fontFamily: 'Manrope,sans-serif' }}
          >
            {role.display_name || role.name}
          </span>
        );
      })}
    </div>
  );
}
