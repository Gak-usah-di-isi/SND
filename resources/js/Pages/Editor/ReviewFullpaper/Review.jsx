import { useState } from 'react';
import { router } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 16, fontFamily: 'Manrope, sans-serif' };

const RECOMMENDATION_OPTIONS = [
  { value: 'Publish', label: 'Published' },
  { value: 'Poster', label: 'Poster' },
  { value: 'Reject', label: 'Reject' },
];

function FileLink({ href, label, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-2 transition-colors"
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

export default function EditorReviewFullpaperFormPage({ fullpaper, fullpaperReview, formattedAuthors, formattedAffiliations, badgeCounts }) {
  const [form, setForm] = useState({
    recommendation: fullpaperReview?.recommendation ?? '',
    comment: fullpaperReview?.comment ?? '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const abstract = fullpaper.abstract ?? {};
  const handleCancel = () => router.visit('/reviewer/review-fullpaper');

  const handleSubmit = () => {
    if (!form.recommendation) {
      setErrors({ recommendation: 'Required' });
      return;
    }
    setSubmitting(true);
    // Sukses tidak di-toast di sini: controller redirect ke halaman list, jadi
    // komponen ini unmount. Toast sukses ditampilkan di list via useFlashToast.
    router.post(`/reviewer/review-fullpaper/${fullpaper.id}`, form, {
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to save review. Please check the form.');
      },
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={handleCancel} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Review Full Paper
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

          {/* File full paper */}
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
              <p style={{ fontSize: 13.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', margin: 0 }}>No file available</p>
            )}
          </div>
        </div>

        {/* Review Form */}
        <Card>
          <p style={SECTION_TITLE}>Review</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FloatSelect
              id="recommendation"
              label="Recommendation *"
              options={RECOMMENDATION_OPTIONS}
              value={form.recommendation}
              onChange={(val) => setForm(f => ({ ...f, recommendation: val }))}
              error={!!errors.recommendation}
              helperText={errors.recommendation}
            />
            <FloatInput
              id="comment"
              label="Comment"
              placeholder="Write review notes here..."
              value={form.comment}
              onChange={(e) => setForm(f => ({ ...f, comment: e.target.value }))}
              multiline
              rows={5}
              error={!!errors.comment}
              helperText={errors.comment}
            />
          </div>
        </Card>

        <FormActions
          id="fullpaper-review-form"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          cancelText="Cancel"
          submitText={submitting ? 'Saving...' : 'Submit Review'}
        />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorReviewFullpaperFormPage.layout = editorLayout;
