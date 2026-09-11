import { useState, useMemo } from 'react';
import { Plus, Trash2, Phone, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';
import Modal from '../components/Modal';
import AddDebtForm from '../components/AddDebtForm';

type FilterTab = 'all' | 'pending' | 'overdue' | 'paid';

export default function Debts() {
  const { debts, recordDebtPayment, deleteDebt } = useBusinessData();
  const [tab, setTab] = useState<FilterTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'transfer' | 'pos'>('cash');

  // Re-derive real-time status (in case a due date has passed since it was added)
  const enriched = useMemo(() => {
    return debts.map((d) => {
      const balance = d.amount - d.amountPaid;
      const isOverdue = balance > 0 && new Date(d.dueDate) < new Date();
      const status = balance <= 0 ? 'paid' : isOverdue ? 'overdue' : 'pending';
      return { ...d, balance, status };
    });
  }, [debts]);

  const filtered = tab === 'all' ? enriched : enriched.filter((d) => d.status === tab);

  const totalOwed = enriched.filter((d) => d.status !== 'paid').reduce((sum, d) => sum + d.balance, 0);
  const overdueCount = enriched.filter((d) => d.status === 'overdue').length;

  const handleRecordPayment = (id: string) => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;
    recordDebtPayment(id, amount, payMethod);
    setPayingId(null);
    setPayAmount('');
  };

  const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    overdue: 'bg-red-50 text-red-600',
    paid: 'bg-green-50 text-green-700',
  };

  const statusIcon: Record<string, typeof Clock> = {
    pending: Clock,
    overdue: AlertTriangle,
    paid: CheckCircle2,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
            Who Owes Me
          </h1>
          <p className="font-body text-sm text-brand-ink/60">
            Track customers who bought on credit — never lose money to a forgotten debt.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Debt
        </button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <p className="font-body text-xs text-brand-ink/60 mb-1">Total Currently Owed</p>
          <p className="font-headline text-2xl font-extrabold text-brand-ink">{formatNaira(totalOwed)}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <p className="font-body text-xs text-red-600/80 mb-1">Overdue Debts</p>
          <p className="font-headline text-2xl font-extrabold text-red-600">{overdueCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'pending', 'overdue', 'paid'] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-body text-sm font-bold px-4 py-2 rounded-lg capitalize transition-colors ${
              tab === t
                ? 'bg-brand-primary text-brand-bg'
                : 'bg-white text-brand-ink/60 border border-brand-primary/10 hover:border-brand-primary/30'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Debt list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-primary/10 text-center py-14">
            <p className="font-body text-sm text-brand-ink/50">No debts in this category. 🎉</p>
          </div>
        ) : (
          filtered.map((debt) => {
            const StatusIcon = statusIcon[debt.status];
            return (
              <div key={debt.id} className="bg-white rounded-2xl border border-brand-primary/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body font-bold text-brand-ink">{debt.customerName}</p>
                      <span className={`flex items-center gap-1 font-body text-xs font-bold px-2 py-0.5 rounded-full ${statusStyles[debt.status]}`}>
                        <StatusIcon size={11} />
                        {debt.status}
                      </span>
                    </div>
                    {debt.items && debt.items.length > 1 ? (
                      <div className="font-body text-sm text-brand-ink/60 mb-1">
                        {debt.items.map((line, idx) => (
                          <span key={idx}>
                            {line.name}
                            {line.quantity ? ` ×${line.quantity}` : ''}
                            {idx < debt.items!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-brand-ink/60 mb-1">{debt.item}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-xs text-brand-ink/50">
                      {debt.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {debt.phone}
                        </span>
                      )}
                      <span>Given: {debt.dateGiven}</span>
                      <span>Due: {debt.dueDate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-body text-xs text-brand-ink/50">Balance Owed</p>
                    <p className="font-headline text-lg font-extrabold text-brand-ink">
                      {formatNaira(debt.balance)}
                    </p>
                    <p className="font-body text-xs text-brand-ink/40">
                      of {formatNaira(debt.amount)} total
                    </p>
                  </div>
                </div>

                {debt.status !== 'paid' && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-primary/5">
                    {payingId === debt.id ? (
                      <>
                        <input
                          type="number"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder="Amount paid"
                          min="0"
                          className="flex-1 font-body text-sm px-3 py-2 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                        />
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value as 'cash' | 'transfer' | 'pos')}
                          className="font-body text-xs px-2 py-2 rounded-lg border border-brand-primary/20 bg-brand-bg/10 capitalize"
                        >
                          <option value="cash">Cash</option>
                          <option value="transfer">Transfer</option>
                          <option value="pos">POS</option>
                        </select>
                        <button
                          onClick={() => handleRecordPayment(debt.id)}
                          className="font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2 rounded-lg hover:opacity-90 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => { setPayingId(null); setPayAmount(''); }}
                          className="font-body text-xs font-bold text-brand-ink/50 px-3 py-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setPayingId(debt.id)}
                          className="font-body text-xs font-bold bg-brand-bg/40 text-brand-ink px-4 py-2 rounded-lg hover:bg-brand-bg/60 transition"
                        >
                          Record Payment
                        </button>
                        <button
                          onClick={() => confirm('Delete this debt record?') && deleteDebt(debt.id)}
                          className="text-brand-ink/30 hover:text-red-500 transition ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add a Debt Record">
        <AddDebtForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}