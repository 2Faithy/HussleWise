import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { acceptStaffInvite, ApiRequestError } from '../lib/api';

export default function StaffInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await acceptStaffInvite(token, password);
      navigate('/login', { state: { justJoinedStaff: true } });
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof ApiRequestError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Invite" subtitle="This invite link is missing or malformed.">
        <p className="font-body text-sm text-brand-ink/60 text-center">
          Please ask your business owner to resend your invite, or{' '}
          <Link to="/login" className="text-brand-primary font-bold hover:underline">
            log in
          </Link>{' '}
          if you've already set a password.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set Your Password" subtitle="You've been invited to join a team on Husslewise. Choose a password to get started.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-ink/70"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Setting Password...</>
          ) : (
            <>Set Password & Continue <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}