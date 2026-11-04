import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { Card } from '../../../Components/ui/card';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const TABS = [
  { key: 'upload',   label: 'Upload' },
  { key: 'download', label: 'Download' },
];

const UPLOAD_TYPES = [
  {
    key: 'logo',
    label: 'Logo',
    icon: 'solar:gallery-outline',
    accept: '.png,.jpg',
    description: 'Used in: acceptance letters, payment receipts',
    spec: 'Size: 300 × 300 px — Format: PNG / JPG',
  },
  {
    key: 'letter_header',
    label: 'Letter Header',
    icon: 'solar:document-text-outline',
    accept: '.png',
    description: 'Used in: acceptance letters, payment receipts',
    spec: 'Size: 2390 × 470 px — Format: PNG',
  },
  {
    key: 'signature',
    label: 'Signature',
    icon: 'solar:pen-outline',
    accept: '.jpg',
    description: 'Used in: acceptance letters, payment receipts',
    spec: 'Size: 900 × 320 px — Format: JPG',
  },
  {
    key: 'certificate_presenter',
    label: 'Certificate Background (Presenter)',
    icon: 'solar:medal-ribbons-star-outline',
    accept: '.pdf',
    description: 'Used in: PRESENTER certificate',
    spec: 'Size: 1754 × 1240 px (A4 150dpi) — Format: PDF',
  },
  {
    key: 'certificate_participant',
    label: 'Certificate Background (Participant)',
    icon: 'solar:medal-ribbons-star-outline',
    accept: '.pdf',
    description: 'Used in: PARTICIPANT certificate',
    spec: 'Size: 1754 × 1240 px (A4 150dpi) — Format: PDF',
  },
  {
    key: 'reviewer_certificate',
    label: 'Certificate Background (Reviewer)',
    icon: 'solar:medal-ribbons-star-outline',
    accept: '.pdf',
    description: 'Used in: REVIEWER certificate',
    spec: 'Size: 1754 × 1240 px (A4 150dpi) — Format: PDF',
  },
  {
    key: 'commitment_letter',
    label: 'Commitment Letter Template',
    icon: 'solar:file-text-outline',
    accept: '.docx',
    description: 'Used in: commitment letter template',
    spec: 'Format: DOCX',
  },
  {
    key: 'pararel_session_template',
    label: 'Parallel Session Schedule',
    icon: 'solar:calendar-outline',
    accept: '.pdf',
    description: 'Used in: Send Parallel Session email attachment',
    spec: 'Format: PDF',
  },
  {
    key: 'bg_zoom_template',
    label: 'Zoom Background',
    icon: 'solar:gallery-outline',
    accept: '.jpg,.jpeg,.png',
    description: 'Used in: Send Parallel Session email attachment',
    spec: 'Format: JPG / PNG',
  },
];

const SECTION_TITLE = {
  fontSize: 15, fontWeight: 600, color: '#1F2A3D',
  marginBottom: 16, fontFamily: 'Manrope, sans-serif',
};

/* ---------- Upload Card ---------- */
function UploadCard({ type, existing, onUpload }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    onUpload(type.key, selectedFile, () => setSelectedFile(null));
  };

  const hasFile = !!existing;

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'rgba(1,82,234,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon icon={type.icon} width={22} style={{ color: '#0152EA' }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
              {type.label}
            </p>
            {hasFile ? (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                background: 'rgba(16,185,129,0.1)', color: '#10B981', fontFamily: 'Manrope, sans-serif',
              }}>
                Uploaded
              </span>
            ) : (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontFamily: 'Manrope, sans-serif',
              }}>
                No file available
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
            {type.description}
          </p>
          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
            {type.spec}
          </p>

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onMouseEnter={e => { if (!dragging && !selectedFile) { e.currentTarget.style.borderColor = '#60A5FA'; e.currentTarget.style.background = '#EFF6FF'; } }}
            onMouseLeave={e => { if (!dragging && !selectedFile) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F8FAFC'; } }}
            style={{
              marginTop: 12, padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px dashed ${dragging ? '#0152EA' : selectedFile ? '#10B981' : '#D1D5DB'}`,
              background: dragging ? 'rgba(1,82,234,0.04)' : selectedFile ? 'rgba(16,185,129,0.04)' : '#F8FAFC',
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all 150ms',
            }}
          >
            <Icon
              icon={selectedFile ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'}
              width={18}
              style={{ color: selectedFile ? '#10B981' : '#9CA3AF', flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: selectedFile ? '#10B981' : '#9CA3AF', fontFamily: 'Manrope, sans-serif' }}>
              {selectedFile ? selectedFile.name : 'Click or drag file here'}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept={type.accept}
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {selectedFile && (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  height: 32, padding: '0 16px', borderRadius: 6, border: 'none',
                  background: '#0152EA', color: '#fff',
                  fontSize: 12, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Icon icon="solar:upload-minimalistic-outline" width={13} />
                Upload
              </button>
            )}
            {hasFile && (
              <a
                href={`/admin/upload/show/${type.key}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none',
                  background: 'rgba(1,82,234,0.08)', color: '#0152EA',
                  fontSize: 12, fontWeight: 500, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(1,82,234,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(1,82,234,0.08)'}
              >
                <Icon icon="solar:eye-outline" width={13} />
                View File
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Download Card ---------- */
function DownloadCard({ icon, label, description, href, color = '#0152EA' }) {
  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0', gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `rgba(${color === '#0152EA' ? '1,82,234' : '16,185,129'},0.08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon icon={icon} width={28} style={{ color }} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1F2A3D', margin: '0 0 4px', fontFamily: 'Manrope, sans-serif' }}>
            {label}
          </p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontFamily: 'Manrope, sans-serif' }}>
            {description}
          </p>
        </div>
        <a
          href={href}
          style={{
            height: 36, padding: '0 20px', borderRadius: 8, border: 'none',
            background: color, color: '#fff',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          }}
        >
          <Icon icon="solar:download-minimalistic-outline" width={15} />
          Download ZIP
        </a>
      </div>
    </Card>
  );
}

/* ---------- Main Page ---------- */
export default function FilesIndexPage({ uploads = {} }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('upload');

  const handleUpload = (type, file, onDone) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    router.post('/admin/upload', formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('File uploaded successfully.');
        onDone();
      },
      onError: (errs) => {
        const msg = errs?.file ?? errs?.type ?? 'Failed to upload file.';
        toast.error(msg);
      },
      preserveScroll: true,
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/download-files">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 24, fontFamily: 'Manrope, sans-serif' }}>
        {TABS.find(t => t.key === activeTab)?.label === 'Upload' ? 'Upload Files' : 'Download Files'}
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Manrope, sans-serif', background: 'none', border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #0152EA' : '2px solid transparent',
              color: activeTab === tab.key ? '#0152EA' : '#6B7280',
              marginBottom: -1, cursor: 'pointer', transition: 'color 150ms',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Tab Upload ===== */}
      {activeTab === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div>
            <p style={SECTION_TITLE}>Conference Assets</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {UPLOAD_TYPES.slice(0, 3).map(type => (
                <UploadCard key={type.key} type={type} existing={uploads[type.key]} onUpload={handleUpload} />
              ))}
            </div>
          </div>

          <div>
            <p style={SECTION_TITLE}>Certificates</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {UPLOAD_TYPES.slice(3, 6).map(type => (
                <UploadCard key={type.key} type={type} existing={uploads[type.key]} onUpload={handleUpload} />
              ))}
            </div>
          </div>

          <div>
            <p style={SECTION_TITLE}>Documents</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {UPLOAD_TYPES.slice(6).map(type => (
                <UploadCard key={type.key} type={type} existing={uploads[type.key]} onUpload={handleUpload} />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===== Tab Download ===== */}
      {activeTab === 'download' && (
        <div>
          <p style={SECTION_TITLE}>Bulk Download (ZIP)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 680 }}>
            <DownloadCard
              icon="solar:file-text-outline"
              label="Full Papers"
              description="Download all verified full papers in a single ZIP file"
              href="/admin/download/fullpaper"
              color="#0152EA"
            />
            <DownloadCard
              icon="solar:bill-list-outline"
              label="Payment Proofs"
              description="Download all verified payment proofs in a single ZIP file"
              href="/admin/download/payment-proof"
              color="#10B981"
            />
          </div>

          <div style={{
            marginTop: 20, padding: '14px 18px', borderRadius: 8, maxWidth: 680,
            background: 'rgba(1,82,234,0.04)', border: '1px solid rgba(1,82,234,0.12)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <Icon icon="solar:info-circle-outline" width={18} style={{ color: '#0152EA', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#374151', margin: 0, fontFamily: 'Manrope, sans-serif', lineHeight: 1.6 }}>
              Download may take several minutes depending on the number of files. Please do not refresh the page while downloading.
            </p>
          </div>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
