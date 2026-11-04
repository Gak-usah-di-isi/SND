import { useState, useRef } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

const CARD = {
  background: '#fff',
  borderRadius: 14,
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '-');

function StatusBadge({ label, color, bg }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold"
      style={{
        borderRadius: 9999,
        color: color || '#0152EA',
        background: bg || 'rgba(1,82,234,0.08)',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      {label}
    </span>
  );
}

function UploadModal({ open, abstract, onClose, toast }) {
  const { errors } = usePage().props;
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  if (!open || !abstract) return null;

  const handleClose = () => {
    if (submitting) return;
    setFile(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!file) return;
    const data = new FormData();
    data.append('camera_ready_file', file);

    setSubmitting(true);
    router.post(`/fullpaper/camera-ready/${abstract.id}`, data, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setFile(null);
        onClose();
      },
      onError: () => toast.error('Failed to upload file. Please check the file and try again.'),
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-base font-semibold text-gray-800 mb-1">Upload Camera-Ready / Final Paper</p>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">Abstract: {abstract.title}</p>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          style={{
            padding: '24px 16px',
            borderRadius: 12,
            border: `2px dashed ${dragging ? '#0152EA' : file ? '#0152EA' : '#E2E8F0'}`,
            background: dragging ? 'rgba(1,82,234,0.04)' : file ? 'rgba(1,82,234,0.04)' : '#F9FAFB',
          }}
        >
          <Icon
            icon={file ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'}
            width={32}
            style={{ color: file ? '#0152EA' : '#9CA3AF' }}
          />
          <span className="text-sm font-medium" style={{ color: file ? '#0152EA' : '#4B5563' }}>
            {file ? file.name : 'Choose or drag final paper here'}
          </span>
          <span className="text-xs text-gray-400">Format: PDF, DOCX, DOC — Max 15MB</span>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {errors?.camera_ready_file && <p className="text-xs text-red-500 mt-2">{errors.camera_ready_file}</p>}

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || submitting}
            className="px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ background: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            {submitting ? 'Uploading...' : 'Submit Final Paper'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserFinalPaperIndex({ abstracts = [], openFullPaperUpload = true }) {
  const toast = useToast();
  useFlashToast(toast);
  const { features } = usePage().props;

  const [uploadTarget, setUploadTarget] = useState(null);

  // Pisahkan papers yang sudah accepted dan belum
  const eligiblePapers = abstracts.filter(a => a.status === 'accepted');

  return (
    <UserPageLayout currentPath="/final-paper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
            Camera-Ready / Final Paper
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope, sans-serif', margin: '4px 0 0' }}>
            Upload your final camera-ready paper for accepted abstract and full paper submissions.
          </p>
        </div>
      </div>

      {!openFullPaperUpload && (
        <div
          className="p-4 mb-6 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <Icon icon="solar:info-circle-outline" width={22} style={{ color: '#EF4444' }} />
          <span style={{ fontSize: 13.5, color: '#991B1B', fontFamily: 'Manrope, sans-serif' }}>
            Paper uploads are currently closed by the committee.
          </span>
        </div>
      )}

      {/* List of submissions */}
      {eligiblePapers.length === 0 ? (
        <div style={{ ...CARD, textAlign: 'center', padding: '48px 24px' }}>
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(1,82,234,0.08)', color: '#0152EA' }}
          >
            <Icon icon="solar:diploma-verified-outline" width={32} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: '0 0 8px' }}>
            No Papers Ready for Final Submission
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.5 }}>
            Camera-Ready / Final Paper upload is unlocked once your abstract has been accepted by the committee.
          </p>
          <Link
            href="/abstracts"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white"
            style={{ background: '#0152EA', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope, sans-serif' }}
          >
            <Icon icon="solar:document-text-outline" width={16} />
            Check My Abstracts
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {eligiblePapers.map((abstract) => {
            const fp = abstract.full_paper;
            const isFpAccepted = fp && fp.status === 'accepted';
            const hasCameraReady = Boolean(fp && fp.camera_ready_path);
            const canUpload = openFullPaperUpload && abstract.status === 'accepted';

            return (
              <div key={abstract.id} style={CARD}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <StatusBadge label={`Abstract: ${capitalize(abstract.status)}`} color="#10B981" bg="rgba(16,185,129,0.08)" />
                      {fp ? (
                        <StatusBadge
                          label={`Draft Paper: ${capitalize(fp.status)}`}
                          color={isFpAccepted ? '#10B981' : fp.status === 'revision' ? '#D97706' : '#0152EA'}
                          bg={isFpAccepted ? 'rgba(16,185,129,0.08)' : fp.status === 'revision' ? 'rgba(217,119,6,0.08)' : 'rgba(1,82,234,0.08)'}
                        />
                      ) : (
                        <StatusBadge label="Draft Paper: Not Submitted" color="#9CA3AF" bg="rgba(156,163,175,0.1)" />
                      )}
                      {abstract.symposium && (
                        <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Manrope, sans-serif' }}>
                          • {abstract.symposium.name}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0, lineHeight: 1.4 }}>
                      {abstract.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {hasCameraReady ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={`/storage/${fp.camera_ready_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white"
                          style={{ background: '#0152EA', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope, sans-serif' }}
                        >
                          <Icon icon="solar:diploma-verified-outline" width={18} />
                          Download Final Paper
                        </a>
                        {canUpload && (
                          <button
                            type="button"
                            onClick={() => setUploadTarget(abstract)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold"
                            style={{
                              background: 'rgba(1,82,234,0.08)',
                              color: '#0152EA',
                              borderRadius: 8,
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Manrope, sans-serif',
                            }}
                          >
                            <Icon icon="solar:upload-outline" width={16} />
                            Re-upload
                          </button>
                        )}
                      </div>
                    ) : canUpload ? (
                      <button
                        type="button"
                        onClick={() => setUploadTarget(abstract)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                        style={{ background: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
                      >
                        <Icon icon="solar:upload-outline" width={18} />
                        Upload Camera-Ready / Final Paper
                      </button>
                    ) : (
                      <div
                        className="px-3.5 py-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.08)', color: '#B45309', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}
                      >
                        Paper uploads are currently closed by the committee
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub details */}
                <div
                  className={`grid grid-cols-1 ${features?.commitment_letter ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 pt-4`}
                  style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif' }}
                >
                  <div>
                    <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Draft Paper</span>
                    {fp ? (
                      <div className="mt-1">
                        <a
                          href={`/storage/${fp.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium"
                          style={{ color: '#0152EA', textDecoration: 'none' }}
                        >
                          <Icon icon="solar:download-outline" width={16} />
                          Download Draft Paper
                        </a>
                      </div>
                    ) : (
                      <p style={{ color: '#9CA3AF', margin: '4px 0 0' }}>Not submitted yet</p>
                    )}
                  </div>

                  <div>
                    <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Camera-Ready Status</span>
                    <p style={{ margin: '4px 0 0', fontWeight: 600, color: hasCameraReady ? '#0152EA' : '#6B7280' }}>
                      {hasCameraReady ? '✓ Submitted' : 'Pending Upload'}
                    </p>
                  </div>

                  {features?.commitment_letter && (
                    <div>
                      <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Commitment Letter</span>
                      {fp?.commitment_letter_path ? (
                        <div className="mt-1">
                          <a
                            href={`/storage/${fp.commitment_letter_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium"
                            style={{ color: '#6366F1', textDecoration: 'none' }}
                          >
                            <Icon icon="solar:document-text-outline" width={16} />
                            Download Submitted Letter
                          </a>
                        </div>
                      ) : (
                        <p style={{ color: '#9CA3AF', margin: '4px 0 0' }}>Not uploaded yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload modal */}
      <UploadModal
        open={Boolean(uploadTarget)}
        abstract={uploadTarget}
        onClose={() => setUploadTarget(null)}
        toast={toast}
      />

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </UserPageLayout>
  );
}
