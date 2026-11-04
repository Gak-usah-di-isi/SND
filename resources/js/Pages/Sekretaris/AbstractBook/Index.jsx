import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Icon } from '@iconify/react';
import SekretarisPageLayout from '../../../Components/ui/shared/SekretarisPageLayout';

/* Endpoint PDF kumpulan abstrak (lihat routes/web.php → sekretaris.abstractBook.downloadPdf) */
const DOWNLOAD_ALL_URL = '/sekretaris/abstract-book/download-pdf?type=all';
const DOWNLOAD_VERIFIED_URL = '/sekretaris/abstract-book/download-pdf?type=verified';

/* ---------- Abstract Card — format buku abstrak, teks center ---------- */
function AbstractCard({ abstract, code }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {/* Divider atas tebal */}
      <hr style={{ border: 'none', borderTop: '3px solid #1F2A3D', margin: '0 0 6px' }} />

      {/* Kode — uppercase bold center */}
      <p style={{
        textAlign: 'center', fontWeight: 700, fontSize: 13,
        color: '#1F2A3D', fontFamily: 'Manrope,sans-serif',
        textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.04em',
      }}>
        {code}
      </p>

      {/* Divider bawah tebal */}
      <hr style={{ border: 'none', borderTop: '3px solid #1F2A3D', margin: '0 0 12px' }} />

      {/* Judul — bold center */}
      <h4 style={{
        textAlign: 'center', fontWeight: 700, fontSize: 15,
        color: '#1F2A3D', fontFamily: 'Manrope,sans-serif',
        margin: '0 0 8px', lineHeight: 1.4,
      }}>
        {abstract.title}
      </h4>

      {/* Authors — center, superscript nomor afiliasi dari controller */}
      {abstract.formattedAuthors && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 4px' }}
          dangerouslySetInnerHTML={{ __html: abstract.formattedAuthors }} />
      )}

      {/* Affiliations — center, italic kecil */}
      {abstract.formattedAffiliations && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#6B7280', fontFamily: 'Manrope,sans-serif', fontStyle: 'italic', margin: '0 0 6px' }}
          dangerouslySetInnerHTML={{ __html: abstract.formattedAffiliations }} />
      )}

      {/* Corresponding Email */}
      {abstract.corresponding_email && (
        <p style={{ textAlign: 'center', fontSize: 12.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}>
          <strong>Corresponding Email:</strong> {abstract.corresponding_email}
        </p>
      )}

      {/* Abstract body */}
      <p style={{ fontSize: 13.5, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 4px' }}>
        Abstract:
      </p>
      <div style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', lineHeight: 1.7, margin: '0 0 10px' }}
        dangerouslySetInnerHTML={{ __html: abstract.abstract ? abstract.abstract.replace(/\n/g, '<br/>') : '' }} />

      {/* Keywords */}
      {abstract.keyword && (
        <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
          <strong>Keywords:</strong> {abstract.keyword}
        </p>
      )}

      {/* Divider bawah tipis */}
      <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '16px 0 0' }} />
    </div>
  );
}

/* ---------- Symposium Accordion ---------- */
function SymposiumAccordion({ symposium, open, onToggle }) {
  const abstracts = symposium.abstracts ?? [];
  const count     = abstracts.length;

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1px solid #E2E8F0', marginBottom: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden',
    }}>
      {/* Accordion header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: open ? '#F8FAFF' : '#fff',
          border: 'none', borderBottom: open ? '1px solid #E2E8F0' : 'none',
          cursor: 'pointer', textAlign: 'left', transition: 'background 150ms',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: 'rgba(1,82,234,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon="solar:notebook-outline" width={18} style={{ color: '#0152EA' }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              {symposium.name}
            </p>
            <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              {symposium.abbreviation}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 12.5, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
            background: count > 0 ? 'rgba(1,82,234,0.08)' : '#F1F5F9',
            color: count > 0 ? '#0152EA' : '#9CA3AF',
            fontFamily: 'Manrope,sans-serif',
          }}>
            {count} abstract{count !== 1 ? 's' : ''}
          </span>
          {open
            ? <ChevronUp size={18} style={{ color: '#6B7280', flexShrink: 0 }} />
            : <ChevronDown size={18} style={{ color: '#6B7280', flexShrink: 0 }} />
          }
        </div>
      </button>

      {/* Abstracts list */}
      {open && (
        <div style={{ padding: count > 0 ? '16px 20px' : '20px' }}>
          {count === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Icon icon="solar:document-outline" width={40} style={{ color: '#D1D5DB' }} />
              <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 8 }}>
                No abstracts found
              </p>
            </div>
          ) : (
            abstracts.map((abstract, i) => (
              <AbstractCard
                key={abstract.id}
                abstract={abstract}
                code={`${symposium.abbreviation}/${String(i + 1).padStart(3, '0')}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function AbstractBookIndexPage({ symposiums = [] }) {
  const [openIds, setOpenIds] = useState(() => new Set());

  const withAbstracts    = symposiums.filter(s => (s.abstracts?.length ?? 0) > 0);
  const withoutAbstracts = symposiums.filter(s => (s.abstracts?.length ?? 0) === 0);
  const totalAbstracts   = symposiums.reduce((sum, s) => sum + (s.abstracts?.length ?? 0), 0);
  const allExpanded      = withAbstracts.length > 0 && withAbstracts.every(s => openIds.has(s.id));

  const toggleOne = (id) => setOpenIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const toggleAll = () => setOpenIds(
    allExpanded ? new Set() : new Set(withAbstracts.map(s => s.id))
  );

  const downloadBtn = {
    height: 36, padding: '0 14px', borderRadius: 8,
    fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
    textDecoration: 'none',
  };

  return (
    <SekretarisPageLayout currentPath="/sekretaris/abstract-book">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
            Abstracts Book
          </h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 4 }}>
            {withAbstracts.length} symposiums · {totalAbstracts} total abstracts
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={toggleAll}
            disabled={withAbstracts.length === 0}
            style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              border: '1px solid #E2E8F0', background: '#fff',
              fontSize: 13, fontWeight: 500, color: '#374151',
              fontFamily: 'Manrope,sans-serif',
              cursor: withAbstracts.length === 0 ? 'not-allowed' : 'pointer',
              opacity: withAbstracts.length === 0 ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon icon={allExpanded ? 'solar:minimize-square-outline' : 'solar:maximize-square-outline'} width={15} />
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>

          <a
            href={DOWNLOAD_ALL_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              ...downloadBtn,
              border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)',
              color: '#EF4444',
            }}
          >
            <Icon icon="solar:file-text-outline" width={15} />
            Download All Abstracts PDF
          </a>

          <a
            href={DOWNLOAD_VERIFIED_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              ...downloadBtn,
              background: '#0152EA', border: 'none', color: '#fff',
            }}
          >
            <Icon icon="solar:file-text-outline" width={15} />
            Download Verified Abstracts PDF
          </a>
        </div>
      </div>

      {/* Symposium accordions */}
      {withAbstracts.map(symposium => (
        <SymposiumAccordion
          key={symposium.id}
          symposium={symposium}
          open={openIds.has(symposium.id)}
          onToggle={() => toggleOne(symposium.id)}
        />
      ))}

      {/* Empty state — belum ada abstrak sama sekali */}
      {symposiums.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Icon icon="solar:notebook-outline" width={48} style={{ color: '#D1D5DB' }} />
          <p style={{ fontSize: 14, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 12 }}>
            No symposiums found
          </p>
        </div>
      )}

      {/* Symposium kosong */}
      {withoutAbstracts.length > 0 && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', cursor: 'pointer', marginBottom: 8 }}>
            Show symposiums without abstracts ({withoutAbstracts.length})
          </summary>
          {withoutAbstracts.map(symposium => (
            <SymposiumAccordion
              key={symposium.id}
              symposium={symposium}
              open={openIds.has(symposium.id)}
              onToggle={() => toggleOne(symposium.id)}
            />
          ))}
        </details>
      )}
    </SekretarisPageLayout>
  );
}
