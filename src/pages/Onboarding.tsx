import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, BarChart3, Target, PartyPopper, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import logo from '../assets/images/logo.png';
import { useBusinessData, type BusinessProfile } from '../context/BusinessDataContext';
import { updateBusinessProfileApi } from '../lib/api';

function nullsToEmpty<T extends object>(obj: T): BusinessProfile {
  const result = { ...obj } as Record<string, any>;
  for (const key in result) {
    if (result[key] === null) {
      result[key] = '';
    }
  }
  return result as BusinessProfile;
}

const CATEGORIES = ['Retail', 'Food & Beverage', 'Fashion & Beauty', 'Services', 'Agriculture', 'Other'];
const BUSINESS_TYPES = ['Sole Proprietor', 'Partnership', 'Limited Liability Company', 'Not yet registered'];
const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Kano', 'Oyo', 'Kaduna', 'Ogun', 'Enugu',
  'Delta', 'Anambra', 'Abia', 'Edo', 'Other',
];
const TEAM_SIZES = ['Just me', '2–5 people', '6–15 people', '15+ people'];
const YEARS_OPERATING = ['Just starting out', 'Less than 1 year', '1–3 years', '3+ years'];
const REVENUE_RANGES = ['Under ₦100k', '₦100k – ₦500k', '₦500k – ₦2m', '₦2m+', 'Prefer not to say'];

const GOALS = [
  { key: 'track', label: 'Track my sales & expenses' },
  { key: 'debts', label: 'Keep track of customers who owe me' },
  { key: 'register', label: 'Register my business with CAC' },
  { key: 'sell-online', label: 'Sell online via WhatsApp/Instagram' },
  { key: 'funding', label: 'Access loans or grants' },
  { key: 'grow', label: 'Get insights to grow faster' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { businessProfile, updateBusinessProfile } = useBusinessData();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [data, setData] = useState({
    businessName: businessProfile.businessName === 'My Business' ? '' : businessProfile.businessName,
    category: '',
    businessType: '',
    state: '',
    teamSize: '',
    yearsOperating: '',
    monthlyRevenueRange: '',
    goals: [] as string[],
  });

  const toggleGoal = (key: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(key) ? prev.goals.filter((g) => g !== key) : [...prev.goals, key],
    }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!data.businessName.trim()) return setError('Please enter your business name.'), false;
      if (!data.category) return setError('Please select a business category.'), false;
      if (!data.businessType) return setError('Please select a business type.'), false;
      if (!data.state) return setError('Please select your state.'), false;
    }
    if (step === 2) {
      if (!data.teamSize) return setError('Please select your team size.'), false;
      if (!data.yearsOperating) return setError("Please select how long you've been operating."), false;
      if (!data.monthlyRevenueRange) return setError('Please select an estimated revenue range.'), false;
    }
    setError('');
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const finish = async () => {
    setIsSaving(true);
    setError('');
    try {
      const updated = await updateBusinessProfileApi({
        businessName: data.businessName,
        category: data.category,
        businessType: data.businessType,
        state: data.state,
        teamSize: data.teamSize,
        yearsOperating: data.yearsOperating,
        monthlyRevenueRange: data.monthlyRevenueRange,
        goals: data.goals,
        onboardingComplete: true,
      });
      updateBusinessProfile({ ...businessProfile, ...nullsToEmpty(updated) });
      navigate('/app');
    } catch (err) {
      setIsSaving(false);
      setError('Could not save your info. Please try again.');
    }
  };

  const skip = async () => {
    setIsSaving(true);
    try {
      const updated = await updateBusinessProfileApi({
        onboardingComplete: true,
      });
      updateBusinessProfile({ ...businessProfile, ...nullsToEmpty(updated) });
      navigate('/app');
    } catch (err) {
      setIsSaving(false);
      setError('Could not skip onboarding. Please try again.');
    }
  };

  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';
  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40';

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-6 py-12">
      <img src={logo} alt="Husslewise" className="h-8 mb-8" />

      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-bold transition-colors ${
                s < step ? 'bg-brand-primary text-brand-bg' : s === step ? 'bg-brand-accent text-brand-ink' : 'bg-white text-brand-ink/30 border border-brand-primary/20'
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 3 && <div className={`w-10 h-0.5 ${s < step ? 'bg-brand-primary' : 'bg-brand-primary/20'}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-brand-primary/10 shadow-sm">
        {/* Step 1: Business Basics */}
        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-5">
              <Store size={22} className="text-brand-primary" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-brand-ink mb-2">Tell us about your business</h1>
            <p className="font-body text-sm text-brand-ink/60 mb-6">This helps us tailor Husslewise to how you work.</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Business Name</label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="e.g. Nkechi Tomatoes"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Business Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setData({ ...data, category: cat })}
                      className={`font-body text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                        data.category === cat
                          ? 'bg-brand-primary text-brand-bg border-brand-primary'
                          : 'bg-brand-bg/20 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Business Type</label>
                <select value={data.businessType} onChange={(e) => setData({ ...data, businessType: e.target.value })} className={inputClass}>
                  <option value="">Select one</option>
                  {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>State</label>
                <select value={data.state} onChange={(e) => setData({ ...data, state: e.target.value })} className={inputClass}>
                  <option value="">Select your state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Profile */}
        {step === 2 && (
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-5">
              <BarChart3 size={22} className="text-brand-primary" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-brand-ink mb-2">A bit more context</h1>
            <p className="font-body text-sm text-brand-ink/60 mb-6">Helps us give you relevant insights and funding options.</p>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Team Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setData({ ...data, teamSize: size })}
                      className={`font-body text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                        data.teamSize === size
                          ? 'bg-brand-primary text-brand-bg border-brand-primary'
                          : 'bg-brand-bg/20 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>How long have you been operating?</label>
                <div className="grid grid-cols-2 gap-2">
                  {YEARS_OPERATING.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setData({ ...data, yearsOperating: y })}
                      className={`font-body text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                        data.yearsOperating === y
                          ? 'bg-brand-primary text-brand-bg border-brand-primary'
                          : 'bg-brand-bg/20 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Estimated Monthly Revenue</label>
                <select value={data.monthlyRevenueRange} onChange={(e) => setData({ ...data, monthlyRevenueRange: e.target.value })} className={inputClass}>
                  <option value="">Select a range</option>
                  {REVENUE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="font-body text-xs text-brand-ink/40 mt-1.5">This stays private and helps us recommend the right funding options.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals + Ready */}
        {step === 3 && (
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center mb-5">
              <Target size={22} className="text-brand-primary" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-brand-ink mb-2">What are you here for?</h1>
            <p className="font-body text-sm text-brand-ink/60 mb-6">Select all that apply — we'll point you to the right tools.</p>

            <div className="space-y-2 mb-2">
              {GOALS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleGoal(key)}
                  className={`w-full flex items-center justify-between font-body text-sm px-4 py-3.5 rounded-lg border transition-colors ${
                    data.goals.includes(key)
                      ? 'bg-brand-primary text-brand-bg border-brand-primary'
                      : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
                  }`}
                >
                  {label}
                  {data.goals.includes(key) && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mt-6">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 mt-8">
          {step > 1 && (
            <button onClick={back} className="flex items-center gap-1.5 font-body text-sm font-bold text-brand-ink/60 px-4 py-3 rounded-lg hover:bg-brand-bg/30 transition">
              <ArrowLeft size={16} /> Back
            </button>
          )}

          {step < totalSteps ? (
            <button onClick={next} className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition">
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-ink font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <PartyPopper size={16} /> {isSaving ? 'Saving...' : 'Go to Dashboard'}
            </button>
          )}
        </div>
      </div>

      <button onClick={skip} disabled={isSaving} className="font-body text-xs text-brand-ink/50 hover:text-brand-ink/70 mt-6 disabled:opacity-60">
        Skip for now
      </button>
    </div>
  );
}