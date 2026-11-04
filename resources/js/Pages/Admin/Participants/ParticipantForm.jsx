import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '../../../Components/ui/card';
import { FloatInput } from '../../../Components/ui/FloatInput';
import { FloatSelect } from '../../../Components/ui/FloatSelect';
import FormActions from '../../../Components/ui/FormActions';

const ATTENDANCE_OPTIONS = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'online', label: 'Online' },
];

const SECTION_TITLE = { fontSize: 16, fontWeight: 600, color: '#1F2A3D', marginBottom: 20, fontFamily: 'Manrope, sans-serif' };
const GRID_2 = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 };
const GRID_3 = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 };

export default function ParticipantForm({ mode = 'create', initial = null, roleOptions = [], countries = [], onCancel, onSuccess, toast }) {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    name_certificate: initial?.name_certificate ?? '',
    email: initial?.email ?? '',
    password: '', password_confirmation: '',
    institution: initial?.institution ?? '',
    job_title: initial?.job_title ?? '',
    phone_number: initial?.phone_number ?? '',
    country: initial?.country ?? '',
    attendance: initial?.attendance ?? '',
    role_id: initial?.roles?.[0]?.id ? String(initial.roles[0].id) : '',
    is_student: Boolean(initial?.is_student),
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setVal   = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const roleOpts    = roleOptions.map(r => ({ value: String(r.id), label: ROLE_LABEL[r.name] ?? r.name }));
  const countryOpts = countries.map(c => ({ value: c.name, label: c.name }));

  const handleSubmit = () => {
    setLoading(true);
    const url    = isEdit ? `/admin/participant/${initial.id}` : '/admin/participant';
    const method = isEdit ? 'put' : 'post';
    const data   = isEdit
      ? (() => { const { password, password_confirmation, ...rest } = form; return rest; })()
      : form;

    router[method](url, data, {
      onSuccess: () => { setLoading(false); onSuccess(); },
      onError: (errs) => { setErrors(errs); setLoading(false); toast.error('Please check the form.'); },
    });
  };

  return (
    <>
      {/* Personal Details */}
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Personal Details</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={GRID_2}>
            <FloatInput id="name" label="Name *" placeholder="E.g. Dr. Budi Utomo, M.Sc."
              value={form.name} onChange={setInput('name')} error={!!errors.name} helperText={errors.name} />
            <FloatInput id="name_certificate" label="Name on Certificate *" placeholder="Name on certificate"
              value={form.name_certificate} onChange={setInput('name_certificate')} error={!!errors.name_certificate} helperText={errors.name_certificate} />
          </div>
          <div style={GRID_2}>
            <FloatInput id="institution" label="Institution *" placeholder="E.g. Universitas Brawijaya"
              value={form.institution} onChange={setInput('institution')} error={!!errors.institution} helperText={errors.institution} />
            <FloatInput id="job_title" label="Job Title *" placeholder="E.g. Professor, PhD student"
              value={form.job_title} onChange={setInput('job_title')} error={!!errors.job_title} helperText={errors.job_title} />
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Contact</p>
        <div style={GRID_2}>
          <FloatInput id="email" label="Email *" type="email" placeholder="E.g. budiutomo@gmail.com"
            value={form.email} onChange={setInput('email')} error={!!errors.email} helperText={errors.email} />
          <FloatInput id="phone_number" label="Phone Number *" placeholder="E.g. 081234567890"
            value={form.phone_number} onChange={setInput('phone_number')} error={!!errors.phone_number} helperText={errors.phone_number} />
        </div>
      </Card>

      {/* Registration */}
      <Card style={{ marginBottom: 20 }}>
        <p style={SECTION_TITLE}>Registration</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={GRID_3}>
            <FloatSelect id="country" label="Country *" options={countryOpts}
              value={form.country} onChange={setVal('country')} placeholder="Select country"
              error={!!errors.country} helperText={errors.country} />
            <FloatSelect id="attendance" label="Attendance Type *" options={ATTENDANCE_OPTIONS}
              value={form.attendance} onChange={setVal('attendance')} placeholder="Select attendance type"
              error={!!errors.attendance} helperText={errors.attendance} />
            <FloatSelect id="role_id" label="Registration Type *" options={roleOpts}
              value={form.role_id} onChange={setVal('role_id')} placeholder="Select role"
              error={!!errors.role_id} helperText={errors.role_id} />
          </div>

          <label
            htmlFor="is_student"
            className="flex items-start gap-3 cursor-pointer select-none p-4 rounded-xl border transition-colors"
            style={{
              background: form.is_student ? 'rgba(1,82,234,0.04)' : '#F9FAFB',
              borderColor: form.is_student ? '#0152EA' : '#E2E8F0',
            }}
          >
            <input
              type="checkbox"
              id="is_student"
              checked={form.is_student}
              onChange={(e) => setForm(f => ({ ...f, is_student: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Student / Mahasiswa
              </span>
              <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Check this box if the participant is a student to apply student rates on conference invoices.
              </p>
            </div>
          </label>
          {errors.is_student && <p className="text-xs text-red-500 mt-1">{errors.is_student}</p>}
        </div>
      </Card>

      {/* Account — only on create */}
      {!isEdit && (
        <Card style={{ marginBottom: 20 }}>
          <p style={SECTION_TITLE}>Account</p>
          <div style={GRID_2}>
            <FloatInput id="password" label="Password *" type="password" placeholder="Min. 8 characters"
              value={form.password} onChange={setInput('password')} error={!!errors.password} helperText={errors.password} />
            <FloatInput id="password_confirmation" label="Confirm Password *" type="password" placeholder="Repeat password"
              value={form.password_confirmation} onChange={setInput('password_confirmation')} />
          </div>
        </Card>
      )}

      {/* Actions */}
      <FormActions
        id="participant-form"
        cancelText="Cancel"
        submitText={loading ? 'Saving...' : 'Save'}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </>
  );
}

const ROLE_LABEL = {
  'indonesia-participants': 'Indonesia Participant',
  'indonesia-presenter':    'Indonesia Presenter',
  'foreign-participants':   'Foreign Participant',
  'foreign-presenter':      'Foreign Presenter',
};
