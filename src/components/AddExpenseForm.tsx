import { useState } from 'react';
import { useBusinessData } from '../context/BusinessDataContext';
import { suggestExpenseType } from '../utils/assistantEngine';

const expenseTypes = ['Materials', 'Transport', 'Shop Rent', 'Utilities', 'Salaries', 'Other'];

interface AddExpenseFormProps {
  onSuccess: () => void;
}

export default function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const { addExpense } = useBusinessData();
  const [form, setForm] = useState({
    description: '',
    type: 'Materials',
    amount: '',
    recurring: false,
  });

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;

    addExpense({
      description: form.description,
      type: form.type,
      amount: Number(form.amount),
      recurring: form.recurring,
      date: new Date().toISOString().split('T')[0],
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Description (Optional)</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => {
            const value = e.target.value;
            const suggested = suggestExpenseType(value);
            setForm((prev) => ({
              ...prev,
              description: value,
              type: suggested ?? prev.type,
            }));
          }}
          placeholder="e.g. Bought fabric, Uber ride"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Expense Type</label>
        <div className="grid grid-cols-2 gap-2">
          {expenseTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, type })}
              className={`font-body text-xs px-3 py-2.5 rounded-lg border transition-colors ${
                form.type === type
                  ? 'bg-brand-primary text-brand-bg border-brand-primary'
                  : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Amount (₦)</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="e.g. 2000"
          required
          min="0"
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2.5 font-body text-sm text-brand-ink/70">
        <input
          type="checkbox"
          checked={form.recurring}
          onChange={(e) => setForm({ ...form, recurring: e.target.checked })}
          className="accent-brand-primary"
        />
        This is a recurring expense (e.g. rent)
      </label>

      <button
        type="submit"
        className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-2"
      >
        Add Expense
      </button>
    </form>
  );
}