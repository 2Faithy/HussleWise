import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { useBusinessData } from '../context/BusinessDataContext';
import { ApiRequestError } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useBusinessData();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const data = await loginWithCredentials(form.email, form.password);
      navigate(data.business.onboardingComplete ? '/app' : '/onboarding');
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof ApiRequestError) {
        if (err.code === 'EMAIL_NOT_VERIFIED') {
          navigate('/verify-email', { state: { email: form.email } });
          return;
        }
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to keep tracking and growing your business."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        )}

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 font-body text-xs text-brand-ink/60">
            <input type="checkbox" className="accent-brand-primary" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-body text-xs text-brand-primary font-bold hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3.5 rounded-lg hover:opacity-90 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Logging In...
            </>
          ) : (
            <>
              Log In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="font-body text-sm text-brand-ink/60 text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-primary font-bold hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}