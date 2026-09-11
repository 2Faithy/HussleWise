import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Wallet, TrendingDown, PiggyBank, Plus, Receipt, Send } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import StatCard from '../components/StatCard';
import { formatNaira } from '../utils/currency';

const COLORS = ['#1c5b56', '#ecbc94', '#0e1b1a', '#8a9b96'];

export default function Dashboard() {
  const { sales, expenses, todayTotal, businessProfile } = useBusinessData();

  const todaySales = todayTotal(sales);
  const todayExpenses = todayTotal(expenses);
  const balance = todaySales - todayExpenses;

  // Weekly trend: sum sales per last 7 days
  const weeklyData = getLast7Days().map((date) => ({
    day: new Date(date).toLocaleDateString('en-NG', { weekday: 'short' }),
    sales: sales.filter((s) => s.date === date).reduce((sum, s) => sum + s.amount, 0),
    expenses: expenses.filter((e) => e.date === date).reduce((sum, e) => sum + e.amount, 0),
  }));

  // Category breakdown for pie chart
  const categoryMap = sales.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.amount;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const recentActivity = [...sales]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1">
          Welcome back, {businessProfile.businessName} 👋
        </h1>
        <p className="font-body text-sm text-brand-ink/60">
          You made {formatNaira(todaySales)} today. Net profit: {formatNaira(balance)}.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          to="/app/sales"
          className="flex items-center gap-2 bg-brand-primary text-brand-bg font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Sale
        </Link>
        <Link
          to="/app/sales"
          className="flex items-center gap-2 bg-white border border-brand-primary/20 text-brand-ink font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-bg/30 transition"
        >
          <Receipt size={16} /> Add Expense
        </Link>
        <Link
          to="/app/receipts"
          className="flex items-center gap-2 bg-white border border-brand-primary/20 text-brand-ink font-body text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-bg/30 transition"
        >
          <Send size={16} /> Send Receipt
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Today's Sales" value={formatNaira(todaySales)} icon={Wallet} trend="+12%" trendUp />
        <StatCard label="Today's Expenses" value={formatNaira(todayExpenses)} icon={TrendingDown} trend="-4%" trendUp={false} />
        <StatCard label="Net Balance" value={formatNaira(balance)} icon={PiggyBank} trend="Healthy" trendUp />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-brand-primary/10">
          <h3 className="font-headline font-bold text-brand-ink mb-4">Weekly Cashflow</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Space Mono' }} stroke="#0e1b1a40" />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Space Mono' }} stroke="#0e1b1a40" />
              <Tooltip
                formatter={(value: any) => formatNaira(Number(value) || 0)}
                contentStyle={{ fontFamily: 'Space Mono', fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="sales" fill="#1c5b56" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="expenses" fill="#ecbc94" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
          <h3 className="font-headline font-bold text-brand-ink mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatNaira(Number(value) || 0)} contentStyle={{ fontFamily: 'Space Mono', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl p-6 border border-brand-primary/10">
        <h3 className="font-headline font-bold text-brand-ink mb-4">Recent Sales</h3>
        <div className="space-y-3">
          {recentActivity.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between py-2 border-b border-brand-primary/5 last:border-0">
              <div>
                <p className="font-body text-sm font-bold text-brand-ink">{sale.item}</p>
                <p className="font-body text-xs text-brand-ink/50 capitalize">{sale.paymentMethod} · {sale.date}</p>
              </div>
              <span className="font-body text-sm font-bold text-brand-primary">{formatNaira(sale.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}