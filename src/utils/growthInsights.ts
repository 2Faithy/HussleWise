import type { Sale, Expense, Debt, InventoryItem } from '../types';

export interface Insight {
  type: 'positive' | 'warning' | 'neutral';
  message: string;
}

// Debt-payment sales are real revenue (correctly counted in totals/margin),
// but their synthetic item names ("Debt Payment — Name") shouldn't be
// treated as products when ranking top-selling items or best-selling days.
function isProductSale(sale: Sale): boolean {
  return sale.category !== 'Debt Payment';
}

// Mirrors the live recalculation Debts.tsx does for display — the
// database's stored `status` only updates on create/payment, so a debt
// whose due date has silently passed since then would otherwise be
// undercounted here.
function getLiveDebtStatus(debt: Debt): 'pending' | 'paid' | 'overdue' {
  const balance = debt.amount - debt.amountPaid;
  if (balance <= 0) return 'paid';
  return new Date(debt.dueDate) < new Date() ? 'overdue' : 'pending';
}

export function calculateHealthScore(
  sales: Sale[],
  expenses: Expense[],
  debts: Debt[],
  inventory: InventoryItem[],
  receiptsSentCount: number
): number {
  let score = 0;

  // Consistent tracking (up to 30 pts) — more logged activity = better habit
  const totalRecords = sales.length + expenses.length;
  score += Math.min(30, totalRecords * 2);

  // Profitability (up to 30 pts)
  const totalIn = sales.reduce((s, x) => s + x.amount, 0);
  const totalOut = expenses.reduce((s, x) => s + x.amount, 0);
  const margin = totalIn > 0 ? (totalIn - totalOut) / totalIn : 0;
  score += Math.max(0, Math.min(30, margin * 60));

  // Debt management (up to 20 pts) — fewer overdue debts is healthier
  const overdueCount = debts.filter((d) => getLiveDebtStatus(d) === 'overdue').length;
  score += Math.max(0, 20 - overdueCount * 7);

  // Receipts sent (up to 10 pts) — professionalism signal
  score += Math.min(10, receiptsSentCount * 2);

  // Inventory health (up to 10 pts) — penalize low stock
  const lowStockCount = inventory.filter((i) => i.quantity <= i.lowStockThreshold).length;
  score += Math.max(0, 10 - lowStockCount * 3);

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function generateInsights(
  sales: Sale[],
  expenses: Expense[],
  debts: Debt[],
  inventory: InventoryItem[]
): Insight[] {
  const insights: Insight[] = [];
  const productSales = sales.filter(isProductSale);

  // Best-selling day of the week (product sales only)
  if (productSales.length >= 3) {
    const dayTotals: Record<string, number> = {};
    productSales.forEach((s) => {
      const day = new Date(s.date).toLocaleDateString('en-NG', { weekday: 'long' });
      dayTotals[day] = (dayTotals[day] || 0) + s.amount;
    });
    const bestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    if (bestDay) {
      insights.push({
        type: 'positive',
        message: `Your best-selling day is ${bestDay[0]}. Consider stocking more ahead of it.`,
      });
    }
  }

  // Profit margin trend (all revenue, including debt payments — real cash is real cash)
  const totalIn = sales.reduce((s, x) => s + x.amount, 0);
  const totalOut = expenses.reduce((s, x) => s + x.amount, 0);
  if (totalIn > 0) {
    const marginPct = Math.round(((totalIn - totalOut) / totalIn) * 100);
    if (marginPct < 15) {
      insights.push({
        type: 'warning',
        message: `Your profit margin is ${marginPct}%. Check your expenses — they may be eating into profit.`,
      });
    } else {
      insights.push({
        type: 'positive',
        message: `Your profit margin is a healthy ${marginPct}%. Keep it up!`,
      });
    }
  }

  // Overdue debts — using live status, not the potentially-stale stored one
  const overdue = debts.filter((d) => getLiveDebtStatus(d) === 'overdue');
  if (overdue.length > 0) {
    const totalOverdue = overdue.reduce((s, d) => s + (d.amount - d.amountPaid), 0);
    insights.push({
      type: 'warning',
      message: `You have ${overdue.length} overdue debt${overdue.length > 1 ? 's' : ''} totaling ₦${totalOverdue.toLocaleString('en-NG')}. Consider following up.`,
    });
  }

  // Low stock
  const lowStock = inventory.filter((i) => i.quantity <= i.lowStockThreshold);
  if (lowStock.length > 0) {
    insights.push({
      type: 'warning',
      message: `${lowStock.map((i) => i.name).join(', ')} ${lowStock.length > 1 ? 'are' : 'is'} running low. Time to restock.`,
    });
  }

  // Top-selling item (product sales only, so debt payments/storefront labels don't win by accident)
  if (productSales.length >= 2) {
    const itemTotals: Record<string, number> = {};
    productSales.forEach((s) => {
      itemTotals[s.item] = (itemTotals[s.item] || 0) + s.amount;
    });
    const topItem = Object.entries(itemTotals).sort((a, b) => b[1] - a[1])[0];
    if (topItem) {
      insights.push({
        type: 'neutral',
        message: `"${topItem[0]}" is your top earner so far. Make sure you never run out.`,
      });
    }
  }

  // Expense category watch
  const recurringTotal = expenses.filter((e) => e.recurring).reduce((s, e) => s + e.amount, 0);
  if (recurringTotal > 0 && totalIn > 0 && recurringTotal / totalIn > 0.3) {
    insights.push({
      type: 'warning',
      message: `Recurring expenses (like rent) make up over 30% of your income. Worth reviewing fixed costs.`,
    });
  }

  return insights;
}