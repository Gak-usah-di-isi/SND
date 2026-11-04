import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import BackButton from '../../../Components/ui/BackButton';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import FormActions from '../../../Components/ui/FormActions';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';

// Data dokumen sampel disesuaikan dengan kebutuhan Email & Invoice Template
const SAMPLE_DOCS = {
  email: [
    { id: 'abstract_accepted', name: 'Email Template Abstract Accepted', description: 'Email format for announcing abstract acceptance by reviewers.' },
    { id: 'fullpaper_accepted', name: 'Email Template Full Paper Accepted', description: 'Email format for announcing full paper acceptance for publication.' },
  ],
  invoice: [
    { id: 'abstract_invoice_idr', name: 'Email Template Abstract Invoice IDR', description: 'Email format for abstract payment invoice in IDR currency.' },
    { id: 'abstract_invoice_usd', name: 'Email Template Abstract Invoice USD', description: 'Email format for abstract payment invoice in USD currency.' },
  ],
};

const TABS = [
  { key: 'email', label: 'Email Template' },
  { key: 'invoice', label: 'Invoice Template' },
];

const TAB_TITLES = {
  email: 'Email Template',
  invoice: 'Invoice Template'
};

function DocIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function DocumentCard({ doc, onLihatDokumen }) {
  return (
    <div
      className="bg-white flex flex-col justify-between"
      style={{
        borderRadius: 12,
        padding: 24,
        minHeight: 200,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9',
        transition: 'box-shadow 150ms'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'}
    >
      <div>
        <p className="font-semibold text-gray-800 mb-2" style={{ fontSize: '1.0625rem', fontFamily: 'Manrope, sans-serif' }}>
          {doc.name}
        </p>
        {doc.description && (
          <p className="text-sm text-gray-500 mb-6" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'Manrope, sans-serif' }}>
            {doc.description}
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onLihatDokumen(doc)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium"
          style={{
            backgroundColor: 'rgba(1,82,234,0.08)',
            color: '#0152EA',
            borderRadius: 8,
            fontFamily: 'Manrope, sans-serif',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 150ms'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.08)'}
        >
          View Document
        </button>
      </div>
    </div>
  );
}

function formatTitle(type) {
  if (!type) return '';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function EmailTemplateEditView({ emailTemplate, onBack }) {
  const toast = useToast();

  const [form, setForm] = useState({
    custom_pesan: emailTemplate?.content || '',
    total_pembayaran: emailTemplate?.amount || '',
    total_pembayaran_student: emailTemplate?.amount_student || '',
  });

  const [formErrors, setFormErrors] = useState({
    custom_pesan: '',
    total_pembayaran: '',
    total_pembayaran_student: '',
  });

  const isInvoiceType = emailTemplate?.type === 'abstract_invoice_idr' || emailTemplate?.type === 'abstract_invoice_usd';

  const handleSubmit = () => {
    let hasError = false;
    let errors = { custom_pesan: '', total_pembayaran: '', total_pembayaran_student: '' };

    if (!form.custom_pesan.trim()) {
      errors.custom_pesan = 'Custom Message is required.';
      hasError = true;
    }

    if (isInvoiceType && !String(form.total_pembayaran).trim()) {
      errors.total_pembayaran = 'Total Payment is required.';
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    router.post(`/admin/email-template/${emailTemplate.type}/update`, {
      content: form.custom_pesan.trim(),
      amount: isInvoiceType ? form.total_pembayaran : null,
      amount_student: isInvoiceType && String(form.total_pembayaran_student).trim() !== '' ? form.total_pembayaran_student : null,
    }, {
      preserveState: true,
      preserveScroll: true,
      onError: (serverErrors) => {
        setFormErrors({
          custom_pesan: serverErrors?.custom_pesan || '',
          total_pembayaran: serverErrors?.total_pembayaran || '',
          total_pembayaran_student: serverErrors?.total_pembayaran_student || '',
        });
      },
      onSuccess: () => {
        setFormErrors({ custom_pesan: '', total_pembayaran: '', total_pembayaran_student: '' });
        toast.success('Template saved successfully.');
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onBack} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          {formatTitle(emailTemplate?.type || 'Abstract Accepted')}
        </h1>
      </div>

      <Card>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>
          Template Details
        </h2>

        <div className="flex flex-col gap-4">
          <FloatInput
            id="custom-pesan"
            label="Custom Message *"
            value={form.custom_pesan}
            onChange={(e) => {
              setForm(prev => ({ ...prev, custom_pesan: e.target.value }));
              if (formErrors.custom_pesan) setFormErrors(prev => ({ ...prev, custom_pesan: '' }));
            }}
            placeholder="Enter custom message template content here..."
            multiline
            rows={5}
            error={Boolean(formErrors.custom_pesan)}
            helperText={formErrors.custom_pesan || undefined}
          />

          {isInvoiceType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatInput
                id="total-pembayaran"
                label="Total Payment (Regular) *"
                value={form.total_pembayaran}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, total_pembayaran: e.target.value }));
                  if (formErrors.total_pembayaran) setFormErrors(prev => ({ ...prev, total_pembayaran: '' }));
                }}
                placeholder="Enter regular payment amount"
                error={Boolean(formErrors.total_pembayaran)}
                helperText={formErrors.total_pembayaran || undefined}
              />
              <FloatInput
                id="total-pembayaran-student"
                label="Total Payment (Student)"
                value={form.total_pembayaran_student}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, total_pembayaran_student: e.target.value }));
                  if (formErrors.total_pembayaran_student) setFormErrors(prev => ({ ...prev, total_pembayaran_student: '' }));
                }}
                placeholder="Enter student payment amount"
                error={Boolean(formErrors.total_pembayaran_student)}
                helperText={formErrors.total_pembayaran_student || 'Special rate applied if user is registered as student'}
              />
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6">
        <FormActions
          id="email-template-form"
          cancelText="Cancel"
          submitText="Save"
          onCancel={onBack}
          onSubmit={handleSubmit}
        />
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </>
  );
}

export default function EmailTemplateIndexPage({ emailTemplates = {} }) {
  const [activeTab, setActiveTab] = useState('email');
  const [view, setView] = useState('list');
  const [selectedType, setSelectedType] = useState(null);

  const docs = SAMPLE_DOCS[activeTab] || [];

  const handleLihatDokumen = (doc) => {
    setSelectedType(doc.id);
    setView('edit');
  };

  const handleBack = () => {
    setSelectedType(null);
    setView('list');
  };

  if (view === 'edit') {
    return (
      <AdminPageLayout currentPath="/admin/email-template">
        <EmailTemplateEditView
          emailTemplate={emailTemplates[selectedType] ?? { type: selectedType }}
          onBack={handleBack}
        />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout currentPath="/admin/email-template">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
          {TAB_TITLES[activeTab]}
        </h1>
        <button
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: '#0152EA', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
        >
          <DocIcon />
          Add Document
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px"
            style={{
              borderColor: activeTab === t.key ? '#0152EA' : 'transparent',
              color: activeTab === t.key ? '#0152EA' : '#64748B',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {docs.map((d) => (
          <DocumentCard key={d.id} doc={d} onLihatDokumen={handleLihatDokumen} />
        ))}
      </div>
    </AdminPageLayout>
  );
}
