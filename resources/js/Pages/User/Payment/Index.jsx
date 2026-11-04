import { useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import UserPageLayout from '../../../Components/ui/shared/UserPageLayout';
import { Card } from '../../../Components/ui/card';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import { useFlashToast } from '../../../hooks/useFlashToast';

const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'Rupiah (IDR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

// Info rekening bersifat dinamis dari Admin Settings (ConferenceSetting.bank_account).
// Isinya bisa berupa teks biasa maupun HTML dari Rich Text Editor — jangan hardcode di sini.

function formatAmount(amount, currency) {
  const value = Number(amount);
  return currency === 'USD'
    ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `Rp ${value.toLocaleString('id-ID')}`;
}

export default function UserPaymentIndex({ existingPayment, conferenceSetting, isArchive = false }) {
  const toast = useToast();
  useFlashToast(toast);
  const { errors } = usePage().props;
  const fileRef = useRef(null);

  // Mode arsip: tahun sebelumnya hanya bisa dilihat, tidak bisa diunggah ulang.
  const canEdit = !isArchive && (!existingPayment || existingPayment.status !== 'verified');

  const [currency, setCurrency] = useState(existingPayment?.currency ?? 'IDR');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // bank_account bisa berupa plain text lama maupun HTML dari Rich Text Editor.
  const bankAccountHtml = conferenceSetting?.bank_account?.trim() ?? '';

  const instructions = conferenceSetting?.payment_instruction
    ? conferenceSetting.payment_instruction.split('\n')
    : [];

  const handleSubmit = () => {
    const data = new FormData();
    data.append('currency', currency);
    if (amount) data.append('amount', amount.replace(/\D/g, ''));
    if (file) data.append('file', file);

    setLoading(true);
    router.post('/filepayments', data, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        setAmount('');
        setFile(null);
        if (fileRef.current) fileRef.current.value = '';
      },
      onError: () => {
        setLoading(false);
        toast.error('Please check your form input.');
      },
    });
  };

  return (
    <UserPageLayout currentPath="/payment">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' }}>
        Payment
      </h1>

      <Card className="mb-4">
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 12 }}>
          Payment Information
        </h2>
        <p className="text-sm text-gray-500 mb-3">Please make your payment through the following details:</p>
        <p className="text-sm text-gray-600 mb-2">Please transfer your registration fee to:</p>
        <p className="font-bold mb-4" style={{ color: '#0152EA' }}>Universitas Brawijaya</p>

        {bankAccountHtml ? (
          <div
            className="px-4 py-3"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}
          >
            <style>{`
              .bank-account-content p { margin: 0 0 8px; }
              .bank-account-content p:last-child { margin-bottom: 0; }
              .bank-account-content div { margin: 0; }
              .bank-account-content ul { list-style: disc; margin: 6px 0; padding-left: 20px; }
              .bank-account-content ol { list-style: decimal; margin: 6px 0; padding-left: 20px; }
              .bank-account-content li { margin: 2px 0; }
            `}</style>
            <div
              className="bank-account-content text-sm text-gray-800 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: bankAccountHtml }}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-red-500">No payment methods available</p>
        )}
      </Card>

      <Card className="mb-4">
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 12 }}>
          Payment Instruction
        </h2>
        <p className="text-sm text-gray-500 mb-3">Please make your payment through the following details:</p>
        {instructions.length > 0 && instructions[0] !== '' ? (
          <ol className="list-decimal ml-5 text-sm text-gray-700 flex flex-col gap-1">
            {instructions.map((ins, i) => <li key={i}>{ins}</li>)}
          </ol>
        ) : (
          <p className="text-sm text-gray-400">No payment instructions available.</p>
        )}
      </Card>

      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Payment Details
        </h2>

        {existingPayment?.amount && (
          <div className="flex items-start gap-2 px-4 py-3 mb-4" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8 }}>
            <Icon icon="solar:info-circle-outline" width={18} style={{ color: '#0152EA', flexShrink: 0, marginTop: 2 }} />
            <p className="text-sm" style={{ color: '#1E3A8A' }}>
              File uploaded successfully and Payment amount: {formatAmount(existingPayment.amount, existingPayment.currency)} has been {existingPayment.status}
            </p>
          </div>
        )}

        {canEdit && (
          <div className="flex flex-col gap-4 mb-4">
            <FloatSelect
              id="currency"
              label="Select Currency"
              options={CURRENCY_OPTIONS}
              value={currency}
              onChange={setCurrency}
              error={Boolean(errors?.currency)}
              helperText={errors?.currency}
            />

            <FloatInput
              id="amount"
              label={`Payment Amount${!existingPayment ? ' *' : ''}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Example: 100000"
              error={Boolean(errors?.amount)}
              helperText={errors?.amount || 'Enter the amount without dots or commas'}
            />

            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Payment Proof{!existingPayment ? ' *' : ''}
              </p>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
                className="flex flex-col items-center gap-2 cursor-pointer"
                style={{
                  padding: '20px 16px', borderRadius: 10,
                  border: `2px dashed ${dragging ? '#0152EA' : file ? '#10B981' : '#E2E8F0'}`,
                  background: dragging ? 'rgba(1,82,234,0.04)' : file ? 'rgba(16,185,129,0.04)' : '#fff',
                }}
              >
                <Icon icon={file ? 'solar:check-circle-outline' : 'solar:upload-minimalistic-outline'} width={28} style={{ color: file ? '#10B981' : '#9CA3AF' }} />
                <span className="text-sm" style={{ color: file ? '#10B981' : '#6B7280' }}>
                  {file ? file.name : 'Choose file'}
                </span>
                <span className="text-xs text-gray-400">Accepted formats: JPG, JPEG, PNG | Max: 2MB</span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              {errors?.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white"
              style={{ background: loading ? '#93BFFD' : '#0152EA', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Manrope,sans-serif' }}
            >
              {loading ? 'Saving...' : existingPayment ? 'Update' : 'Save'}
            </button>
          )}
          {existingPayment?.file_path && (
            <a
              href={`/filepayments/${existingPayment.id}/proof`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-medium"
              style={{ background: '#F1F5F9', color: '#374151', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}
            >
              View File
            </a>
          )}
          {existingPayment?.status === 'verified' && (
            <a
              href={`/filepayments/${existingPayment.id}/receipt`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-medium"
              style={{ background: '#fff', color: '#0152EA', border: '1px solid #0152EA', borderRadius: 8, textDecoration: 'none', fontFamily: 'Manrope,sans-serif' }}
            >
              Digital PDF
            </a>
          )}
        </div>
      </Card>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </UserPageLayout>
  );
}
