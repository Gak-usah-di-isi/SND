import { useState, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { FloatInput } from '../../Components/ui/FloatInput';
import { FloatSelect } from '../../Components/ui/FloatSelect';

const ATTENDANCE_OPTIONS = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'online', label: 'Online' },
];

const ROLE_ORDER = [
  'indonesia-presenter',
  'foreign-presenter',
  'indonesia-participants',
  'foreign-participants',
  'reviewer',
];

const STEP1_FIELDS = ['name', 'institution', 'job_title', 'phone_number', 'country', 'attendance', 'role_id'];

export default function Register({
  conferenceTitle,
  conferenceAbbreviation,
  logoPath,
  openRegistration,
  roles = [],
  countries = [],
}) {
  const { flash } = usePage().props;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    institution: '',
    job_title: '',
    phone_number: '',
    country: '',
    attendance: '',
    role_id: '',
    is_student: false,
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const roleOptions = useMemo(() => {
    return [...roles]
      .sort((a, b) => {
        const idxA = ROLE_ORDER.indexOf(a.name);
        const idxB = ROLE_ORDER.indexOf(b.name);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      })
      .map((r) => ({ value: String(r.id), label: r.display_name }));
  }, [roles]);
  const countryOptions = countries.map((c) => ({ value: c.name, label: c.name }));

  const goToStep2 = () => {
    const missing = STEP1_FIELDS.filter((f) => !form[f]);
    if (missing.length) {
      const errs = {};
      missing.forEach((f) => (errs[f] = 'Required'));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post('/register', form, {
      onError: (errs) => {
        setErrors(errs);
        if (STEP1_FIELDS.some((f) => errs[f])) setStep(1);
      },
      onFinish: () => setLoading(false),
    });
  };

  const tagline = `${conferenceTitle} — ${conferenceAbbreviation}`;

  if (!openRegistration) {
    return (
      <AuthLayout tagline={tagline}>
        <div className="text-center rounded-lg border border-red-200 bg-red-50 p-6">
          <h4 className="mb-1 text-lg font-bold text-red-700">⚠ Registration Closed</h4>
          <p className="text-sm text-red-600">We're sorry, but registration is currently closed.</p>
        </div>
        {flash?.message && (
          <div className="mt-4 p-3 text-sm rounded-lg border text-red-700 bg-red-50 border-red-200">
            {flash.message}
          </div>
        )}
        <div className="flex gap-2 text-base opacity-90 mt-6 items-center justify-center">
          <p>Already have an Account?</p>
          <Link href="/login" className="text-[#db2896] text-sm font-medium">
            Sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout tagline={tagline}>
      {step === 2 && (
        <div className="text-center">
          <img src={logoPath} alt="Logo ICASVE" className="inline-block mb-2 h-14 w-auto object-contain" />
        </div>
      )}
      <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5">
        Create your account
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 pt-5">
        {step === 1 ? (
          <>
            <div className="mb-4">
              <FloatInput id="name" label="Full Name" placeholder="E.g. Dr. Budi Utomo, M.Sc." fullWidth
                value={form.name} onChange={setInput('name')} error={!!errors.name} helperText={errors.name} />
            </div>
            <div className="mb-4">
              <FloatInput id="institution" label="Institution" placeholder="E.g. Universitas Brawijaya" fullWidth
                value={form.institution} onChange={setInput('institution')} error={!!errors.institution} helperText={errors.institution} />
            </div>
            <div className="mb-4">
              <FloatInput id="job_title" label="Job Title" placeholder="E.g. Professor, PhD student" fullWidth
                value={form.job_title} onChange={setInput('job_title')} error={!!errors.job_title} helperText={errors.job_title} />
            </div>
            <div className="mb-4">
              <FloatInput id="phone_number" label="Phone Number / WhatsApp" placeholder="E.g. +6281234567890" fullWidth
                value={form.phone_number} onChange={setInput('phone_number')} error={!!errors.phone_number} helperText={errors.phone_number} />
            </div>
            <div className="mb-4">
              <FloatSelect id="country" label="Country" options={countryOptions} placeholder="Select country"
                value={form.country} onChange={setVal('country')} error={!!errors.country} helperText={errors.country} />
            </div>
            <div className="mb-4">
              <FloatSelect id="attendance" label="Attendance Type" options={ATTENDANCE_OPTIONS} placeholder="Select attendance type"
                value={form.attendance} onChange={setVal('attendance')} error={!!errors.attendance} helperText={errors.attendance} />
            </div>
            <div className="mb-4">
              <FloatSelect id="role_id" label="Registration Type" options={roleOptions} placeholder="Select registration type"
                value={form.role_id} onChange={setVal('role_id')} error={!!errors.role_id} helperText={errors.role_id} />
            </div>

            <div className="mb-5">
              <label className="flex items-start gap-3 p-2 cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  id="is_student"
                  checked={form.is_student}
                  onChange={(e) => setForm((f) => ({ ...f, is_student: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    I am a Student / Mahasiswa
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    Check if you are registering with student status.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="button"
              id="register-step-1-button"
              onClick={goToStep2}
              className="rounded-md w-full py-2.5 text-sm font-semibold text-white transition cursor-pointer"
              style={{ background: '#141a63' }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <FloatInput id="email" label="Email" type="email" placeholder="Enter email" fullWidth
                value={form.email} onChange={setInput('email')} error={!!errors.email} helperText={errors.email} />
            </div>

            <div className="mb-4 relative">
              <FloatInput id="password" label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" fullWidth
                value={form.password} onChange={setInput('password')} error={!!errors.password} helperText={errors.password} />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-4 relative">
              <FloatInput id="confirm-password" label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat password" fullWidth
                value={form.password_confirmation} onChange={setInput('password_confirmation')} error={!!errors.password_confirmation} helperText={errors.password_confirmation} />
              <button type="button" onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                id="register-step-2-back-button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="rounded-md flex-1 py-2.5 text-sm font-semibold border transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                style={{ borderColor: '#E2E8F0', color: '#141a63' }}
              >
                Back
              </button>
              <button
                type="submit"
                id="register-step-2-button"
                disabled={loading}
                className="rounded-md flex-1 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                style={{ background: '#db2896' }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="flex gap-2 text-base opacity-90 mt-6 items-center justify-center">
        <p>Already have an Account?</p>
        <Link href="/login" className="text-[#db2896] text-sm font-medium">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
