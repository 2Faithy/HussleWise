import { useState, useMemo } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';

interface AddDebtFormProps {
  onSuccess: () => void;
}

interface CartLine {
  key: string;
  kind: 'inventory' | 'custom';
  inventoryItemId?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  availableStock?: number;
  unit?: string;
}

export default function AddDebtForm({ onSuccess }: AddDebtFormProps) {
  const { addDebt, inventory } = useBusinessData();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amountPaid, setAmountPaid] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'pos'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cart, setCart] = useState<CartLine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const inputClass =
    'w-full font-body text-sm px-4 py-2.5 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40';
  const labelClass = 'block font-body text-xs font-bold text-brand-ink/70 mb-1.5';

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return inventory.filter((i) => i.name.toLowerCase().includes(term)).slice(0, 6);
  }, [searchTerm, inventory]);

  const addInventoryToCart = (item: (typeof inventory)[number]) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.inventoryItemId === item.id);
      if (existing) {
        return prev.map((l) =>
          l.inventoryItemId === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          key: `inv-${item.id}`,
          kind: 'inventory',
          inventoryItemId: item.id,
          name: item.name,
          unitPrice: item.sellingPrice,
          quantity: 1,
          discount: 0,
          availableStock: item.quantity,
          unit: item.unit,
        },
      ];
    });
    setSearchTerm('');
  };

  const addCustomToCart = () => {
    if (!customName.trim() || !customAmount) return;
    setCart((prev) => [
      ...prev,
      {
        key: `custom-${Date.now()}`,
        kind: 'custom',
        name: customName,
        unitPrice: Number(customAmount),
        quantity: 1,
        discount: 0,
      },
    ]);
    setCustomName('');
    setCustomAmount('');
    setShowCustomForm(false);
  };

  const updateLine = (key: string, patch: Partial<CartLine>) => {
    setCart((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const removeLine = (key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  };

  const lineTotal = (line: CartLine) => Math.max(0, line.unitPrice * line.quantity - line.discount);
  const grandTotal = cart.reduce((sum, l) => sum + lineTotal(l), 0);
  const anyExceedsStock = cart.some((l) => l.availableStock !== undefined && l.quantity > l.availableStock);
  const paidNum = Number(amountPaid) || 0;

  const handleSubmit = async () => {
    if (!customerName.trim() || !dueDate || cart.length === 0) return;
    if (paidNum > 0 && !paymentMethod) return;

    setIsSubmitting(true);
    try {
      const items = cart.map((l) =>
        l.kind === 'inventory'
          ? { inventoryItemId: l.inventoryItemId, quantity: l.quantity, discount: l.discount }
          : { item: l.name, amount: lineTotal(l) }
      );

      await addDebt({
        customerName,
        phone: phone || undefined,
        dueDate,
        items,
        amountPaid: paidNum,
        paymentMethod: paidNum > 0 ? paymentMethod : undefined,
      });

      onSuccess();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="e.g. Tolu Adebayo"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Phone Number (optional)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 0801 234 5678"
          className={inputClass}
        />
      </div>

      {/* Search box */}
      <div className="relative">
        <label className={labelClass}>Search Inventory</label>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search items..."
            className={`${inputClass} pl-10`}
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-brand-primary/15 rounded-lg shadow-lg max-h-56 overflow-y-auto">
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addInventoryToCart(item)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-brand-bg/20 transition"
              >
                <span className="font-body text-sm text-brand-ink">{item.name}</span>
                <span className="font-body text-xs text-brand-ink/50">
                  {formatNaira(item.sellingPrice)}/{item.unit} · {item.quantity} in stock
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!showCustomForm ? (
        <button
          type="button"
          onClick={() => setShowCustomForm(true)}
          className="flex items-center gap-1.5 font-body text-xs font-bold text-brand-primary hover:underline"
        >
          <Plus size={14} /> Add a custom item / service instead
        </button>
      ) : (
        <div className="bg-brand-bg/10 rounded-lg p-4 space-y-3">
          <div>
            <label className={labelClass}>Item / Service</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Tailoring service"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Amount (₦)</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 2000"
              min="0"
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addCustomToCart}
              className="flex-1 font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              Add to List
            </button>
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="font-body text-xs font-bold text-brand-ink/50 px-3 py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cart */}
      {cart.length > 0 && (
        <div className="border border-brand-primary/10 rounded-lg divide-y divide-brand-primary/5">
          {cart.map((line) => {
            const exceedsStock = line.availableStock !== undefined && line.quantity > line.availableStock;
            return (
              <div key={line.key} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="font-body text-sm font-bold text-brand-ink truncate">{line.name}</p>
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    className="text-brand-ink/30 hover:text-red-500 transition shrink-0"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-body text-xs text-brand-ink/50">Qty</span>
                    <input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.key, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                      min="1"
                      className="w-16 font-body text-sm px-2 py-1.5 rounded-lg border border-brand-primary/20 bg-white"
                    />
                  </div>

                  {line.kind === 'inventory' && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-body text-xs text-brand-ink/50">Discount ₦</span>
                      <input
                        type="number"
                        value={line.discount || ''}
                        onChange={(e) => updateLine(line.key, { discount: Number(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="w-20 font-body text-sm px-2 py-1.5 rounded-lg border border-brand-primary/20 bg-white"
                      />
                    </div>
                  )}

                  <span className="ml-auto font-body text-sm font-bold text-brand-primary">
                    {formatNaira(lineTotal(line))}
                  </span>
                </div>

                {exceedsStock && (
                  <p className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-2">
                    Only {line.availableStock} {line.unit} in stock — this will go negative.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {cart.length === 0 && (
        <p className="font-body text-xs text-brand-ink/40 text-center py-2">
          Search for an item above, or add a custom one, to build this debt record.
        </p>
      )}

      <div>
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Paid So Far (₦)</label>
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="0"
          min="0"
          className={inputClass}
        />
        <p className="font-body text-xs text-brand-ink/40 mt-1">
          Any amount here is recorded immediately as a real sale.
        </p>
      </div>

      {paidNum > 0 && (
        <div>
          <label className={labelClass}>Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'transfer', 'pos'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`font-body text-xs px-2 py-2.5 rounded-lg border capitalize transition-colors ${
                  paymentMethod === method
                    ? 'bg-brand-primary text-brand-bg border-brand-primary'
                    : 'bg-brand-bg/10 text-brand-ink border-brand-primary/10 hover:border-brand-primary/30'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="bg-brand-bg/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="font-body text-xs text-brand-ink/60">
            Total Owed ({cart.length} item{cart.length > 1 ? 's' : ''})
          </span>
          <span className="font-headline text-lg font-extrabold text-brand-ink">
            {formatNaira(grandTotal)}
          </span>
        </div>
      )}

      {anyExceedsStock && (
        <p className="font-body text-xs text-amber-700 text-center">
          One or more items will exceed available stock.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || cart.length === 0}
        className="w-full bg-brand-primary text-brand-bg font-body font-bold px-6 py-3 rounded-lg hover:opacity-90 transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Add Debt Record'}
      </button>
    </div>
  );
}