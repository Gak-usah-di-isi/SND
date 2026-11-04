import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { SearchableSelect } from '../../../Components/ui/SearchableSelect';
import { ToggleGroup } from '../../../Components/ui/ToggleGroup';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'Rupiah (IDR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

export default function ManualReceiptIndexPage({ users = [] }) {
  const toast   = useToast();
  const fileRef = useRef(null);

  const [form, setForm]         = useState({ user_id: '', currency: 'IDR', amount: '' });
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const userOptions = users.map(u => ({
    value: u.id,
    label: u.name,
    sub: u.institution ?? u.email ?? '',
  }));

  const setVal = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!form.user_id) newErrors.user_id = 'Participant is required.';
    if (!form.amount)  newErrors.amount  = 'Amount is required.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    const data = new FormData();
    data.append('user_id',  form.user_id);
    data.append('currency', form.currency);
    data.append('amount',   form.amount);
    if (file) data.append('file', file);

    router.post('/admin/manual-receipt', data, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Receipt created and payment verified successfully.');
        setForm({ user_id: '', currency: 'IDR', amount: '' });
        setFile(null);
        setErrors({});
        setLoading(false);
      },
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to create receipt. Please check the form.');
        setLoading(false);
      },
    });
  };

  return (
    <AdminPageLayout currentPath="/admin/manual-receipt">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 24, fontFamily: 'Manrope,sans-serif' }}>
        Manual Receipt
      </h1>

      {/* Warning box */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 18px', borderRadius: 10, marginBottom: 24,
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
      }}>
        <Icon icon="solar:danger-triangle-outline" width={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 13, color: '#92400E', margin: 0, fontFamily: 'Manrope,sans-serif', lineHeight: 1.6 }}>
          <strong>Attention:</strong> Manual receipt creation is for emergency conditions only.
          Please make sure all entered data is accurate before saving.
        </p>
      </div>

      {/* Form Card */}
      <Card style={{ maxWidth: 600 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>
          Payment Information
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Participant */}
          <SearchableSelect
            id="user_id"
            label="Participant *"
            options={userOptions}
            value={form.user_id}
            onChange={setVal('user_id')}
            placeholder="Search and select participant..."
            error={!!errors.user_id}
            helperText={errors.user_id}
          />

          {/* Currency toggle + Amount */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Manrope,sans-serif' }}>
              Currency *
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' }}>
            <ToggleGroup
              options={CURRENCY_OPTIONS}
              value={form.currency}
              onChange={setVal('currency')}
            />
            <FloatInput
              id="amount"
              label="Amount *"
              placeholder="Example: 500000"
              type="number"
              value={form.amount}
              onChange={setInput('amount')}
              error={!!errors.amount}
              helperText={errors.amount}
            />
            </div>
          </div>

          {/* Upload file */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8, fontFamily: 'Manrope,sans-serif' }}>
              Payment Proof <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                padding: '20px 16px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px dashed ${dragging ? '#0152EA' : file ? '#10B981' : '#D1D5DB'}`,
                background: dragging ? 'rgba(1,82,234,0.04)' : file ? 'rgba(16,185,129,0.04)' : '#F8FAFC',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (!file && !dragging) { e.currentTarget.style.borderColor = '#60A5FA'; e.currentTarget.style.background = '#EFF6FF'; }}}
              onMouseLeave={e => { if (!file && !dragging) { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F8FAFC'; }}}
            >
              <Icon
                icon={file ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'}
                width={28}
                style={{ color: file ? '#10B981' : '#9CA3AF' }}
              />
              <span style={{ fontSize: 13, color: file ? '#10B981' : '#6B7280', fontFamily: 'Manrope,sans-serif', textAlign: 'center' }}>
                {file ? file.name : 'Click or drag file here'}
              </span>
              <span style={{ fontSize: 11.5, color: '#9CA3AF', fontFamily: 'Manrope,sans-serif' }}>
                JPG, PNG, PDF — max 2MB
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />
            </div>
            {file && (
              <button
                type="button"
                onClick={() => { setFile(null); fileRef.current.value = ''; }}
                style={{
                  marginTop: 6, fontSize: 12, color: '#EF4444', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'Manrope,sans-serif',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Icon icon="solar:trash-bin-minimalistic-outline" width={13} />
                Remove file
              </button>
            )}
            {errors.file && (
              <p style={{ fontSize: 11.5, color: '#d32f2f', marginTop: 4, fontFamily: 'Manrope,sans-serif' }}>{errors.file}</p>
            )}
          </div>

        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 40, padding: '0 28px', borderRadius: 8,
              background: loading ? '#93BFFD' : '#0152EA',
              color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 600, fontFamily: 'Manrope,sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background 150ms',
            }}
          >
            {loading
              ? <><Icon icon="solar:refresh-outline" width={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              : <><Icon icon="solar:ticket-sale-outline" width={16} /> Make Receipt</>
            }
          </button>
        </div>
      </Card>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
