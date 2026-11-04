import { useState } from 'react';
import { router } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

import { FloatInput } from '../../../Components/ui/FloatInput';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 16, fontFamily: 'Manrope, sans-serif' };

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'under review', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted (Diterima)' },
  { value: 'revision', label: 'Revision (Perlu Revisi)' },
  { value: 'rejected', label: 'Rejected (Ditolak)' },
];

export default function EditorEditStatusPage({ abstract, formattedAuthors, formattedAffiliations, badgeCounts }) {
  const [status, setStatus] = useState(abstract.status ?? '');
  const [editorFeedback, setEditorFeedback] = useState(abstract.editor_feedback ?? '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const reviews = abstract.abstract_reviews ?? [];
  const handleCancel = () => router.visit('/reviewer/all-abstract');

  const handleSubmit = () => {
    if (!status) {
      setErrors({ status: 'Status is required' });
      return;
    }
    setSubmitting(true);
    router.post(`/reviewer/editor-abstract/edit-status/${abstract.id}`, {
      status,
      editor_feedback: editorFeedback,
    }, {
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to update status.');
      },
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={handleCancel} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Edit Status Abstract
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Detail — gaya "paper card" seperti User/Abstracts/Show.jsx */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '48px 56px',
        }}>
          <h1 style={{
            textAlign: 'center', fontSize: 22, fontWeight: 700,
            color: '#1F2A3D', fontFamily: 'Manrope,sans-serif',
            lineHeight: 1.4, margin: '0 0 20px',
          }}>
            {abstract.title}
          </h1>

          {formattedAuthors && (
            <p style={{ textAlign: 'center', fontSize: 15, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}
              dangerouslySetInnerHTML={{ __html: formattedAuthors }} />
          )}

          {formattedAffiliations && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 16px' }}
              dangerouslySetInnerHTML={{ __html: formattedAffiliations }} />
          )}

          {abstract.corresponding_email && (
            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 24px' }}>
              <strong>Corresponding Email:</strong> {abstract.corresponding_email}
            </p>
          )}

          <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}>
            Abstract
          </p>
          <div style={{ fontSize: 14, color: '#374151', fontFamily: 'Manrope,sans-serif', lineHeight: 1.8, textAlign: 'justify', whiteSpace: 'pre-wrap', margin: '0 0 20px' }}>
            {abstract.abstract}
          </div>

          {abstract.keyword && (
            <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 16px' }}>
              <strong>Keyword:</strong> {abstract.keyword}
            </p>
          )}

          {abstract.sdgs && abstract.sdgs.length > 0 && (
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Tema SDGs yang Dipilih Penulis:
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {abstract.sdgs.map(s => (
                  <span
                    key={s.id}
                    className="text-xs px-2.5 py-1 rounded-md text-white font-semibold"
                    style={{ background: s.color || '#0152EA', fontFamily: 'Manrope,sans-serif' }}
                  >
                    {s.code}: {s.name_id || s.name_en}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rekomendasi & komentar reviewer */}
        <Card>
          <p style={SECTION_TITLE}>Reviewer Recommendations &amp; Comments</p>
          {reviews.length === 0 ? (
            <p style={{ fontSize: 13.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              No reviews yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                  <div className="flex items-center gap-2.5" style={{ marginBottom: 8 }}>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(1,82,234,0.1)' }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#0152EA', fontFamily: 'Manrope,sans-serif' }}>
                        {(r.reviewer?.name ?? '?').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif' }}>
                      {r.reviewer?.name ?? '-'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 4px' }}>
                    <strong>Recommendation:</strong> {r.recommendation ?? 'No recommendation'}
                  </p>
                  <p style={{ fontSize: 13, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
                    <strong>Comment:</strong> {r.comment ?? 'No comment'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Form ubah status */}
        <Card>
          <p style={SECTION_TITLE}>Editor Decision (Keputusan Editor)</p>
          <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>Status saat ini:</span>
            <StatusBadge label={abstract.status ? abstract.status.charAt(0).toUpperCase() + abstract.status.slice(1) : '-'} />
          </div>
          <div className="flex flex-col gap-4">
            <FloatSelect
              id="status"
              label="Ubah Status *"
              options={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              error={!!errors.status}
              helperText={errors.status}
            />

            {(status === 'revision' || status === 'rejected') && (
              <div>
                <FloatInput
                  id="editor_feedback"
                  label={status === 'revision' ? 'Catatan Perbaikan untuk Penulis (Wajib diisi jika revisi) *' : 'Alasan Penolakan Makalah'}
                  value={editorFeedback}
                  onChange={(e) => setEditorFeedback(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Tuliskan poin-poin yang perlu diperbaiki oleh penulis..."
                />
              </div>
            )}
          </div>

          <p style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 14 }}>
            Memilih <strong>Accepted</strong> akan menandai abstrak diterima dan menerbitkan hak unduh Letter of Acceptance (LoA) bagi peserta.
          </p>
        </Card>

        <FormActions
          id="edit-status-form"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          cancelText="Cancel"
          submitText={submitting ? 'Saving...' : 'Update Status'}
        />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorEditStatusPage.layout = editorLayout;
