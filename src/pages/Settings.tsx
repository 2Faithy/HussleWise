import { useState, useRef } from 'react';
import { Store, Landmark, Bell, Shield, Check, Trash2, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBusinessData, nullsToEmpty } from '../context/BusinessDataContext';
import { updateBusinessProfileApi, deleteAccountApi } from '../lib/api';

type SettingsTab = 'business' | 'bank' | 'notifications' | 'account';

export default function Settings() {
  const navigate = useNavigate();
  const { businessProfile, updateBusinessProfile, logout } = useBusinessData();
  const [tab, setTab] = useState<SettingsTab>('business');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [businessForm, setBusinessForm] = useState({
    businessName: businessProfile.businessName,
    phone: businessProfile.phone,
    address: businessProfile.address,
    email: businessProfile.email,
    businessLogo: businessProfile.businessLogo,
    about: businessProfile.about,
  });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBusinessForm((prev) => ({ ...prev, businessLogo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const [bankForm, setBankForm] = useState({
    bankName: businessProfile.bankName,
    accountName: businessProfile.accountName,
    accountNumber: businessProfile.accountNumber,
  });

  const inputClass =
    'w-full font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    try {
      const updated = await updateBusinessProfileApi(businessForm);
      updateBusinessProfile({ ...businessProfile, ...nullsToEmpty(updated) });
      showSaved();
    } catch (err) {
      setSaveError('Could not save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    try {
      const updated = await updateBusinessProfileApi(bankForm);
      updateBusinessProfile({ ...businessProfile, ...nullsToEmpty(updated) });
      showSaved();
    } catch (err) {
      setSaveError('Could not save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = async (key: 'notifyLowStock' | 'notifyOverdueDebts' | 'notifyDailySummary' | 'notifyGrowthTips') => {
    const newValue = !businessProfile[key];
    // Optimistic update so the toggle feels instant, then persist.
    updateBusinessProfile({ ...businessProfile, [key]: newValue });
    try {
      await updateBusinessProfileApi({ [key]: newValue });
    } catch (err) {
      // Revert on failure
      updateBusinessProfile({ ...businessProfile, [key]: !newValue });
      console.error('Failed to save notification preference:', err);
    }
  };

  const handleLogout = () => {
    if (confirm('Log out of Husslewise?')) {
      logout();
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete all your business data — sales, expenses, debts, inventory, everything. This cannot be undone. Continue?')) {
      return;
    }
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAccountApi();
      logout();
      navigate('/signup');
    } catch (err) {
      setDeleteError('Could not delete your account. Please try again.');
      setIsDeleting(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: typeof Store }[] = [
    { key: 'business', label: 'Business Profile', icon: Store },
    { key: 'bank', label: 'Bank Details', icon: Landmark },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Settings
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          Manage your business profile, bank details, and preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2.5 font-body text-sm font-bold px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${
                tab === key
                  ? 'bg-brand-primary text-brand-bg'
                  : 'bg-white text-brand-ink/60 border border-brand-primary/10 hover:border-brand-primary/30'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-primary/10">
          {tab === 'business' && (
            <form onSubmit={handleSaveBusiness}>
              <h2 className="font-headline text-lg font-bold text-brand-ink mb-1">Business Profile</h2>
              <p className="font-body text-sm text-brand-ink/60 mb-6">
                This information appears on your receipts, reports, and storefront.
              </p>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className={labelClass}>Business Name</label>
                  <input
                    type="text"
                    value={businessForm.businessName}
                    onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>About Your Business</label>
                  <textarea
                    value={businessForm.about}
                    onChange={(e) => setBusinessForm({ ...businessForm, about: e.target.value })}
                    placeholder="Tell customers what you do, e.g. 'We sell fresh farm produce sourced daily from Mile 12 market...'"
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                  <p className="font-body text-xs text-brand-ink/40 mt-1.5">
                    Shown to customers visiting your storefront.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                    placeholder="e.g. 0801 234 5678"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Business Address</label>
                  <input
                    type="text"
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                    placeholder="e.g. Ojota Market, Lagos"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Business Email</label>
                  <input
                    type="email"
                    value={businessForm.email}
                    onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                    placeholder="you@business.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Business Logo</label>
                  <div className="flex items-center gap-4">
                    {businessForm.businessLogo ? (
                      <img src={businessForm.businessLogo} alt="Logo" className="w-20 h-20 rounded-lg object-cover border border-brand-primary/10" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-brand-bg/30 flex items-center justify-center font-body text-xs text-brand-ink/40">
                        No logo
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="font-body text-xs font-bold text-brand-ink bg-brand-bg/40 px-4 py-2.5 rounded-lg hover:bg-brand-bg/60 transition"
                    >
                      Upload Logo
                    </button>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </div>
                  <p className="font-body text-xs text-brand-ink/40 mt-1.5">
                    Appears on your receipts alongside the Husslewise brand.
                  </p>
                </div>
              </div>

              {saveError && (
                <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4 max-w-md">
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saved ? <><Check size={16} /> Saved</> : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'bank' && (
            <form onSubmit={handleSaveBank}>
              <h2 className="font-headline text-lg font-bold text-brand-ink mb-1">Bank Details</h2>
              <p className="font-body text-sm text-brand-ink/60 mb-6">
                Shown to customers on your storefront when they choose to pay by bank transfer.
              </p>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input type="text" value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} placeholder="e.g. GTBank" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Account Name</label>
                  <input type="text" value={bankForm.accountName} onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Account Number</label>
                  <input type="text" value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} className={inputClass} />
                </div>
              </div>

              {saveError && (
                <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-4 max-w-md">
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saved ? <><Check size={16} /> Saved</> : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'notifications' && (
            <div>
              <h2 className="font-headline text-lg font-bold text-brand-ink mb-1">Notifications</h2>
              <p className="font-body text-sm text-brand-ink/60 mb-6">
                Choose what you want to be alerted about.
              </p>

              <div className="space-y-1 max-w-md">
                {([
                  { key: 'notifyLowStock' as const, label: 'Low Stock Alerts', desc: 'When inventory drops below your threshold' },
                  { key: 'notifyOverdueDebts' as const, label: 'Overdue Debt Reminders', desc: 'When a customer debt passes its due date' },
                  { key: 'notifyDailySummary' as const, label: 'Daily Summary', desc: 'A recap of sales and expenses each evening' },
                  { key: 'notifyGrowthTips' as const, label: 'Growth Tips', desc: 'Periodic insights to help your business grow' },
                ]).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-brand-primary/5 last:border-0">
                    <div>
                      <p className="font-body text-sm font-bold text-brand-ink">{label}</p>
                      <p className="font-body text-xs text-brand-ink/50">{desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(key)}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        businessProfile[key] ? 'bg-brand-primary' : 'bg-brand-primary/20'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${businessProfile[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-brand-ink/40 mt-4 max-w-md">
                Your preferences are saved, but no delivery mechanism is wired up yet (SMS/WhatsApp/push all still planned) — nothing will actually be sent yet.
              </p>
            </div>
          )}

          {tab === 'account' && (
            <div>
              <h2 className="font-headline text-lg font-bold text-brand-ink mb-1">Account</h2>
              <p className="font-body text-sm text-brand-ink/60 mb-6">
                Manage your session and account data.
              </p>

              <div className="max-w-md space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 font-body text-sm font-bold text-brand-ink bg-brand-bg/30 px-5 py-4 rounded-lg hover:bg-brand-bg/50 transition text-left"
                >
                  <LogOut size={18} className="text-brand-primary" />
                  Log Out
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 font-body text-sm font-bold text-red-600 bg-red-50 px-5 py-4 rounded-lg hover:bg-red-100/60 transition text-left disabled:opacity-60"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  {isDeleting ? 'Deleting...' : 'Delete Account & Data'}
                </button>

                {deleteError && (
                  <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {deleteError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}