import type { Sale, Expense, Debt, InventoryItem } from '../types';
import { formatNaira } from './currency';
import { generateInsights } from './growthInsights';

// ---------- Category suggestion (auto-categorization) ----------

const SALE_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Product Sales': ['tomato', 'pepper', 'onion', 'bag', 'basket', 'product', 'item', 'goods', 'stock'],
  'Service': ['delivery', 'repair', 'service', 'installation', 'consultation', 'design', 'wash', 'clean'],
};

const EXPENSE_TYPE_KEYWORDS: Record<string, string[]> = {
  'Transport': ['transport', 'fuel', 'bus', 'okada', 'uber', 'bolt', 'fare', 'delivery cost'],
  'Materials': ['material', 'supply', 'supplies', 'ingredient', 'stock', 'raw'],
  'Shop Rent': ['rent', 'lease', 'shop', 'stall'],
  'Utilities': ['light', 'electricity', 'nepa', 'water', 'internet', 'data', 'wifi'],
  'Salaries': ['salary', 'wage', 'staff pay', 'payroll'],
};

export function suggestSaleCategory(description: string): string | null {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(SALE_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return null;
}

export function suggestExpenseType(description: string): string | null {
  const lower = description.toLowerCase();
  for (const [type, keywords] of Object.entries(EXPENSE_TYPE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return type;
  }
  return null;
}

// ---------- Business Q&A ----------

interface BusinessData {
  sales: Sale[];
  expenses: Expense[];
  debts: Debt[];
  inventory: InventoryItem[];
}

export function answerBusinessQuestion(question: string, data: BusinessData): string {
  const q = question.toLowerCase();
  const { sales, expenses, debts, inventory } = data;

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter((s) => s.date === today).reduce((sum, s) => sum + s.amount, 0);
  const todayExpenses = expenses.filter((e) => e.date === today).reduce((sum, e) => sum + e.amount, 0);
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Debts
  if (/owe|debt|credit/.test(q)) {
    const unpaid = debts.filter((d) => d.status !== 'paid');
    if (unpaid.length === 0) return "Good news — nobody currently owes you money. Your debt book is clear! 🎉";
    const total = unpaid.reduce((sum, d) => sum + (d.amount - d.amountPaid), 0);
    const biggest = [...unpaid].sort((a, b) => (b.amount - b.amountPaid) - (a.amount - a.amountPaid))[0];
    return `You're currently owed ${formatNaira(total)} across ${unpaid.length} customer${unpaid.length > 1 ? 's' : ''}. The biggest is ${biggest.customerName} at ${formatNaira(biggest.amount - biggest.amountPaid)}.`;
  }

  // Today's performance
  if (/today/.test(q)) {
    return `Today you've made ${formatNaira(todaySales)} in sales and spent ${formatNaira(todayExpenses)}, for a net of ${formatNaira(todaySales - todayExpenses)}.`;
  }

  // Overall sales
  if (/how much.*(sold|sales|made|earn)/.test(q) || /sales total/.test(q)) {
    return `You've made ${formatNaira(totalSales)} in total sales, across ${sales.length} transactions.`;
  }

  // Expenses / spending
  if (/spend|spent|expense/.test(q)) {
    const topType = Object.entries(
      expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + e.amount;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0];
    return `You've spent ${formatNaira(totalExpenses)} in total. Your biggest expense category is ${topType ? topType[0] : 'not enough data yet'}${topType ? ` at ${formatNaira(topType[1])}` : ''}.`;
  }

  // Profit / margin
  if (/profit|margin/.test(q)) {
    const profit = totalSales - totalExpenses;
    const marginPct = totalSales > 0 ? Math.round((profit / totalSales) * 100) : 0;
    return `Your overall profit is ${formatNaira(profit)}, which is a ${marginPct}% margin on total sales.`;
  }

  // Stock / inventory
  if (/stock|inventory|low/.test(q)) {
    const low = inventory.filter((i) => i.quantity <= i.lowStockThreshold);
    if (low.length === 0) return "All your inventory items are well-stocked right now. Nothing needs restocking.";
    return `${low.length} item${low.length > 1 ? 's are' : ' is'} running low: ${low.map((i) => i.name).join(', ')}. Consider restocking soon.`;
  }

  // Best seller
  if (/best.?sell|top.?product|top.?item/.test(q)) {
    if (sales.length === 0) return "You haven't logged any sales yet, so I can't tell your best seller.";
    const totals = sales.reduce<Record<string, number>>((acc, s) => {
      acc[s.item] = (acc[s.item] || 0) + s.amount;
      return acc;
    }, {});
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return `Your top seller so far is "${top[0]}" with ${formatNaira(top[1])} in total sales.`;
  }

  // Growth tip / insight
  if (/tip|insight|advice|grow|improve/.test(q)) {
    const insights = generateInsights(sales, expenses, debts, inventory);
    if (insights.length === 0) return "Log a few more sales and expenses and I'll be able to give you personalized tips!";
    return insights[Math.floor(Math.random() * insights.length)].message;
  }

  // Fallback
  return "I can help with things like: \"How much did I make today?\", \"Who owes me money?\", \"What's low in stock?\", \"Give me a growth tip\", or \"What's my best-selling item?\" — try asking one of those!";
}

// ---------- WhatsApp promo generator ----------

const PROMO_TEMPLATES = [
  (biz: string, item: string, discount: string) =>
    `🔥 *FLASH SALE* at ${biz}!\n\nGet ${discount} off ${item} — today only!\n\nDon't miss out, message us now to order. 🛍️`,
  (biz: string, item: string, discount: string) =>
    `📢 Special offer from ${biz}!\n\n${item} now ${discount} off. Limited stock, first come first served!\n\nOrder now via WhatsApp. ✅`,
  (biz: string, item: string, discount: string) =>
    `${biz} presents: ${item} at ${discount} off! 🎉\n\nTreat yourself or someone you love — offer won't last long.\n\nDM to grab yours today!`,
];

export function generatePromoMessage(businessName: string, item: string, discount: string): string {
  const template = PROMO_TEMPLATES[Math.floor(Math.random() * PROMO_TEMPLATES.length)];
  return template(businessName, item, discount);
}