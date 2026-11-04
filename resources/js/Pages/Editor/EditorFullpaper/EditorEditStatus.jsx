import { useState } from 'react';
import { router } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import StatusBadge from '../../../Components/ui/StatusBadge';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 16, fontFamily: 'Manrope, sans-serif' };

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'under review', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'revision', label: 'Revision' },
  { value: 'rejected', label: 'Rejected' },
];

// Harus sama persis dengan aturan validasi `in:` di EditorFullPaperController::updateStatus
const PUBLICATION_OPTIONS = [
  { value: 'Journal Publication', label: 'Journal Publication' },
  { value: 'Proceedings Indexed in EBSCO', label: 'Proceedings Indexed in EBSCO' },
];

function FileLink({ href, label, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2"
      style={{
        height: 36, padding: '0 14px', borderRadius: 8,
        fontSize: 13, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
        color, border: `1px solid ${color}4D`, background: `${color}0A`, textDecoration: 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><path d="M12 18v-6M9 15l3 3 3-3" />
      </svg>
      {label}
    </a>
  );
}

export default function EditorFullpaperEditStatusPage({
  fullpaper,
  formattedAuthors,
  formattedAffiliations,
  badgeCounts,
  enablePublicationSelection = true,
}) {
  const abstract = fullpaper.abstract ?? {};
  const [form, setForm] = useState({
    status: fullpaper.status ?? '',
    publication: abstract.publication ?? '',
    note: fullpaper.note ?? '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const reviews = fullpaper.full_paper_reviews ?? [];
  const handleCancel = () => router.visit('/reviewer/all-fullpaper');

  const handleSubmit = () => {
    const errs = {};
    if (!form.status) errs.status = 'Status is required';
    if (enablePublicationSelection && !form.publication) errs.publication = 'Publication is required';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    // forceFormData: ada upload file (similarity_file) di form ini.
    // Sukses tidak di-toast di sini: controller redirect ke All Papers,
    // jadi komponen ini unmount. Toast sukses tampil di sana via useFlashToast.
    router.post(`/reviewer/editor-fullpaper/edit-status/${fullpaper.id}`, {
      ...form,
      similarity_file: file,
    }, {
      forceFormData: true,
      onError: (errs2) => {
        setErrors(errs2);
        toast.error('Failed to update status. Please check the form.');
      },
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={handleCancel} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Edit Status Full Paper
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Detail — gaya "paper card", sama dengan form Review Abstract */}
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
            {abstract.title ?? '-'}
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

          {abstract.abstract && (
            <>
              <p style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 12px' }}>
                Abstract
              </p>
              <div style={{ fontSize: 14, color: '#374151', fontFamily: 'Manrope,sans-serif', lineHeight: 1.8, textAlign: 'justify', whiteSpace: 'pre-wrap', margin: '0 0 20px' }}>
                {abstract.abstract}
              </div>
            </>
          )}

          {abstract.keyword && (
            <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
              <strong>Keyword:</strong> {abstract.keyword}
            </p>
          )}

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: '0 0 10px' }}>
              File Full Paper
            </p>
            {(fullpaper.file_path || fullpaper.revised_file_path) ? (
              <div className="flex flex-wrap gap-3">
                {fullpaper.file_path && (
                  <FileLink href={`/storage/${fullpaper.file_path}`} label="Submitted" color="#0152EA" />
                )}
                {fullpaper.revised_file_path && (
                  <FileLink href={`/storage/${fullpaper.revised_file_path}`} label="Revised" color="#D97706" />
                )}
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>Not submitted</p>
            )}
          </div>
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

        {/* Form keputusan editor */}
        <Card>
          <p style={SECTION_TITLE}>Editor Decision</p>
          <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Manrope,sans-serif' }}>Current status:</span>
            <StatusBadge label={fullpaper.status ? fullpaper.status.charAt(0).toUpperCase() + fullpaper.status.slice(1) : '-'} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FloatSelect
              id="status"
              label="Change Status *"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(val) => setForm(f => ({ ...f, status: val }))}
              error={!!errors.status}
              helperText={errors.status}
            />
            {enablePublicationSelection && (
              <FloatSelect
                id="publication"
                label="Publication *"
                options={PUBLICATION_OPTIONS}
                value={form.publication}
                onChange={(val) => setForm(f => ({ ...f, publication: val }))}
                error={!!errors.publication}
                helperText={errors.publication}
              />
            )}
            <FloatInput
              id="note"
              label="Note (optional)"
              placeholder="Notes for author..."
              value={form.note}
              onChange={(e) => setForm(f => ({ ...f, note: e.target.value }))}
              multiline
              rows={3}
              error={!!errors.note}
              helperText={errors.note}
            />

            {/* Upload similarity file */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope,sans-serif', margin: '0 0 8px' }}>
                Similarity File <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(PDF/DOC/DOCX, max 2MB)</span>
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                style={{
                  display: 'block', width: '100%', fontSize: 13,
                  fontFamily: 'Manrope,sans-serif', color: '#374151',
                  border: `1px solid ${errors.similarity_file ? '#d32f2f' : '#E2E8F0'}`,
                  borderRadius: 8, padding: '8px 12px', background: '#fff',
                }}
              />
              {errors.similarity_file && (
                <p style={{ fontSize: 12, color: '#d32f2f', marginTop: 4 }}>{errors.similarity_file}</p>
              )}
              {fullpaper.similarity_file && (
                <p style={{ fontSize: 12.5, fontFamily: 'Manrope,sans-serif', marginTop: 8 }}>
                  Current file:{' '}
                  <a href={`/storage/${fullpaper.similarity_file}`} target="_blank" rel="noreferrer"
                    style={{ color: '#0152EA', fontWeight: 600 }}>
                    view file
                  </a>
                  <span style={{ color: '#9CA3AF' }}> — upload a new file to replace it</span>
                </p>
              )}
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 14 }}>
            Selecting <strong style={{ color: '#6B7280' }}>accepted</strong> will send an acceptance email to the author.
          </p>
        </Card>

        <FormActions
          id="fullpaper-edit-status-form"
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

EditorFullpaperEditStatusPage.layout = editorLayout;
