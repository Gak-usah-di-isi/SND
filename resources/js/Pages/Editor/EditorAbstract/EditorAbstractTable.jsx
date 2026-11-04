import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { DataTable } from '../../../Components/ui/DataTable';
import { TablePagination } from '../../../Components/ui/TablePagination';
import EditorToolbar from '../EditorToolbar';
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

/* Tombol aksi bergaya tinted/outlined — pola yang sama dipakai di Admin/RegenerateCertificate */
function ActionLink({ href, label, color, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 transition-colors"
      style={{
        height: 30, padding: '0 12px', borderRadius: 8,
        fontSize: 12, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
        color, border: `1px solid ${color}4D`, background: `${color}0A`,
        textDecoration: 'none', whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}1A`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}0A`; }}
    >
      {children}
      {label}
    </Link>
  );
}

const ICON_ASSIGN = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" />
  </svg>
);

const ICON_EDIT = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z" />
  </svg>
);

function AbstractRow({ item, showAssign, showReviews, colSpan }) {
  const [open, setOpen] = useState(false);
  const titleWords = (item.title ?? '').split(' ');
  const shortTitle = titleWords.slice(0, 8).join(' ') + (titleWords.length > 8 ? '...' : '');
  const reviews = item.abstract_reviews ?? [];

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-3 py-4 w-10 align-top">
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
        <td className="px-4 py-4 align-top" style={{ maxWidth: 280 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', lineHeight: 1.4 }} title={item.title}>
            {shortTitle}
          </span>
        </td>
        <td className="px-4 py-4 align-top">
          <div className="flex items-center gap-2.5">
            <EmailBadge email={item.corresponding_email} />
            <div className="flex flex-col">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                {(item.corresponding_email ?? '').split('@')[0]}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                {item.corresponding_email}
              </span>
            </div>
          </div>
        </td>
        {showReviews && (
          <td className="px-4 py-4 align-top">
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {reviews.map(r => (
                  <div key={r.id}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                      {r.reviewer?.name ?? '-'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginTop: 3 }}>
                      Recommendation:{' '}
                      <span style={{ color: '#0152EA', fontWeight: 600 }}>
                        {r.recommendation ?? 'No recommendation'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif', marginTop: 2, maxWidth: 260 }}>
                      Comment:{' '}
                      <span style={{ color: '#374151' }}>{r.comment ?? 'No comment'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>No reviews yet</span>
            )}
          </td>
        )}

        {showAssign && (
          <td className="px-4 py-4 align-top">
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-1">
                {reviews.map(r => (
                  <span key={r.id} style={{ fontSize: 12.5, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                    {r.reviewer?.name ?? '-'}
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>No reviewer assigned</span>
            )}
          </td>
        )}

        <td className="px-4 py-4 align-top">
          <StatusBadge label={item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'} />
        </td>

        <td className="px-4 py-4 align-top">
          <div className="flex items-center justify-center gap-2">
            {showAssign && (
              <ActionLink href={`/reviewer/editor-abstract/assign-reviewer/${item.id}`} label="Assign Reviewer" color="#0152EA">
                {ICON_ASSIGN}
              </ActionLink>
            )}
            <ActionLink href={`/reviewer/editor-abstract/edit-status/${item.id}`} label="Edit Status" color="#D97706">
              {ICON_EDIT}
            </ActionLink>
          </div>
        </td>
      </tr>

      {open && (
        <tr style={{ background: '#F8FAFC' }}>
          <td />
          <td colSpan={colSpan} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: 13, fontFamily: 'Manrope,sans-serif' }}>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Full Title</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.title}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Symposium</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.symposium?.name ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Presentation</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.presentation_type ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Authors</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.authors ?? '-'}</p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Tema SDGs</span>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  {item.sdgs && item.sdgs.length > 0 ? (
                    item.sdgs.map(s => (
                      <span key={s.id} className="text-xs px-2 py-0.5 rounded text-white font-semibold" style={{ background: s.color || '#0152EA' }}>
                        {s.code}: {s.name_id || s.name_en}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: '#1F2A3D', marginTop: 2 }}>-</p>
                  )}
                </div>
              </div>
              <div>
                <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Affiliations</span>
                <p style={{ color: '#1F2A3D', marginTop: 2 }}>{item.affiliations ?? '-'}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * Tabel abstract untuk menu "Editor: Abstract".
 * @param {object} abstracts - Laravel paginator
 * @param {string} baseUrl   - URL halaman ini, dipakai untuk navigasi paginasi
 * @param {boolean} showAssign  - tampilkan kolom "Assign Reviewer"
 * @param {boolean} showReviews - tampilkan kolom "Reviewer & Komentar"
 */
export default function EditorAbstractTable({
  abstracts, baseUrl, showAssign = false, showReviews = false, emptyText,
  search = '', filters = {}, showStatusFilter = true,
}) {
  const rows = abstracts?.data ?? [];
  const page = Math.max((abstracts?.current_page ?? 1) - 1, 0);
  const rowsPerPage = abstracts?.per_page ?? 10;

  const navigate = (params) => {
    router.get(baseUrl, params, { preserveScroll: true, preserveState: true });
  };

  const columns = [
    { key: 'toggle', label: '' },
    { key: 'title', label: 'Title' },
    { key: 'correspondent', label: 'Correspondent' },
    ...(showReviews ? [{ key: 'reviews', label: 'Reviewer & Comments' }] : []),
    ...(showAssign ? [{ key: 'assign', label: 'Reviewer' }] : []),
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action', align: 'center' },
  ];

  return (
    <>
      <EditorToolbar
        baseUrl={baseUrl}
        initialSearch={search}
        initialFilters={filters}
        showStatusFilter={showStatusFilter}
        perPage={rowsPerPage}
      />

      <DataTable
      columns={columns}
      empty={<p className="font-medium text-gray-500">{emptyText}</p>}
      footer={(
        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          total={abstracts?.total ?? 0}
          onPageChange={(next) => navigate({ search, ...filters, page: next + 1, per_page: rowsPerPage })}
          onRowsPerPageChange={(next) => navigate({ search, ...filters, page: 1, per_page: next })}
          rowsPerPageOptions={[10, 25, 50]}
        />
      )}
    >
      {rows.map(item => (
        <AbstractRow
          key={item.id}
          item={item}
          showAssign={showAssign}
          showReviews={showReviews}
          colSpan={columns.length - 1}
        />
      ))}
      </DataTable>
    </>
  );
}
