import { usePage } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';

const CARD = { background: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)', padding: 24 };

/* ---------- Summary Box — sama dengan komponen di Admin/Summary/Index.jsx ---------- */
function SummaryBox({ label, value, description }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.04)',
      padding: '16px 16px 24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
      fontFamily: 'Manrope,sans-serif',
    }}>
      <span style={{ fontWeight: 700, fontSize: 18, color: 'rgba(42,53,71,0.8)' }}>{label}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 24, color: '#0152EA' }}>{value}</div>
        {description && (
          <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4, color: '#0152EA', opacity: 0.4 }}>{description}</div>
        )}
      </div>
    </div>
  );
}

/* ---------- Status table — sama persis dengan AbstractDetails di Admin/Summary/Index.jsx ---------- */
const BADGE = {
  blue:   { bg: 'rgba(1,82,234,0.1)',   color: '#0152EA' },
  purple: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
  cyan:   { bg: 'rgba(73,190,255,0.12)', color: '#0EA5E9' },
  amber:  { bg: 'rgba(255,174,31,0.1)', color: '#F59E0B' },
  green:  { bg: 'rgba(19,222,185,0.1)', color: '#10B981' },
  red:    { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444' },
  gray:   { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

function StatusDetails({ title, subtitle, rows }) {
  return (
    <div className="bg-white p-6 flex flex-col h-full" style={{ borderRadius: 12, boxShadow: '0px 2px 4px -1px rgba(175,182,201,0.2)' }}>
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-400 mt-0.5">{subtitle}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm border-y border-gray-200">
              <th className="py-4 font-medium text-gray-500">Status</th>
              <th className="py-4 font-medium text-gray-500">Detail</th>
              <th className="py-4 font-medium text-gray-500 w-24 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const b = BADGE[r.badge] ?? BADGE.gray;
              return (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-5">
                    <div className="font-semibold text-gray-800 text-sm">{r.label}</div>
                  </td>
                  <td className="py-5 text-sm text-gray-600">{r.detail}</td>
                  <td className="py-5 text-right">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: b.bg, color: b.color }}>{r.value}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EditorSummaryIndexPage({ countCompletedReviews, countCompletedPapers, allAbstracts, allFullPapers, reviewerCertificate, badgeCounts }) {
  const { authUser, authRoles } = usePage().props;
  const roleLabel = authRoles?.[0]
    ? authRoles[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'User';

  const b = badgeCounts ?? {};

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          Welcome {authUser?.name ?? ''}
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '4px 0 0' }}>
          You are logged in as <span style={{ color: '#0152EA', fontWeight: 600 }}>{roleLabel}</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <SummaryBox label="Review Abstract Completed"  value={countCompletedReviews ?? 0} description="Completed abstract reviews" />
        <SummaryBox label="Review Fullpaper Completed"  value={countCompletedPapers ?? 0}  description="Completed full paper reviews" />
        <SummaryBox label="All Abstract"                value={allAbstracts ?? 0}          description="Total submitted abstracts" />
        <SummaryBox label="All Fullpaper"               value={allFullPapers ?? 0}         description="Total submitted full papers" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16, alignItems: 'stretch' }}>
        <StatusDetails
          title="Editor Abstract"
          subtitle="Abstract handling status"
          rows={[
            { label: 'No Review',     value: b.abstractNoReview ?? 0,     detail: 'not yet reviewed',  badge: 'red' },
            { label: 'Revision Req',  value: b.abstractRevision ?? 0,     detail: 'needs revision',    badge: 'amber' },
            { label: 'No Decision',   value: b.abstractNoDecision ?? 0,   detail: 'awaiting decision', badge: 'cyan' },
            { label: 'With Decision', value: b.abstractWithDecision ?? 0, detail: 'decided',           badge: 'green' },
            { label: 'All Abstract',  value: b.allAbstract ?? 0,          detail: 'total abstracts',   badge: 'blue' },
          ]}
        />
        <StatusDetails
          title="Editor: Paper"
          subtitle="Full paper handling status"
          rows={[
            { label: 'No Review',     value: b.paperNoReview ?? 0,     detail: 'not yet reviewed',  badge: 'red' },
            { label: 'Revision Req',  value: b.paperRevision ?? 0,     detail: 'needs revision',    badge: 'amber' },
            { label: 'No Decision',   value: b.paperNoDecision ?? 0,   detail: 'awaiting decision', badge: 'cyan' },
            { label: 'With Decision', value: b.paperWithDecision ?? 0, detail: 'decided',           badge: 'green' },
            { label: 'All Papers',    value: b.allPapers ?? 0,         detail: 'total full papers', badge: 'blue' },
          ]}
        />
      </div>

      {reviewerCertificate && reviewerCertificate.status === 1 && (
        <div style={{ marginTop: 16, maxWidth: 320 }}>
          <a
            href={`/storage/${reviewerCertificate.certificate_path}`}
            target="_blank"
            rel="noreferrer"
            style={{ ...CARD, display: 'block', textAlign: 'center', textDecoration: 'none' }}
          >
            <p style={{ fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              Reviewer Certificate
            </p>
            <span
              style={{
                display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 9999,
                fontSize: 12, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
                background: 'rgba(19,222,185,0.1)', color: '#10B981',
              }}
            >
              Active
            </span>
          </a>
        </div>
      )}
    </>
  );
}

EditorSummaryIndexPage.layout = editorLayout;
