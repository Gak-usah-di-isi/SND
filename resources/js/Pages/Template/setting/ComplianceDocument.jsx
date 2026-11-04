import { useState } from 'react';
import { router } from '@inertiajs/react';
import PageLayout from '../../../Components/ui/shared/PageLayout';

const SAMPLE_DOCS = {
  compliance: [
    { id: '1', name: 'SOP Pelayanan Pasien',     description: 'Standar operasional prosedur dalam pelayanan pasien di klinik.' },
    { id: '2', name: 'Kebijakan Privasi Data',   description: 'Kebijakan pengelolaan dan perlindungan data pribadi pasien.' },
    { id: '3', name: 'Protokol Keselamatan',     description: 'Protokol keselamatan kerja bagi seluruh tenaga medis.' },
  ],
  template: [
    { id: '4', name: 'Template Surat Rujukan',   description: 'Format standar surat rujukan ke fasilitas kesehatan lanjutan.' },
    { id: '5', name: 'Template Rekam Medis',     description: 'Formulir standar pencatatan rekam medis pasien.' },
  ],
  document: [
    { id: '6', name: 'Tindakan Pemasangan Infus', description: 'Dokumen prosedur dan instruksi tindakan pemasangan infus.' },
  ],
};

const TABS = [
  { key: 'compliance', label: 'Compliance'       },
  { key: 'template',   label: 'Template Notes'   },
  { key: 'document',   label: 'Dokumen Tindakan' },
];

const TAB_TITLES = { compliance: 'Compliance', template: 'Template Notes', document: 'Dokumen Tindakan' };

function DocIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"> 
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function DocumentCard({ doc }) {
  return (
    <div
      className="bg-white flex flex-col justify-between"
      style={{ borderRadius: 12, padding: 24, minHeight: 200, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', transition: 'box-shadow 150ms' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'}
    >
      <div>
        <p className="font-semibold text-gray-800 mb-2" style={{ fontSize: '1.0625rem' }}>{doc.name}</p>
        {doc.description && (
          <p className="text-sm text-gray-500" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {doc.description}
          </p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => router.visit(`/template/pengaturan/compliance/${doc.id}`)}
          className="px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: 'rgba(1,82,234,0.08)', color: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', transition: 'background 150ms' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.15)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
        >
          Lihat Dokumen
        </button>
      </div>
    </div>
  );
}

function CardPlaceholder({ title, subtitle }) {
  return (
    <div className="bg-white flex flex-col items-center justify-center" style={{ borderRadius: 12, padding: 40, minHeight: 200, border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
      <p className="font-semibold text-gray-700 mb-1" style={{ fontSize: '1rem' }}>{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

export default function ComplianceDocumentPage() {
  const [activeTab, setActiveTab] = useState('compliance');
  const docs = SAMPLE_DOCS[activeTab] ?? [];

  return (
    <PageLayout currentPath="/template/pengaturan/compliance">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          {TAB_TITLES[activeTab]}
        </h1>
        <button
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
          <DocIcon />
          Tambah Dokumen
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{ borderColor: activeTab === t.key ? '#0152EA' : 'transparent', color: activeTab === t.key ? '#0152EA' : '#64748B', background: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {docs.length > 0
          ? docs.map(d => <DocumentCard key={d.id} doc={d} />)
          : <CardPlaceholder title={`Tidak ada ${TAB_TITLES[activeTab]}`} subtitle="Klik tombol Tambah Dokumen untuk menambahkan." />
        }
      </div>
    </PageLayout>
  );
}
