import { useState, useMemo } from 'react';
import { Plus, Minus, ArrowUpRight, ArrowDownRight, Search, Trash2, Download } from 'lucide-react';
import logo from '../assets/images/logo.png';
import { useBusinessData } from '../context/BusinessDataContext';
import { formatNaira } from '../utils/currency';
import { generateMonthlyReport } from '../utils/generateReport';
import Modal from '../components/Modal';
import AddSaleForm from '../components/AddSaleForm';
import AddExpenseForm from '../components/AddExpenseForm';

type Tab = 'all' | 'sales' | 'expenses';
type DateFilter = 'today' | 'week' | 'month' | 'all';

export default function Sales() {
  const { sales, expenses, deleteSale, deleteExpense, businessProfile } = useBusinessData();
  const [tab, setTab] = useState<Tab>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const isInRange = (date: string): boolean => {
    if (dateFilter === 'all') return true;
    const itemDate = new Date(date);
    const now = new Date();
    if (dateFilter === 'today') {
      return date === now.toISOString().split('T')[0];
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return itemDate >= weekAgo;
    }
    if (dateFilter === 'month') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  // Merge sales + expenses into one sortable feed
  const combined = useMemo(() => {
    return [
      ...sales.map((s) => ({ ...s, kind: 'sale' as const, label: s.item })),
      ...expenses.map((e) => ({ ...e, kind: 'expense' as const, label: e.type })),
    ].sort((a, b) => b.date.localeCompare(a.date));
  }, [sales, expenses]);

  const filtered = useMemo(() => {
    return combined
      .filter((c) => (tab === 'sales' ? c.kind === 'sale' : tab === 'expenses' ? c.kind === 'expense' : true))
      .filter((c) => isInRange(c.date))
      .filter((c) => c.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [combined, tab, dateFilter, searchTerm]);

  // Contextual totals for whatever's currently visible
  const visibleMoneyIn = filtered.filter((c) => c.kind === 'sale').reduce((sum, c) => sum + c.amount, 0);
  const visibleMoneyOut = filtered.filter((c) => c.kind === 'expense').reduce((sum, c) => sum + c.amount, 0);

  const handleDelete = (kind: 'sale' | 'expense', id: string) => {
    if (!confirm('Delete this transaction? This cannot be undone.')) return;
    if (kind === 'sale') deleteSale(id);
    else deleteExpense(id);
  };

    const handleExport = async () => {
    const now = new Date();
    const monthLabel = now.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

    const monthSales = sales.filter(
      (s) => new Date(s.date).getMonth() === now.getMonth() && new Date(s.date).getFullYear() === now.getFullYear()
    );
    const monthExpenses = expenses.filter(
      (e) => new Date(e.date).getMonth() === now.getMonth() && new Date(e.date).getFullYear() === now.getFullYear()
    );

    await generateMonthlyReport(monthSales, monthExpenses, monthLabel, businessProfile.businessName, logo);
  };

  const dateFilters: { key: DateFilter; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
            Sales & Expenses
          </h1>
          <p className="font-body text-sm text-brand-ink/60">
            Track your money in and money out.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-brand-primary/20 text-brand-ink font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-bg/30 transition"
          >
            <Download size={16} /> Download Report
          </button>
          <button
            onClick={() => setShowSaleModal(true)}
            className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            <Plus size={16} /> Add Sale
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 bg-white border border-brand-primary/20 text-brand-ink font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-bg/30 transition"
          >
            <Minus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* Contextual summary strip */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <ArrowUpRight size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Money In (shown)</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{formatNaira(visibleMoneyIn)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-ink/60">Money Out (shown)</p>
            <p className="font-headline text-xl font-extrabold text-brand-ink">{formatNaira(visibleMoneyOut)}</p>
          </div>
        </div>
        <div className="bg-brand-primary rounded-2xl p-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-accent/20 flex items-center justify-center">
            <ArrowUpRight size={20} className="text-brand-accent" />
          </div>
          <div>
            <p className="font-body text-xs text-brand-bg/70">Net (shown)</p>
            <p className="font-headline text-xl font-extrabold text-brand-bg">
              {formatNaira(visibleMoneyIn - visibleMoneyOut)}
            </p>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full font-body text-sm pl-10 pr-4 py-2.5 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <div className="flex gap-2">
          {dateFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDateFilter(key)}
              className={`font-body text-xs font-bold px-3.5 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                dateFilter === key
                  ? 'bg-brand-primary text-brand-bg'
                  : 'bg-white text-brand-ink/60 border border-brand-primary/10 hover:border-brand-primary/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'sales', 'expenses'] as Tab[]).map((t) => (
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

      {/* Transaction list */}
      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <p className="font-body text-sm text-brand-ink/50 mb-1">No transactions found.</p>
            <p className="font-body text-xs text-brand-ink/40">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-primary/5">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 group">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.kind === 'sale' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {item.kind === 'sale' ? (
                      <ArrowUpRight size={16} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-brand-ink">{item.label}</p>
                    <p className="font-body text-xs text-brand-ink/50 capitalize">
                      {item.kind === 'sale' ? item.paymentMethod : (item.recurring ? 'Recurring' : 'One-time')} · {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-body text-sm font-bold ${
                      item.kind === 'sale' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {item.kind === 'sale' ? '+' : '-'}{formatNaira(item.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(item.kind, item.id)}
                    className="text-brand-ink/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showSaleModal} onClose={() => setShowSaleModal(false)} title="Add a Sale">
        <AddSaleForm onSuccess={() => setShowSaleModal(false)} />
      </Modal>

      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add an Expense">
        <AddExpenseForm onSuccess={() => setShowExpenseModal(false)} />
      </Modal>
    </div>
  );
}