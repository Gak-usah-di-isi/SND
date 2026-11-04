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
  { value: 'Oral', label: 'Oral' },
  { value: 'Poster', label: 'Poster' },
  { value: 'Reject', label: 'Reject' },
];

export default function EditorReviewAbstractFormPage({ abstract, abstractReview, formattedAuthors, formattedAffiliations, badgeCounts }) {
  const [form, setForm] = useState({
    recommendation: abstractReview?.recommendation ?? '',
    comment: abstractReview?.comment ?? '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleCancel = () => router.visit('/reviewer/review-abstract');

  const handleSubmit = () => {
    if (!form.recommendation) {
      setErrors({ recommendation: 'Required' });
      return;
    }
    setSubmitting(true);
    // Sukses tidak di-toast di sini: controller redirect ke halaman list, jadi
    // komponen ini unmount. Toast sukses ditampilkan di list via useFlashToast.
    router.post(`/reviewer/review-abstract/${abstract.route_key}`, form, {
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
          Review Abstract
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Detail Abstract — sama gaya "paper card" seperti User/Abstracts/Show.jsx */}
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
            <p style={{ fontSize: 13.5, color: '#374151', fontFamily: 'Manrope,sans-serif', margin: 0 }}>
              <strong>Keyword:</strong> {abstract.keyword}
            </p>
          )}
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
          id="review-form"
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

EditorReviewAbstractFormPage.layout = editorLayout;
