import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthLayout from './AuthLayout';
import { FloatInput } from '../../Components/ui/FloatInput';

export default function ForgotPassword({ conferenceTitle, conferenceAbbreviation, logoPath }) {
  const { flash } = usePage().props;
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post('/forgot-password', { email }, {
      onError: (errs) => setErrors(errs),
      onFinish: () => setLoading(false),
    });
  };

  return (
    <AuthLayout tagline={`${conferenceTitle} — ${conferenceAbbreviation}`}>
      <div className="text-center">
        <img src={logoPath} alt="Logo ICASVE" className="inline-block mb-2 h-14 w-auto object-contain" />
      </div>
      <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5 text-center">
        Forgot Password
      </h3>
      <p className="flex justify-center items-center text-sm font-medium opacity-90 text-center text-gray-600 mb-6">
        No problem. Enter your email address and we will send you a password reset link.
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
        <div className="mb-5">
          <FloatInput
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md w-full py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          style={{ background: '#141a63' }}
        >
          {loading ? 'Sending link...' : 'Email Password Reset Link'}
        </button>
      </form>

      <div className="flex gap-2 text-sm opacity-90 mt-6 items-center justify-center">
        <p>Remember your password?</p>
        <Link href="/login" className="text-[#db2896] text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
