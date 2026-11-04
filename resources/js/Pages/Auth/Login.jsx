import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { FloatInput } from '../../Components/ui/FloatInput';

export default function Login({ conferenceTitle, conferenceAbbreviation, logoPath }) {
  const { flash } = usePage().props;
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post('/login', form, {
      onError: (errs) => setErrors(errs),
      onFinish: () => setLoading(false),
    });
  };

  return (
    <AuthLayout tagline={`${conferenceTitle || 'Seminar Nasional Berdampak'} — ${conferenceAbbreviation || 'SND'}`}>
      <div className="text-center">
        <img src={logoPath} alt={`Logo ${conferenceAbbreviation || 'SND'}`} className="inline-block mb-2 h-14 w-auto object-contain" />
      </div>
      <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5">
        Log in into your account
      </h3>
      <p className="flex justify-center items-center text-base font-medium opacity-90 text-center">
        Welcome back! please enter your details
      </p>

      {flash?.message && (
        <div
          className={`mb-4 mt-4 p-3 text-sm rounded-lg border ${
            flash.type === 'success'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-red-700 bg-red-50 border-red-200'
          }`}
        >
          {flash.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
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
          />
        </div>

        <div className="mb-4 relative">
          <FloatInput
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            fullWidth
            value={form.password}
            onChange={setInput('password')}
            error={!!errors.password}
            helperText={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-between items-center my-5">
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="cursor-pointer"
              checked={form.remember}
              onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
            />
            <label htmlFor="rememberMe" className="opacity-90 font-normal cursor-pointer text-sm">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-[#db2896] text-sm font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md w-full py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: '#141a63' }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="flex gap-2 text-base opacity-90 mt-6 items-center justify-center">
        <p>New to {conferenceAbbreviation || 'SND'}?</p>
        <Link href="/register" className="text-[#db2896] text-sm font-medium">
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
}
