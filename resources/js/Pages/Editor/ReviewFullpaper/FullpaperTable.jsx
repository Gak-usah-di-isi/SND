import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { DataTable } from '../../../Components/ui/DataTable';
import StatusBadge from '../../../Components/ui/StatusBadge';

/* ---------- Avatar Initial — sama dengan EmailBadge di Admin/Abstract/Index.jsx ---------- */
function EmailBadge({ email }) {
  const initial = (email ?? '').split('@')[0].slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0152EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Manrope,sans-serif' }}>{initial}</span>
    </div>
  );
}

/* ---------- Link download file — sama pola dengan expanded row di Admin/Abstract/Index.jsx ---------- */
function FileLink({ href, label, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="flex flex-col items-center gap-1" style={{ color, textDecoration: 'none' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><path d="M12 18v-6M9 15l3 3 3-3" />
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Manrope,sans-serif' }}>{label}</span>
    </a>
  );
}

function FullpaperRow({ item, showAction }) {
  const [open, setOpen] = useState(false);
  const abstract = item.abstract ?? {};
  const titleWords = (abstract.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');
  const hasFile = item.file_path || item.revised_file_path;

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-3 py-4 w-10">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: open ? '#F0F5FF' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#0152EA' : '#6B7280', transition: 'all 150ms' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </td>
        <td className="px-4 py-4" style={{ maxWidth: 320 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={abstract.title}>
            {shortTitle || '-'}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2.5">
            <EmailBadge email={abstract.corresponding_email} />
            <div className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {(abstract.corresponding_email ?? '').split('@')[0]}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                {abstract.corresponding_email}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <span style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>
            {abstract.presentation_type ?? '-'}
          </span>
        </td>
        <td className="px-4 py-4">
          {hasFile ? (
            <div className="flex gap-3">
              {item.file_path && (
                <FileLink href={`/storage/${item.file_path}`} label="Submitted" color="#0152EA" />
              )}
              {item.revised_file_path && (
                <FileLink href={`/storage/${item.revised_file_path}`} label="Revised" color="#D97706" />
              )}
            </div>
          ) : (
            <span style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>No file available</span>
          )}
        </td>
        <td className="px-4 py-4">
          <StatusBadge label={item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'} />
        </td>
        {showAction && (
          <td className="px-4 py-4">
            <div className="flex items-center justify-end">
              <Link
                href={`/reviewer/review-fullpaper/${item.id}`}
                className="inline-flex items-center gap-1.5 transition-colors"
                style={{
                  height: 32, padding: '0 14px', borderRadius: 8,
                  fontSize: 12.5, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                  color: '#0152EA', border: '1px solid rgba(1,82,234,0.3)',
                  background: 'rgba(1,82,234,0.04)', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(1,82,234,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(1,82,234,0.04)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Review
              </Link>
            </div>
          </td>
        )}
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={showAction ? 6 : 5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Title</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.title ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Symposium</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.symposium?.name ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Authors</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.authors ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Publication</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.publication ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Affiliations</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{abstract.affiliations ?? '-'}</p>
              </div>
              {item.note && (
                <div>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Note</span>
                  <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.note}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * Tabel full paper untuk role editor/reviewer — struktur sama dengan
 * AbstractTable di Editor/ReviewAbstract, dengan tambahan kolom File.
 * @param {boolean} showAction - tampilkan kolom aksi "Review"
 */
export default function FullpaperTable({ fullPapers = [], showAction = false, emptyText }) {
  const columns = [
    { key: 'toggle', label: '' },
    { key: 'title', label: 'Title' },
    { key: 'correspondent', label: 'Correspondent' },
    { key: 'type', label: 'Presentation' },
    { key: 'file', label: 'File' },
    { key: 'status', label: 'Status' },
    ...(showAction ? [{ key: 'action', label: '' }] : []),
  ];

  return (
    <DataTable
      columns={columns}
      empty={<p className="font-medium text-gray-500">{emptyText}</p>}
    >
      {fullPapers.map(item => (
        <FullpaperRow key={item.id} item={item} showAction={showAction} />
      ))}
    </DataTable>
  );
}
