import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { forgotPassword } from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Backend always returns success regardless of whether the email
    // exists, so we don't need error-branching here — just proceed.
    await forgotPassword(email).catch(() => {});

    navigate('/reset-password', { state: { email } });
  };

  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a code to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Code
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="font-body text-sm text-brand-ink/60 text-center mt-6">
        Remembered your password?{' '}
        <Link to="/login" className="text-brand-primary font-bold hover:underline">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}