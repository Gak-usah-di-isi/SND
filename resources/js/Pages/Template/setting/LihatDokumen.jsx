import { useState } from 'react';
import { router } from '@inertiajs/react';
import PageLayout from "../../../Components/ui/shared/PageLayout.jsx";
import BackButton from '../../../Components/ui/BackButton';
import { Icon } from '@iconify/react';

// Sample content per doc id — in real app this comes from backend props
const SAMPLE_DOCS = {
  '1': { id: '1', name: 'SOP Pelayanan Pasien',     type: 'compliance', text_document: 'Standar Operasional Prosedur (SOP) Pelayanan Pasien\n\n1. Pendaftaran Pasien\n   - Pasien mengisi formulir pendaftaran\n   - Verifikasi identitas pasien\n   - Penginputan data ke sistem\n\n2. Triase\n   - Penilaian kondisi pasien oleh tenaga medis\n   - Penentuan prioritas penanganan\n\n3. Pemeriksaan\n   - Anamnesis oleh dokter\n   - Pemeriksaan fisik\n   - Permintaan pemeriksaan penunjang bila diperlukan\n\n4. Tatalaksana\n   - Diagnosis\n   - Pemberian terapi dan obat\n   - Edukasi pasien\n\n5. Dokumentasi\n   - Pencatatan rekam medis\n   - Pemberian resep\n   - Rencana kontrol ulang' },
  '2': { id: '2', name: 'Kebijakan Privasi Data',   type: 'compliance', text_document: 'Kebijakan Privasi Data Pasien\n\n1. Pengumpulan Data\n   Kami mengumpulkan data pribadi pasien untuk keperluan pelayanan kesehatan.\n\n2. Penggunaan Data\n   Data hanya digunakan untuk keperluan medis dan administratif internal.\n\n3. Keamanan Data\n   Data disimpan dengan enkripsi dan hanya dapat diakses oleh tenaga yang berwenang.\n\n4. Hak Pasien\n   Pasien berhak mengakses, memperbarui, dan meminta penghapusan data pribadi mereka.' },
  '3': { id: '3', name: 'Protokol Keselamatan',     type: 'compliance', text_document: 'Protokol Keselamatan Kerja Tenaga Medis\n\n1. Penggunaan APD\n   - Selalu gunakan masker, sarung tangan, dan pelindung wajah saat berinteraksi dengan pasien.\n\n2. Kebersihan Tangan\n   - Cuci tangan sebelum dan sesudah setiap tindakan medis.\n\n3. Pengelolaan Limbah\n   - Limbah medis dipisahkan dan dibuang sesuai regulasi.' },
  '4': { id: '4', name: 'Template Surat Rujukan',   type: 'template',   text_document: 'SURAT RUJUKAN\n\nKepada Yth.\nDokter / Fasilitas Kesehatan\n...\n\nBersama surat ini kami merujuk pasien:\nNama     : ______________________\nTanggal Lahir: ______________________\nNo. RM   : ______________________\n\nDengan diagnosa: ______________________\nAlasan rujukan: ______________________\n\nMohon penanganan lebih lanjut.\n\nHormat kami,\nDokter Pengirim\n______________________' },
  '5': { id: '5', name: 'Template Rekam Medis',     type: 'template',   text_document: 'REKAM MEDIS PASIEN\n\nTanggal : ______________________\nDokter  : ______________________\n\nAnamnesis:\n______________________\n\nPemeriksaan Fisik:\n- TD  : ______________________\n- Nadi: ______________________\n- Suhu: ______________________\n\nDiagnosis: ______________________\nTerapi   : ______________________\nRencana  : ______________________' },
  '6': { id: '6', name: 'Tindakan Pemasangan Infus', type: 'document',  text_document: 'PROSEDUR TINDAKAN PEMASANGAN INFUS\n\n1. Persiapan Alat\n   - Infus set, cairan infus, jarum IV kateter, plester, kasa, alkohol swab.\n\n2. Identifikasi Pasien\n   - Verifikasi identitas dan rencana terapi.\n\n3. Prosedur\n   a. Cuci tangan dan gunakan APD.\n   b. Pilih vena yang tepat.\n   c. Desinfeksi area penusukan.\n   d. Tusukkan jarum dengan sudut 15–30 derajat.\n   e. Pastikan darah masuk ke selang, lalu masukkan kateter sepenuhnya.\n   f. Sambungkan infus set dan atur tetesan.\n   g. Fiksasi dengan plester.\n\n4. Dokumentasi\n   Catat waktu, jenis cairan, kecepatan tetes, dan kondisi pasien.' },
};

export default function LihatDokumenPage({ docId }) {
  const doc = SAMPLE_DOCS[docId] ?? SAMPLE_DOCS['1'];

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent]     = useState(doc.text_document);
  const [saved, setSaved]         = useState(doc.text_document);
  const [copyLabel, setCopyLabel] = useState('Copy');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(saved);
      setCopyLabel('Tersalin!');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    } catch {
      setCopyLabel('Gagal');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    setSaved(content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(saved);
    setIsEditing(false);
  };

  return (
    <PageLayout currentPath="/template/pengaturan/compliance">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={() => router.visit('/template/pengaturan/compliance')} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          {doc.name}
        </h1>
        <div style={{ width: 1, height: 32, backgroundColor: '#E2E8F0', margin: '0 8px' }} />
      </div>

      {/* Paper */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 32 }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          {/* Import button */}
          <button
            disabled={isEditing}
            className="px-4 py-1.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Manrope, sans-serif', background: '#fff', cursor: isEditing ? 'not-allowed' : 'pointer' }}
            onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = '#F8FAFC'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            Import
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <button type="button" disabled className="p-1.5 rounded text-gray-400 cursor-not-allowed" title="Undo">
              <Icon icon="solar:undo-left-linear" width={18} />
            </button>
            <button type="button" disabled className="p-1.5 rounded text-gray-400 cursor-not-allowed" title="Redo">
              <Icon icon="solar:undo-right-linear" width={18} />
            </button>

            {/* Copy */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={isEditing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Manrope, sans-serif', cursor: isEditing ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {copyLabel}
            </button>

            {/* Edit / Batal Edit */}
            <button
              type="button"
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon icon={isEditing ? 'solar:close-circle-linear' : 'solar:pen-2-linear'} width={16} />
              {isEditing ? 'Batal Edit' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ paddingTop: 4 }}>
          {isEditing ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Edit dokumen..."
              rows={20}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '12px 14px',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: '#1E293B',
                resize: 'vertical',
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#0152EA'}
              onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
          ) : (
            <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', lineHeight: 1.8, color: '#1E293B', margin: 0 }}>
              {saved}
            </p>
          )}
        </div>

        {/* Save/Cancel bar when editing */}
        {isEditing && (
          <div className="flex items-center gap-2 mt-6 pt-5" style={{ borderTop: '1px solid #E2E8F0' }}>
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(1,82,234,0.1)', color: '#0152EA', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.18)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.1)'}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!content.trim()}
              className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0152EA', border: 'none', cursor: content.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Manrope, sans-serif' }}
              onMouseEnter={e => { if (content.trim()) e.currentTarget.style.backgroundColor = '#0141C8'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0152EA'; }}
            >
              Simpan
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
