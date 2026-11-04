import { useState } from 'react';
import { router } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 16, fontFamily: 'Manrope, sans-serif' };

export default function EditorAssignReviewerPage({ abstract, formattedAuthors, formattedAffiliations, reviewers = [], assignedReviewer1, assignedReviewer2, badgeCounts }) {
  const [form, setForm] = useState({
    reviewer_1_id: assignedReviewer1 ? String(assignedReviewer1) : '',
    reviewer_2_id: assignedReviewer2 ? String(assignedReviewer2) : '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const options = reviewers.map(r => ({ value: String(r.id), label: r.name }));
  const handleCancel = () => router.visit('/reviewer/editor-abstract/no-reviewer');

  const handleSubmit = () => {
    if (!form.reviewer_1_id) {
      setErrors({ reviewer_1_id: 'Reviewer 1 is required' });
      return;
    }
    if (form.reviewer_2_id && form.reviewer_2_id === form.reviewer_1_id) {
      setErrors({ reviewer_2_id: 'Reviewer 2 must be different from Reviewer 1' });
      return;
    }
    setSubmitting(true);
    // Sukses tidak di-toast di sini: controller redirect ke halaman No Review,
    // jadi komponen ini unmount. Toast sukses tampil di sana via useFlashToast.
    router.post(`/reviewer/editor-abstract/assign-reviewer/${abstract.id}`, form, {
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to assign reviewers. Please check the form.');
      },
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={handleCancel} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', margin: 0 }}>
          Assign Reviewer
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

        <Card>
          <p style={SECTION_TITLE}>Select Reviewers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <FloatSelect
              id="reviewer_1_id"
              label="Reviewer 1 *"
              options={options}
              value={form.reviewer_1_id}
              onChange={(val) => setForm(f => ({ ...f, reviewer_1_id: val }))}
              error={!!errors.reviewer_1_id}
              helperText={errors.reviewer_1_id}
            />
            <FloatSelect
              id="reviewer_2_id"
              label="Reviewer 2 (optional)"
              options={options}
              value={form.reviewer_2_id}
              onChange={(val) => setForm(f => ({ ...f, reviewer_2_id: val }))}
              error={!!errors.reviewer_2_id}
              helperText={errors.reviewer_2_id}
            />
          </div>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 14 }}>
            Assigned reviewers will receive a notification email, and the abstract status will change to
            {' '}<strong style={{ color: '#6B7280' }}>under review</strong>.
          </p>
        </Card>

        <FormActions
          id="assign-reviewer-form"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          cancelText="Cancel"
          submitText={submitting ? 'Saving...' : 'Assign Reviewers'}
        />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

EditorAssignReviewerPage.layout = editorLayout;
