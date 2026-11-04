const VARIANTS = {
  // hijau
  aktif:     { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  active:    { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  selesai:   { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  berhasil:  { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  accepted:  { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  lunas:     { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  verified:  { bg: 'rgba(19,222,185,0.1)',  color: '#10B981' },
  // kuning
  draft:     { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  revision:  { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  open:      { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  gold:      { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  // cyan
  'under review': { bg: 'rgba(73,190,255,0.12)', color: '#0EA5E9' },
  // merah
  nonaktif:       { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  inactive:       { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  rejected:       { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  gagal:          { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  'not yet paid': { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
  // biru
  silver:    { bg: 'rgba(93,135,255,0.1)',  color: '#1E40AF' },
  // abu
  bronze:    { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

const DEFAULT = { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' };

export default function StatusBadge({ label = 'Active' }) {
  const key = (label ?? '').toLowerCase();
  const { bg, color } = VARIANTS[key] ?? DEFAULT;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'Manrope, sans-serif',
        backgroundColor: bg,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
