import { useState } from 'react';
import { router } from '@inertiajs/react';
import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 16, fontFamily: 'Manrope, sans-serif' };

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

export default function EditorFullpaperAssignReviewerPage({
  fullpaper, formattedAuthors, formattedAffiliations,
  reviewers = [], assignedReviewer1, assignedReviewer2, assignedReviewer3, badgeCounts,
}) {
  const [form, setForm] = useState({
    reviewer_1_id: assignedReviewer1 ? String(assignedReviewer1) : '',
    reviewer_2_id: assignedReviewer2 ? String(assignedReviewer2) : '',
    reviewer_3_id: assignedReviewer3 ? String(assignedReviewer3) : '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const abstract = fullpaper.abstract ?? {};
  const options = reviewers.map(r => ({ value: String(r.id), label: r.name }));
  const handleCancel = () => router.visit('/reviewer/editor-fullpaper/no-reviewer');

  const handleSubmit = () => {
    const errs = {};
    if (!form.reviewer_1_id) errs.reviewer_1_id = 'Reviewer 1 is required';
    if (form.reviewer_2_id && form.reviewer_2_id === form.reviewer_1_id) {
      errs.reviewer_2_id = 'Reviewer 2 must be different from Reviewer 1';
    }
    if (form.reviewer_3_id && (form.reviewer_3_id === form.reviewer_1_id || form.reviewer_3_id === form.reviewer_2_id)) {
      errs.reviewer_3_id = 'Reviewer 3 must be different from other reviewers';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    // Sukses tidak di-toast di sini: controller redirect ke halaman No Review,
    // jadi komponen ini unmount. Toast sukses tampil di sana via useFlashToast.
    router.post(`/reviewer/editor-fullpaper/assign-reviewer/${fullpaper.id}`, form, {
      onError: (errs2) => {
        setErrors(errs2);
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
            <FloatSelect
              id="reviewer_3_id"
              label="Reviewer 3 (optional)"
              options={options}
              value={form.reviewer_3_id}
              onChange={(val) => setForm(f => ({ ...f, reviewer_3_id: val }))}
              error={!!errors.reviewer_3_id}
              helperText={errors.reviewer_3_id}
            />
          </div>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif', marginTop: 14 }}>
            Full paper status will change to <strong style={{ color: '#6B7280' }}>under review</strong>.
          </p>
        </Card>

        <FormActions
          id="fullpaper-assign-form"
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

EditorFullpaperAssignReviewerPage.layout = editorLayout;
