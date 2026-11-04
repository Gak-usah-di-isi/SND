import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const LABEL = { fontSize: 13, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', display: 'block', marginBottom: 8 };

const ENDPOINT = '/landing/payment_guidelines';

export default function PaymentGuidelineForm({ mode = 'create', initial = null, onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    bank_name: initial?.bank_name ?? '',
    year: initial?.year ?? new Date().getFullYear(),
    guideline: initial?.guideline ?? '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!form.bank_name) nextErrors.bank_name = 'Bank name is required';
    if (!form.year) nextErrors.year = 'Year is required';
    if (!form.guideline) nextErrors.guideline = 'Guideline is required';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    const url = isEdit ? `${ENDPOINT}/${initial.id}` : ENDPOINT;

    router.post(url, { ...form, ...(isEdit ? { _method: 'put' } : {}) }, {
      onSuccess: () => { setLoading(false); onSuccess(); },
      onError: (errs) => { setErrors(errs); setLoading(false); toast.error('Please check your form input.'); },
    });
  };

  return (
    <>
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Payment Guideline Data</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <FloatInput
              id="bank_name"
              label="Bank Name *"
              placeholder="e.g. Bank Mandiri, BCA, BNI"
              value={form.bank_name}
              onChange={setInput('bank_name')}
              error={!!errors.bank_name}
              helperText={errors.bank_name}
            />

            <FloatInput
              id="year"
              label="Year *"
              type="number"
              placeholder="e.g. 2025"
              value={form.year}
              onChange={setInput('year')}
              error={!!errors.year}
              helperText={errors.year}
            />
          </div>

          <div>
            <label htmlFor="guideline" style={LABEL}>Guideline *</label>
            <textarea
              id="guideline"
              rows={14}
              value={form.guideline}
              onChange={setInput('guideline')}
              placeholder="Write payment guidelines for this bank..."
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8,
                border: `1px solid ${errors.guideline ? '#d32f2f' : '#E2E8F0'}`,
                fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
                color: '#1E293B', outline: 'none', resize: 'vertical',
              }}
            />
            {errors.guideline
              ? <p className="text-sm text-red-500 mt-1">{errors.guideline}</p>
              : (
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontFamily: 'Manrope, sans-serif' }}>
                  Basic HTML tags (e.g. &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;) are supported and rendered on the landing page.
                </p>
              )}
          </div>
        </div>
      </Card>

      <FormActions
        id="payment-guideline-form"
        cancelText="Cancel"
        submitText={loading ? 'Saving...' : 'Save'}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
}
