import { useState } from 'react';
import { useBusinessData } from '../context/BusinessDataContext';
import { ROLE_PERMISSIONS, type StaffRole } from '../types';

interface AddStaffFormProps {
  onSuccess: () => void;
}

export default function AddStaffForm({ onSuccess }: AddStaffFormProps) {
  const { addStaffMember } = useBusinessData();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier' as StaffRole,
  });

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await addStaffMember(form);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Could not send invite. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Ifeoma Nwosu"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="staff@example.com"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Phone Number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="e.g. 0801 234 5678"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <div className="space-y-2">
          {(['admin', 'manager', 'cashier'] as StaffRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm({ ...form, role })}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                form.role === role
                  ? 'bg-brand-primary text-brand-bg border-brand-primary'
                  : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
              }`}
            >
              <p className="font-body text-sm font-bold capitalize">{role}</p>
              <p className={`font-body text-xs ${form.role === role ? 'text-brand-bg/70' : 'text-brand-ink/50'}`}>
                {ROLE_PERMISSIONS[role].length} permissions
              </p>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending Invite...' : 'Send Invite'}
      </button>
    </form>
  );
}