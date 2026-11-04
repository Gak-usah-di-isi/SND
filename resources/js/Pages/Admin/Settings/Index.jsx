import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import AdminPageLayout from '../../../Components/ui/shared/AdminPageLayout';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import RichTextEditor from '../../../Components/ui/RichTextEditor';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import { ToastContainer, useToast } from '../../../Components/ui/Toast';
import StatusBadge from '../../../Components/ui/StatusBadge';

/* ---------- Broadcast Card ---------- */
function BroadcastCard({ icon, title, description, color, bg, loading, onSend }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon={icon} width={24} style={{ color }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1F2A3D', margin: '0 0 4px', fontFamily: 'Manrope, sans-serif' }}>
              {title}
            </p>
            <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0, fontFamily: 'Manrope, sans-serif', lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={loading}
          style={{
            height: 38, padding: '0 20px', borderRadius: 8, flexShrink: 0,
            background: loading ? '#E5E7EB' : color, color: loading ? '#9CA3AF' : '#fff',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 150ms',
          }}
        >
          <Icon
            icon={loading ? 'solar:refresh-outline' : 'solar:plain-2-outline'}
            width={15}
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
          />
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </Card>
  );
}

const ATTENDANCE_OPTIONS = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

const SECTION_TITLE = {
  fontSize: 15, fontWeight: 600, color: '#1F2A3D',
  marginBottom: 20, fontFamily: 'Manrope, sans-serif',
};
const GRID_2 = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 };

/* ---------- Toggle Switch ---------- */
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          backgroundColor: checked ? '#0152EA' : '#E5E7EB',
          display: 'flex', alignItems: 'center', padding: '0 3px',
          transition: 'background 200ms', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 200ms',
        }} />
      </div>
      <span style={{ fontSize: 14, color: '#374151', fontFamily: 'Manrope, sans-serif' }}>{label}</span>
    </label>
  );
}

/* ---------- Tabs ---------- */
const TABS = [
  { key: 'conference', label: 'Conference Info' },
  { key: 'contact',   label: 'Contact & Email' },
  { key: 'payment',   label: 'Payment' },
  { key: 'limits',    label: 'Submission Limits' },
  { key: 'access',    label: 'Access Control' },
  { key: 'years',     label: 'Years' },
  { key: 'broadcast', label: 'Broadcast' },
];

export default function SettingsIndexPage({ settings, years: initialYears = [] }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('conference');

  /* ---- Years state ---- */
  const [years, setYears] = useState(initialYears);
  const [newYear, setNewYear] = useState('');
  const [yearError, setYearError] = useState('');

  /* ---- Broadcast state ---- */
  const [broadcastLoading, setBroadcastLoading] = useState({
    invitation: false,
    parallel: false,
    reminder: false,
    reminderForeign: false,
  });

  const handleBroadcast = (key, url) => {
    setBroadcastLoading(p => ({ ...p, [key]: true }));
    router.post(url, {}, {
      onSuccess: () => {
        toast.success('Email sent successfully.');
        setBroadcastLoading(p => ({ ...p, [key]: false }));
      },
      onError: () => {
        toast.error('Failed to send email.');
        setBroadcastLoading(p => ({ ...p, [key]: false }));
      },
      preserveScroll: true,
    });
  };

  useEffect(() => { setYears(initialYears); }, [initialYears]);

  const [form, setForm] = useState({
    conference_title:             settings?.conference_title ?? '',
    conference_abbreviation:      settings?.conference_abbreviation ?? '',
    conference_chairperson:       settings?.conference_chairperson ?? '',
    administrator_email:          settings?.administrator_email ?? '',
    treasurer_email:              settings?.treasurer_email ?? '',
    bank_account:                 settings?.bank_account ?? '',
    max_abstracts_per_participant: String(settings?.max_abstracts_per_participant ?? ''),
    max_words_in_abstract_body:   String(settings?.max_words_in_abstract_body ?? ''),
    attendance_format:            settings?.attendance_format ?? 'hybrid',
    payment_instruction:          settings?.payment_instruction ?? '',
    open_registration:            settings?.open_registration ?? false,
    open_full_paper_upload:       settings?.open_full_paper_upload ?? false,
    open_abstract_submission:     settings?.open_abstract_submission ?? false,
    enable_publication_selection: settings?.enable_publication_selection ?? true,
  });

  const [errors, setErrors] = useState({});

  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setVal   = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    router.post('/admin/settings', {
      ...form,
      max_abstracts_per_participant: Number(form.max_abstracts_per_participant),
      max_words_in_abstract_body:   Number(form.max_words_in_abstract_body),
    }, {
      onSuccess: () => toast.success('Settings saved successfully.'),
      onError: (errs) => {
        setErrors(errs);
        toast.error('Failed to save. Please check the form.');
      },
    });
  };

  const handleAddYear = () => {
    const val = parseInt(newYear);
    if (!newYear || isNaN(val) || String(val).length !== 4) {
      setYearError('Please enter a valid year (4 digits).');
      return;
    }
    setYearError('');
    router.post('/admin/years', { year: val }, {
      onSuccess: () => {
        toast.success(`Year ${val} added successfully.`);
        setNewYear('');
      },
      onError: (errs) => setYearError(errs?.year ?? 'Year already exists.'),
      preserveScroll: true,
    });
  };

  const handleSetActive = (id, year) => {
    router.post(`/admin/years/${id}/set-active`, {}, {
      onSuccess: () => toast.success(`Year ${year} is now active.`),
      onError: () => toast.error('Failed to activate year.'),
      preserveScroll: true,
    });
  };

  const SaveBtn = () => (
    <div className="flex justify-end mt-6">
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          height: 38, padding: '0 24px', borderRadius: 8,
          background: '#0152EA', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
    </div>
  );

  return (
    <AdminPageLayout currentPath="/admin/settings">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 24, fontFamily: 'Manrope, sans-serif' }}>
        {TABS.find(t => t.key === activeTab)?.label ?? 'Settings'}
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Manrope, sans-serif', background: 'none', border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #0152EA' : '2px solid transparent',
              color: activeTab === tab.key ? '#0152EA' : '#6B7280',
              marginBottom: -1, cursor: 'pointer', transition: 'color 150ms',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ===== Tab: Conference Info ===== */}
        {activeTab === 'conference' && (
          <Card>
            <p style={SECTION_TITLE}>Conference Information</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <FloatInput
                id="conference_title"
                label="Conference Title *"
                placeholder="Enter conference title"
                value={form.conference_title}
                onChange={setInput('conference_title')}
                error={!!errors.conference_title}
                helperText={errors.conference_title}
              />
              <div style={GRID_2}>
                <FloatInput
                  id="conference_abbreviation"
                  label="Abbreviation *"
                  placeholder="E.g. ICASVE 2025"
                  value={form.conference_abbreviation}
                  onChange={setInput('conference_abbreviation')}
                  error={!!errors.conference_abbreviation}
                  helperText={errors.conference_abbreviation}
                />
                <FloatSelect
                  id="attendance_format"
                  label="Attendance Format *"
                  options={ATTENDANCE_OPTIONS}
                  value={form.attendance_format}
                  onChange={setVal('attendance_format')}
                />
              </div>
              <FloatInput
                id="conference_chairperson"
                label="Conference Chairperson *"
                placeholder="Enter chairperson name"
                value={form.conference_chairperson}
                onChange={setInput('conference_chairperson')}
                error={!!errors.conference_chairperson}
                helperText={errors.conference_chairperson}
              />
            </div>
            <SaveBtn />
          </Card>
        )}

        {/* ===== Tab: Contact & Email ===== */}
        {activeTab === 'contact' && (
          <Card>
            <p style={SECTION_TITLE}>Contact & Email</p>
            <div style={GRID_2}>
              <FloatInput
                id="administrator_email"
                label="Administrator Email *"
                placeholder="admin@example.com"
                type="email"
                value={form.administrator_email}
                onChange={setInput('administrator_email')}
                error={!!errors.administrator_email}
                helperText={errors.administrator_email}
              />
              <FloatInput
                id="treasurer_email"
                label="Treasurer Email *"
                placeholder="treasurer@example.com"
                type="email"
                value={form.treasurer_email}
                onChange={setInput('treasurer_email')}
                error={!!errors.treasurer_email}
                helperText={errors.treasurer_email}
              />
            </div>
            <SaveBtn />
          </Card>
        )}

        {/* ===== Tab: Payment ===== */}
        {activeTab === 'payment' && (
          <Card>
            <p style={SECTION_TITLE}>Payment</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <RichTextEditor
                id="bank_account"
                label="Bank Account *"
                placeholder="Enter bank account information (bold, lists and line breaks supported)"
                value={form.bank_account}
                onChange={(html) => setForm(f => ({ ...f, bank_account: html }))}
                rows={10}
                error={!!errors.bank_account}
                helperText={errors.bank_account}
              />
              <FloatInput
                id="payment_instruction"
                label="Payment Instruction *"
                placeholder="Write payment instructions..."
                value={form.payment_instruction}
                onChange={setInput('payment_instruction')}
                multiline
                rows={8}
                error={!!errors.payment_instruction}
                helperText={errors.payment_instruction}
              />
            </div>
            <SaveBtn />
          </Card>
        )}

        {/* ===== Tab: Batas Pengiriman ===== */}
        {activeTab === 'limits' && (
          <Card>
            <p style={SECTION_TITLE}>Submission Limits</p>
            <div style={GRID_2}>
              <FloatInput
                id="max_abstracts"
                label="Max Abstracts Per Participant"
                placeholder="E.g. 1"
                type="number"
                value={form.max_abstracts_per_participant}
                onChange={setInput('max_abstracts_per_participant')}
                error={!!errors.max_abstracts_per_participant}
                helperText={errors.max_abstracts_per_participant}
              />
              <FloatInput
                id="max_words"
                label="Max Words in Abstract Body"
                placeholder="E.g. 250"
                type="number"
                value={form.max_words_in_abstract_body}
                onChange={setInput('max_words_in_abstract_body')}
                error={!!errors.max_words_in_abstract_body}
                helperText={errors.max_words_in_abstract_body}
              />
            </div>
            <SaveBtn />
          </Card>
        )}

        {/* ===== Tab: Access Control ===== */}
        {activeTab === 'access' && (
          <Card>
            <p style={SECTION_TITLE}>Access & Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ padding: '16px 20px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                <Toggle
                  checked={form.open_registration}
                  onChange={setVal('open_registration')}
                  label="Open Registration"
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, marginLeft: 56, fontFamily: 'Manrope, sans-serif' }}>
                  Allow new participants to register for the conference
                </p>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                <Toggle
                  checked={form.open_abstract_submission}
                  onChange={setVal('open_abstract_submission')}
                  label="Open Abstract Submission"
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, marginLeft: 56, fontFamily: 'Manrope, sans-serif' }}>
                  Allow participants to submit and edit abstracts
                </p>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                <Toggle
                  checked={form.open_full_paper_upload}
                  onChange={setVal('open_full_paper_upload')}
                  label="Open Full Paper Upload"
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, marginLeft: 56, fontFamily: 'Manrope, sans-serif' }}>
                  Allow participants to upload full papers
                </p>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                <Toggle
                  checked={form.enable_publication_selection}
                  onChange={setVal('enable_publication_selection')}
                  label="Enable Publication Selection"
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, marginLeft: 56, fontFamily: 'Manrope, sans-serif' }}>
                  Display and enable publication choices (Journal / Proceedings) when participants submit or edit abstracts
                </p>
              </div>
            </div>
            <SaveBtn />
          </Card>
        )}

        {/* ===== Tab: Years ===== */}
        {activeTab === 'years' && (
          <>
            {/* Tambah Year */}
            <Card>
              <p style={SECTION_TITLE}>Add Year</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 240 }}>
                  <FloatInput
                    id="new_year"
                    label="Year"
                    placeholder="E.g. 2026"
                    type="number"
                    value={newYear}
                    onChange={e => { setNewYear(e.target.value); setYearError(''); }}
                    error={!!yearError}
                    helperText={yearError}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddYear}
                  style={{
                    height: 40, padding: '0 16px', borderRadius: 8, marginTop: -3,
                    background: '#0152EA', color: '#fff', border: 'none',
                    fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
                    cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5v14" />
                  </svg>
                  Add Year
                </button>
              </div>
            </Card>

            {/* List Years */}
            <Card>
              <p style={SECTION_TITLE}>Years List</p>
              {years.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'Manrope, sans-serif' }}>No years added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {years.map(y => (
                    <div
                      key={y.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 20px', borderRadius: 8,
                        border: y.is_active ? '1.5px solid #0152EA' : '1px solid #E5E7EB',
                        background: y.is_active ? '#F0F5FF' : '#F8FAFC',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: y.is_active ? '#0152EA' : '#1F2A3D', fontFamily: 'Manrope, sans-serif' }}>
                          {y.year}
                        </span>
                        <StatusBadge label={y.is_active ? 'Active' : 'Inactive'} />
                      </div>
                      {!y.is_active && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(y.id, y.year)}
                          style={{
                            height: 32, padding: '0 16px', borderRadius: 6,
                            background: 'transparent', color: '#0152EA',
                            border: '1px solid #0152EA',
                            fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#0152EA'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0152EA'; }}
                        >
                          Set Active
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}

        {/* ===== Tab: Broadcast ===== */}
        {activeTab === 'broadcast' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Send Invitation */}
            <BroadcastCard
              icon="solar:letter-opened-outline"
              title="Send Invitation"
              description="Send invitation email to all participants with verified payment and accepted abstract."
              color="#0152EA"
              bg="#5D87FF1A"
              loading={broadcastLoading.invitation}
              onSend={() => handleBroadcast('invitation', '/admin/invite/send')}
            />

            {/* Send Parallel Session */}
            <BroadcastCard
              icon="solar:calendar-mark-outline"
              title="Send Parallel Session"
              description="Send parallel session schedule to participants with verified payment and accepted abstract."
              color="#8B5CF6"
              bg="rgba(139,92,246,0.08)"
              loading={broadcastLoading.parallel}
              onSend={() => handleBroadcast('parallel', '/admin/parallel-session/send')}
            />

            {/* Send Payment Reminder */}
            <BroadcastCard
              icon="solar:bell-outline"
              title="Send Email Reminder"
              description="Send payment reminder email to all Indonesian participants who have not completed payment."
              color="#F59E0B"
              bg="rgba(245,158,11,0.08)"
              loading={broadcastLoading.reminder}
              onSend={() => handleBroadcast('reminder', '/admin/payment/send-reminder')}
            />

            {/* Send Payment Reminder Foreign */}
            <BroadcastCard
              icon="solar:global-outline"
              title="Send Email Reminder Foreign"
              description="Send payment reminder email to foreign participants who have not completed payment."
              color="#10B981"
              bg="rgba(16,185,129,0.08)"
              loading={broadcastLoading.reminderForeign}
              onSend={() => handleBroadcast('reminderForeign', '/admin/payment/send-reminder-foreign')}
            />

          </div>
        )}

      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
    </AdminPageLayout>
  );
}
