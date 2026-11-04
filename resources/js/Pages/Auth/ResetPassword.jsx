import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { FloatInput } from '../../Components/ui/FloatInput';

export default function ResetPassword({ token, email = '', conferenceTitle, conferenceAbbreviation, logoPath }) {
  const { flash } = usePage().props;
  const [form, setForm] = useState({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post('/reset-password', form, {
      onError: (errs) => setErrors(errs),
      onFinish: () => setLoading(false),
    });
  };

  return (
    <AuthLayout tagline={`${conferenceTitle || 'Seminar Nasional Berdampak'} — ${conferenceAbbreviation || 'SND'}`}>
      <div className="text-center">
        <img src={logoPath} alt={`Logo ${conferenceAbbreviation || 'SND'}`} className="inline-block mb-2 h-14 w-auto object-contain" />
      </div>
      <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5 text-center">
        Reset Password
      </h3>
      <p className="flex justify-center items-center text-sm font-medium opacity-90 text-center text-gray-600 mb-6">
        Please enter your email and set your new password.
      </p>

      {flash?.message && (
        <div
          className={`mb-4 p-3 text-sm rounded-lg border ${
            flash.type === 'success'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}
        >
          {flash.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <input type="hidden" name="token" value={form.token} />

        <div className="mb-4">
          <FloatInput
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            value={form.email}
            onChange={setInput('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
            autoFocus
          />
        </div>

        <div className="mb-4 relative">
          <FloatInput
            id="password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            fullWidth
            value={form.password}
            onChange={setInput('password')}
            error={!!errors.password}
            helperText={errors.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="mb-6 relative">
          <FloatInput
            id="password_confirmation"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            fullWidth
            value={form.password_confirmation}
            onChange={setInput('password_confirmation')}
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((s) => !s)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md w-full py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: '#141a63' }}
        >
          {loading ? 'Resetting password...' : 'Reset Password'}
        </button>
      </form>

      <div className="flex gap-2 text-sm opacity-90 mt-6 items-center justify-center">
        <p>Already know your password?</p>
        <Link href="/login" className="text-[#db2896] text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
