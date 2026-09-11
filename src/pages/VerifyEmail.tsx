import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { verifyEmail, resendVerification, ApiRequestError } from '../lib/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || '';

  const [email] = useState(emailFromState);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await verifyEmail(email, code);
      navigate('/login', { state: { justVerified: true } });
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof ApiRequestError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  const handleResend = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsResending(true);
    try {
      await resendVerification(email);
      setSuccessMsg('A new code has been sent to your email.');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Could not resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const inputClass =
    'w-full font-body text-2xl tracking-[0.4em] text-center px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';

  if (!email) {
    return (
      <AuthLayout title="Verify Your Email" subtitle="We couldn't find your email address.">
        <p className="font-body text-sm text-brand-ink/60 text-center">
          Please{' '}
          <Link to="/signup" className="text-brand-primary font-bold hover:underline">
            sign up
          </Link>{' '}
          again, or{' '}
          <Link to="/login" className="text-brand-primary font-bold hover:underline">
            log in
          </Link>{' '}
          if you already have an account.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We sent a 6-digit code to ${email}. Enter it below to activate your account.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-body px-4 py-3 rounded-lg">
            {successMsg}
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          required
          placeholder="000000"
          className={inputClass}
        />

        <button
          type="submit"
          disabled={isSubmitting || code.length !== 6}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify Account
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="font-body text-sm text-brand-ink/60 text-center mt-6">
        Didn't get a code?{' '}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="text-brand-primary font-bold hover:underline disabled:opacity-60"
        >
          {isResending ? 'Sending...' : 'Resend it'}
        </button>
      </p>
    </AuthLayout>
  );
}