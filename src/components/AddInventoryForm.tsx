import { useState } from 'react';
import { useBusinessData } from '../context/BusinessDataContext';

interface AddInventoryFormProps {
  onSuccess: () => void;
}

export default function AddInventoryForm({ onSuccess }: AddInventoryFormProps) {
  const { addInventoryItem } = useBusinessData();
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: '',
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '5',
  });

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quantity || !form.unit.trim() || !form.costPrice || !form.sellingPrice) return;

    addInventoryItem({
      name: form.name,
      quantity: Number(form.quantity),
      unit: form.unit,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Item Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Tomatoes"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="e.g. 12"
            required
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Unit</label>
          <input
            type="text"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="e.g. baskets, bags"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Cost Price (₦)</label>
          <input
            type="number"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            placeholder="e.g. 3500"
            required
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Selling Price (₦)</label>
          <input
            type="number"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
            placeholder="e.g. 5000"
            required
            min="0"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Low Stock Alert Threshold</label>
        <input
          type="number"
          value={form.lowStockThreshold}
          onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
          placeholder="e.g. 5"
          min="0"
          className={inputClass}
        />
        <p className="font-body text-xs text-brand-ink/40 mt-1">
          You'll get a warning when stock drops below this number.
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-2"
      >
        Add Item
      </button>
    </form>
  );
}