import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, BarChart2, PieChart, Zap,
  Calendar, Download, ChevronDown, ChevronUp, ArrowUpRight,
  ArrowDownRight, Minus, AlertTriangle, CheckCircle, Info,
  Lightbulb, Target, ShoppingBag, Banknote, Users, Clock,
  RefreshCw, Star, Package, Truck, Activity, Eye,
  FileText, Layers, Filter,
} from "lucide-react";
import "./reports.css";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const fmt    = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const pct    = (n) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const fmtK   = (n) => n >= 1000 ? `₦${(n / 1000).toFixed(0)}k` : fmt(n);

/* ─────────────────────────────────────────────────────────────
   MOCK DATA — Nigerian small business (tomato/veg seller)
───────────────────────────────────────────────────────────── */

// Monthly P&L — 12 months
const MONTHLY_DATA = [
  { month: "Aug '24", revenue: 182000, expenses: 98000, profit: 84000, customers: 38 },
  { month: "Sep '24", revenue: 195000, expenses: 104000, profit: 91000, customers: 41 },
  { month: "Oct '24", revenue: 210000, expenses: 112000, profit: 98000, customers: 45 },
  { month: "Nov '24", revenue: 198000, expenses: 120000, profit: 78000, customers: 42 },
  { month: "Dec '24", revenue: 268000, expenses: 140000, profit: 128000, customers: 58 }, // festive
  { month: "Jan '25", revenue: 154000, expenses: 96000,  profit: 58000, customers: 33 }, // Jan slump
  { month: "Feb '25", revenue: 178000, expenses: 101000, profit: 77000, customers: 39 },
  { month: "Mar '25", revenue: 220000, expenses: 118000, profit: 102000, customers: 47 },
  { month: "Apr '25", revenue: 235000, expenses: 122000, profit: 113000, customers: 50 },
  { month: "May '25", revenue: 248000, expenses: 128000, profit: 120000, customers: 53 },
  { month: "Jun '25", revenue: 229000, expenses: 130000, profit: 99000, customers: 48 },
  { month: "Jul '25", revenue: 261000, expenses: 135000, profit: 126000, customers: 55 },
];

// Weekly data (current month)
const WEEKLY_DATA = [
  { week: "Wk 1", revenue: 58000, expenses: 28000, profit: 30000 },
  { week: "Wk 2", revenue: 72000, expenses: 34000, profit: 38000 },
  { week: "Wk 3", revenue: 65000, expenses: 31000, profit: 34000 },
  { week: "Wk 4", revenue: 66000, expenses: 32000, profit: 34000 },
];

// Daily data (last 14 days)
const DAILY_DATA = [
  { day: "4 Jul", revenue: 18000, expenses: 8000  },
  { day: "5 Jul", revenue: 8000,  expenses: 4000  },
  { day: "7 Jul", revenue: 22000, expenses: 9000  },
  { day: "8 Jul", revenue: 15000, expenses: 7000  },
  { day: "9 Jul", revenue: 11000, expenses: 5000  },
  { day: "10 Jul", revenue: 19000, expenses: 8500 },
  { day: "11 Jul", revenue: 24000, expenses: 10000},
  { day: "12 Jul", revenue: 16000, expenses: 7500 },
  { day: "14 Jul", revenue: 28000, expenses: 12000},
  { day: "15 Jul", revenue: 22000, expenses: 9000 },
  { day: "16 Jul", revenue: 18000, expenses: 8000 },
  { day: "17 Jul", revenue: 31000, expenses: 13000},
  { day: "18 Jul", revenue: 45000, expenses: 14000},
  { day: "19 Jul", revenue: 20000, expenses: 9000 },
];

// Expense breakdown
const EXPENSE_BREAKDOWN = [
  { category: "Inventory / Restock", amount: 68000, pct: 50.4, color: "#1c5b56" },
  { category: "Transport & Delivery", amount: 22000, pct: 16.3, color: "#c07830" },
  { category: "Market Fees & Levies", amount: 14000, pct: 10.4, color: "#7a3ea0" },
  { category: "Shop Rent",            amount: 15000, pct: 11.1, color: "#2d5fa0" },
  { category: "Generator / Utilities",amount: 9000,  pct: 6.7,  color: "#b04a2f" },
  { category: "Packaging",            amount: 7000,  pct: 5.2,  color: "#3a7a6e" },
];

// Revenue by payment method
const PAYMENT_SPLIT = [
  { method: "Bank Transfer", amount: 142000, pct: 54.4, color: "#1c5b56" },
  { method: "Cash",          amount: 74000,  pct: 28.4, color: "#c07830" },
  { method: "POS Terminal",  amount: 45000,  pct: 17.2, color: "#7a3ea0" },
];

// Top products
const TOP_PRODUCTS = [
  { name: "Tomato – Bulk Order",   revenue: 112000, units: 8,  margin: 38 },
  { name: "Wholesale Mix Order",   revenue: 88000,  units: 4,  margin: 42 },
  { name: "Pepper & Onion Mix",    revenue: 36000,  units: 12, margin: 34 },
  { name: "Mixed Vegetables",      revenue: 18000,  units: 6,  margin: 29 },
  { name: "Tomato – Walk-in",      revenue: 7000,   units: 3,  margin: 45 },
];

// Best days of week (0=Sun)
const DAY_PERFORMANCE = [
  { day: "Mon", avg: 28000, rank: 3 },
  { day: "Tue", avg: 22000, rank: 5 },
  { day: "Wed", avg: 19000, rank: 6 },
  { day: "Thu", avg: 25000, rank: 4 },
  { day: "Fri", avg: 35000, rank: 2 },
  { day: "Sat", avg: 48000, rank: 1 },
  { day: "Sun", avg: 10000, rank: 7 },
];

// AI Insights — Nigerian-market specific
const AI_INSIGHTS = [
  {
    id: 1,
    type: "opportunity",
    icon: TrendingUp,
    priority: "high",
    title: "Saturday earns 2.5× more than Wednesday",
    body: "Your Saturday average is ₦48,000 vs ₦19,000 on Wednesday. Consider increasing stock on Fridays so you are fully prepared for your peak trading day.",
    action: "Stock up every Friday",
  },
  {
    id: 2,
    type: "warning",
    icon: AlertTriangle,
    priority: "high",
    title: "Transport costs jumped 28% in 2 months",
    body: "Transport & Delivery went from ₦14,500 in May to ₦22,000 in July. This is eating 16% of your revenue. Consider grouping deliveries or negotiating a fixed weekly rate with your driver.",
    action: "Review transport arrangements",
  },
  {
    id: 3,
    type: "opportunity",
    icon: Package,
    priority: "medium",
    title: "Wholesale orders have your highest margin",
    body: "Wholesale Mix Orders average 42% margin — your best product. Yet you only close 4 wholesale deals per month. Reaching out to 2–3 more bulk buyers could add ₦44,000 to your monthly profit.",
    action: "Target 2 new wholesale clients",
  },
  {
    id: 4,
    type: "warning",
    icon: AlertTriangle,
    priority: "medium",
    title: "January dip is predictable — prepare now",
    body: "Last January your revenue fell 42% from December. This happens every year after festive spending. Build a ₦50,000 cash reserve in October–November so you can cover rent and restock in January without borrowing.",
    action: "Start January savings plan",
  },
  {
    id: 5,
    type: "insight",
    icon: Users,
    priority: "medium",
    title: "Iya Risi & Alhaji Musa = 41% of your revenue",
    body: "Two customers account for over 40% of your income. This is a risk — if either stops buying, your revenue drops sharply. Diversify by onboarding 3–4 new wholesale clients before year-end.",
    action: "Reduce customer concentration",
  },
  {
    id: 6,
    type: "opportunity",
    icon: Zap,
    priority: "low",
    title: "Festive season in 5 months — plan stock now",
    body: "December '24 was your biggest month ever at ₦268,000. Start building supplier relationships and pre-ordering stock in October. Last year you ran out of tomatoes in week 2 of December.",
    action: "Build festive stock plan",
  },
  {
    id: 7,
    type: "insight",
    icon: Banknote,
    priority: "low",
    title: "Transfer payments correlate with larger orders",
    body: "Customers paying by bank transfer spend an average of ₦28,400 vs ₦8,200 for cash payers. Encourage transfer payment with a small discount to attract higher-value orders.",
    action: "Offer transfer incentive",
  },
];

// Business health score breakdown
const HEALTH_SCORES = [
  { label: "Consistent Tracking",   score: 92, max: 100, color: "#1c5b56" },
  { label: "Profit Margin",         score: 48, max: 100, color: "#c07830" },
  { label: "Customer Growth",       score: 71, max: 100, color: "#2d5fa0" },
  { label: "Expense Control",       score: 55, max: 100, color: "#7a3ea0" },
  { label: "Revenue Stability",     score: 68, max: 100, color: "#3a7a6e" },
  { label: "Receipt Sending Rate",  score: 83, max: 100, color: "#b8860b" },
];

/* ─────────────────────────────────────────────────────────────
   SVG BAR CHART COMPONENT
───────────────────────────────────────────────────────────── */
function BarChart({ data, xKey, bars, height = 180 }) {
  const maxVal = Math.max(...data.map(d => Math.max(...bars.map(b => d[b.key] || 0))));
  const W = 100 / data.length;

  return (
    <div className="rr-chart-wrap">
      <svg viewBox={`0 0 ${data.length * 44} ${height + 24}`} className="rr-bar-svg" preserveAspectRatio="none">
        {data.map((d, i) => (
          <g key={i} transform={`translate(${i * 44}, 0)`}>
            {bars.map((bar, bi) => {
              const val = d[bar.key] || 0;
              const h   = maxVal > 0 ? (val / maxVal) * height : 0;
              const bw  = bars.length === 1 ? 28 : 12;
              const bx  = bars.length === 1 ? 8 : 6 + bi * 14;
              return (
                <rect
                  key={bi}
                  x={bx} y={height - h}
                  width={bw} height={h}
                  rx={3} fill={bar.color}
                  opacity={0.88}
                  className="rr-bar-rect"
                />
              );
            })}
            <text
              x={22} y={height + 16}
              textAnchor="middle"
              fontSize={8}
              fill="#8fa8a5"
              fontFamily="Space Mono, monospace"
            >
              {d[xKey]}
            </text>
          </g>
        ))}
        {/* Zero line */}
        <line x1={0} y1={height} x2={data.length * 44} y2={height} stroke="rgba(28,91,86,0.15)" strokeWidth={1} />
      </svg>
      {/* Legend */}
      {bars.length > 1 && (
        <div className="rr-chart-legend">
          {bars.map(b => (
            <div key={b.key} className="rr-legend-item">
              <span className="rr-legend-dot" style={{ background: b.color }} />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────────────────────── */
function DonutChart({ data, size = 120 }) {
  const total  = data.reduce((s, d) => s + d.pct, 0);
  const r      = 44;
  const cx     = size / 2;
  const cy     = size / 2;
  const circum = 2 * Math.PI * r;

  let cumulative = 0;
  const slices = data.map((d) => {
    const dash   = (d.pct / 100) * circum;
    const offset = circum - (cumulative / 100) * circum;
    cumulative  += d.pct;
    return { ...d, dash, offset };
  });

  return (
    <svg width={size} height={size} className="rr-donut-svg">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(28,91,86,0.08)" strokeWidth={14} />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={14}
          strokeDasharray={`${s.dash} ${circum - s.dash}`}
          strokeDashoffset={s.offset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`}
          className="rr-donut-arc"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   TREND INDICATOR
───────────────────────────────────────────────────────────── */
function Trend({ value, suffix = "%" }) {
  if (value > 0)  return <span className="rr-trend rr-trend--up"><ArrowUpRight size={13} />{value.toFixed(1)}{suffix}</span>;
  if (value < 0)  return <span className="rr-trend rr-trend--dn"><ArrowDownRight size={13} />{Math.abs(value).toFixed(1)}{suffix}</span>;
  return <span className="rr-trend rr-trend--flat"><Minus size={13} />0{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   INSIGHT CARD
───────────────────────────────────────────────────────────── */
function InsightCard({ insight, isExpanded, onToggle }) {
  const typeMap = {
    opportunity: { color: "#1c5b56", bg: "rgba(28,91,86,0.1)",   label: "Opportunity" },
    warning:     { color: "#b04a2f", bg: "rgba(176,74,47,0.1)",  label: "Warning"     },
    insight:     { color: "#2d5fa0", bg: "rgba(45,95,160,0.1)",  label: "Insight"     },
  };
  const prioMap = {
    high:   { color: "#b04a2f", label: "High Priority"   },
    medium: { color: "#c07830", label: "Medium Priority" },
    low:    { color: "#5a706d", label: "Low Priority"    },
  };
  const meta  = typeMap[insight.type]  || typeMap.insight;
  const prio  = prioMap[insight.priority] || prioMap.low;
  const Icon  = insight.icon;

  return (
    <div className={`rr-insight-card ${isExpanded ? "rr-insight-card--open" : ""}`} onClick={onToggle}>
      <div className="rr-insight-header">
        <div className="rr-insight-icon" style={{ background: meta.bg, color: meta.color }}>
          <Icon size={16} />
        </div>
        <div className="rr-insight-mid">
          <div className="rr-insight-badges">
            <span className="rr-insight-type" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
            <span className="rr-insight-prio" style={{ color: prio.color }}>● {prio.label}</span>
          </div>
          <div className="rr-insight-title">{insight.title}</div>
        </div>
        <div className="rr-insight-chevron">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      {isExpanded && (
        <div className="rr-insight-body">
          <p className="rr-insight-body-text">{insight.body}</p>
          <div className="rr-insight-action">
            <Target size={13} />
            <span>Next step: {insight.action}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HEALTH SCORE RING
───────────────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const r      = 52;
  const circum = 2 * Math.PI * r;
  const dash   = (score / 100) * circum;
  const color  = score >= 75 ? "#1c5b56" : score >= 50 ? "#c07830" : "#b04a2f";
  const label  = score >= 75 ? "Healthy" : score >= 50 ? "Fair" : "Needs Work";

  return (
    <div className="rr-score-ring-wrap">
      <svg width={130} height={130} className="rr-score-svg">
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(28,91,86,0.1)" strokeWidth={10} />
        <circle
          cx={65} cy={65} r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circum - dash}`}
          strokeDashoffset={circum * 0.25}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          className="rr-score-arc"
        />
        <text x={65} y={60} textAnchor="middle" fontSize={26} fontWeight={800}
          fontFamily="Montserrat, sans-serif" fill="#0e1b1a">{score}</text>
        <text x={65} y={76} textAnchor="middle" fontSize={10}
          fontFamily="Space Mono, monospace" fill={color}>{label}</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function Reports() {
  const [period,        setPeriod]        = useState("monthly");   // daily | weekly | monthly
  const [expandedIns,   setExpandedIns]   = useState(new Set([1]));
  const [insightFilter, setInsightFilter] = useState("all");       // all | opportunity | warning | insight
  const [chartMetric,   setChartMetric]   = useState("profit");    // profit | revenue | expenses

  const chartData = period === "daily" ? DAILY_DATA : period === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;
  const xKey      = period === "daily" ? "day" : period === "weekly" ? "week" : "month";

  // KPIs — current vs previous period (last month)
  const currMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const revChange = ((currMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;
  const expChange = ((currMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100;
  const proChange = ((currMonth.profit  - prevMonth.profit)  / prevMonth.profit)  * 100;
  const cstChange = ((currMonth.customers - prevMonth.customers) / prevMonth.customers) * 100;

  const totalRevenue  = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalProfit   = MONTHLY_DATA.reduce((s, d) => s + d.profit, 0);
  const avgMargin     = ((totalProfit / totalRevenue) * 100).toFixed(1);
  const bestMonth     = MONTHLY_DATA.reduce((a, b) => b.profit > a.profit ? b : a);
  const overallScore  = Math.round(HEALTH_SCORES.reduce((s, h) => s + h.score, 0) / HEALTH_SCORES.length);

  const chartBars = chartMetric === "profit"
    ? [{ key: "profit",   label: "Profit",   color: "#1c5b56" }]
    : chartMetric === "revenue"
    ? [{ key: "revenue",  label: "Revenue",  color: "#2d5fa0" }]
    : [{ key: "expenses", label: "Expenses", color: "#b04a2f" }];

  const toggleInsight = (id) => {
    setExpandedIns(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredInsights = AI_INSIGHTS.filter(i =>
    insightFilter === "all" || i.type === insightFilter
  );

  const highCount = AI_INSIGHTS.filter(i => i.priority === "high").length;

  return (
    <div className="rr-root">

      {/* ── PAGE HEADER ── */}
      <div className="rr-header">
        <div className="rr-header-left">
          <span className="rr-breadcrumb">Dashboard › Reports</span>
          <h1 className="rr-title">Reports &amp; Analytics</h1>
          <p className="rr-subtitle">Profit, trends &amp; AI-powered insights for your business</p>
        </div>
        <div className="rr-header-actions">
          <div className="rr-period-switcher">
            {["daily", "weekly", "monthly"].map(p => (
              <button
                key={p}
                className={`rr-period-btn ${period === p ? "rr-period-btn--active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="rr-export-btn">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="rr-kpi-grid">
        <div className="rr-kpi rr-kpi--revenue">
          <div className="rr-kpi-top">
            <div className="rr-kpi-icon"><TrendingUp size={18} /></div>
            <Trend value={revChange} />
          </div>
          <div className="rr-kpi-value">{fmt(currMonth.revenue)}</div>
          <div className="rr-kpi-label">Revenue This Month</div>
          <div className="rr-kpi-sub">vs {fmt(prevMonth.revenue)} last month</div>
          <div className="rr-kpi-bar-track">
            <div className="rr-kpi-bar-fill rr-kpi-bar-fill--rev"
              style={{ width: `${Math.min((currMonth.revenue / 300000) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="rr-kpi rr-kpi--profit">
          <div className="rr-kpi-top">
            <div className="rr-kpi-icon"><Banknote size={18} /></div>
            <Trend value={proChange} />
          </div>
          <div className="rr-kpi-value">{fmt(currMonth.profit)}</div>
          <div className="rr-kpi-label">Net Profit This Month</div>
          <div className="rr-kpi-sub">Margin: {((currMonth.profit / currMonth.revenue) * 100).toFixed(1)}%</div>
          <div className="rr-kpi-bar-track">
            <div className="rr-kpi-bar-fill rr-kpi-bar-fill--prof"
              style={{ width: `${Math.min((currMonth.profit / 150000) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="rr-kpi rr-kpi--expenses">
          <div className="rr-kpi-top">
            <div className="rr-kpi-icon"><ShoppingBag size={18} /></div>
            <Trend value={expChange} />
          </div>
          <div className="rr-kpi-value">{fmt(currMonth.expenses)}</div>
          <div className="rr-kpi-label">Total Expenses</div>
          <div className="rr-kpi-sub">vs {fmt(prevMonth.expenses)} last month</div>
          <div className="rr-kpi-bar-track">
            <div className="rr-kpi-bar-fill rr-kpi-bar-fill--exp"
              style={{ width: `${Math.min((currMonth.expenses / 200000) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="rr-kpi rr-kpi--customers">
          <div className="rr-kpi-top">
            <div className="rr-kpi-icon"><Users size={18} /></div>
            <Trend value={cstChange} />
          </div>
          <div className="rr-kpi-value">{currMonth.customers}</div>
          <div className="rr-kpi-label">Active Customers</div>
          <div className="rr-kpi-sub">vs {prevMonth.customers} last month</div>
          <div className="rr-kpi-bar-track">
            <div className="rr-kpi-bar-fill rr-kpi-bar-fill--cst"
              style={{ width: `${Math.min((currMonth.customers / 70) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ── MAIN CHART + EXPENSE BREAKDOWN ── */}
      <div className="rr-row rr-row--chart">

        {/* Main chart card */}
        <div className="rr-card rr-card--chart">
          <div className="rr-card-header">
            <div>
              <div className="rr-card-title">
                <BarChart2 size={16} /> Profit &amp; Revenue Trend
              </div>
              <div className="rr-card-sub">{period === "daily" ? "Last 14 days" : period === "weekly" ? "This month by week" : "Last 12 months"}</div>
            </div>
            <div className="rr-metric-tabs">
              {[
                { k: "profit",   l: "Profit"   },
                { k: "revenue",  l: "Revenue"  },
                { k: "expenses", l: "Expenses" },
              ].map(m => (
                <button
                  key={m.k}
                  className={`rr-metric-btn ${chartMetric === m.k ? "rr-metric-btn--active" : ""}`}
                  onClick={() => setChartMetric(m.k)}
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={chartData} xKey={xKey} bars={chartBars} height={160} />

          {/* Summary row below chart */}
          <div className="rr-chart-summary">
            <div className="rr-cs-item">
              <div className="rr-cs-label">12-month Revenue</div>
              <div className="rr-cs-value">{fmt(totalRevenue)}</div>
            </div>
            <div className="rr-cs-divider" />
            <div className="rr-cs-item">
              <div className="rr-cs-label">12-month Profit</div>
              <div className="rr-cs-value rr-cs-value--green">{fmt(totalProfit)}</div>
            </div>
            <div className="rr-cs-divider" />
            <div className="rr-cs-item">
              <div className="rr-cs-label">Avg Profit Margin</div>
              <div className="rr-cs-value">{avgMargin}%</div>
            </div>
            <div className="rr-cs-divider" />
            <div className="rr-cs-item">
              <div className="rr-cs-label">Best Month</div>
              <div className="rr-cs-value">{bestMonth.month}</div>
            </div>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="rr-card rr-card--donut">
          <div className="rr-card-header">
            <div className="rr-card-title"><PieChart size={16} /> Expense Breakdown</div>
          </div>
          <div className="rr-donut-wrap">
            <DonutChart data={EXPENSE_BREAKDOWN} size={140} />
            <div className="rr-donut-center-label">
              <div className="rr-donut-total">{fmt(currMonth.expenses)}</div>
              <div className="rr-donut-sub">This month</div>
            </div>
          </div>
          <div className="rr-donut-legend">
            {EXPENSE_BREAKDOWN.map((e, i) => (
              <div key={i} className="rr-donut-row">
                <span className="rr-donut-dot" style={{ background: e.color }} />
                <span className="rr-donut-cat">{e.category}</span>
                <span className="rr-donut-pct">{e.pct}%</span>
                <span className="rr-donut-amt">{fmt(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECOND ROW: BEST DAYS + PAYMENT SPLIT + TOP PRODUCTS ── */}
      <div className="rr-row rr-row--three">

        {/* Best trading days */}
        <div className="rr-card">
          <div className="rr-card-header">
            <div className="rr-card-title"><Calendar size={16} /> Best Trading Days</div>
          </div>
          <div className="rr-days-grid">
            {DAY_PERFORMANCE.map((d, i) => {
              const max   = Math.max(...DAY_PERFORMANCE.map(x => x.avg));
              const w     = (d.avg / max) * 100;
              const isBest = d.rank === 1;
              return (
                <div key={i} className={`rr-day-row ${isBest ? "rr-day-row--best" : ""}`}>
                  <div className="rr-day-label">{d.day}</div>
                  <div className="rr-day-bar-wrap">
                    <div
                      className="rr-day-bar"
                      style={{
                        width: `${w}%`,
                        background: isBest ? "#1c5b56" : d.rank <= 3 ? "#3a7a6e" : "rgba(28,91,86,0.25)",
                      }}
                    />
                  </div>
                  <div className="rr-day-val">{fmtK(d.avg)}</div>
                  {isBest && <span className="rr-day-best-badge"><Star size={10} /> Best</span>}
                </div>
              );
            })}
          </div>
          <div className="rr-card-note">
            <Clock size={11} /> Averages based on last 12 months of trading data
          </div>
        </div>

        {/* Payment method split */}
        <div className="rr-card">
          <div className="rr-card-header">
            <div className="rr-card-title"><Layers size={16} /> Payment Methods</div>
          </div>
          <div className="rr-payment-list">
            {PAYMENT_SPLIT.map((p, i) => (
              <div key={i} className="rr-payment-row">
                <div className="rr-payment-top">
                  <span className="rr-payment-method">{p.method}</span>
                  <span className="rr-payment-pct" style={{ color: p.color }}>{p.pct}%</span>
                </div>
                <div className="rr-payment-bar-track">
                  <div className="rr-payment-bar-fill"
                    style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <div className="rr-payment-amt">{fmt(p.amount)}</div>
              </div>
            ))}
          </div>
          <div className="rr-card-note">
            <Info size={11} /> Transfer payments average 3.5× larger than cash
          </div>
        </div>

        {/* Top products */}
        <div className="rr-card">
          <div className="rr-card-header">
            <div className="rr-card-title"><Package size={16} /> Top Products</div>
          </div>
          <div className="rr-products-list">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="rr-product-row">
                <div className="rr-product-rank">{i + 1}</div>
                <div className="rr-product-info">
                  <div className="rr-product-name">{p.name}</div>
                  <div className="rr-product-meta">
                    <span>{p.units} orders</span>
                    <span className="rr-product-margin" style={{
                      color: p.margin >= 40 ? "#1c5b56" : p.margin >= 30 ? "#c07830" : "#b04a2f"
                    }}>
                      {p.margin}% margin
                    </span>
                  </div>
                </div>
                <div className="rr-product-revenue">{fmt(p.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HEALTH SCORE ── */}
      <div className="rr-row rr-row--health">
        <div className="rr-card rr-card--health">
          <div className="rr-card-header">
            <div className="rr-card-title"><Activity size={16} /> Business Health Score</div>
            <div className="rr-health-badge" style={{
              color: overallScore >= 75 ? "#1c5b56" : overallScore >= 50 ? "#c07830" : "#b04a2f",
              background: overallScore >= 75 ? "rgba(28,91,86,0.1)" : overallScore >= 50 ? "rgba(192,120,48,0.1)" : "rgba(176,74,47,0.1)",
            }}>
              Overall: {overallScore}/100
            </div>
          </div>
          <div className="rr-health-body">
            <ScoreRing score={overallScore} />
            <div className="rr-health-metrics">
              {HEALTH_SCORES.map((h, i) => (
                <div key={i} className="rr-health-row">
                  <div className="rr-health-label">{h.label}</div>
                  <div className="rr-health-bar-wrap">
                    <div className="rr-health-bar-track">
                      <div
                        className="rr-health-bar-fill"
                        style={{ width: `${h.score}%`, background: h.color }}
                      />
                    </div>
                    <span className="rr-health-score" style={{ color: h.color }}>{h.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rr-health-tips">
              <div className="rr-health-tip-title"><Lightbulb size={13} /> How to improve your score</div>
              <div className="rr-health-tip">Log every sale and expense daily — even small ones</div>
              <div className="rr-health-tip">Send receipts to every customer who buys from you</div>
              <div className="rr-health-tip">Add at least 2 new customers each month</div>
              <div className="rr-health-tip">Review expenses monthly and cut what isn't growing your business</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI INSIGHTS ── */}
      <div className="rr-insights-section">
        <div className="rr-insights-header">
          <div>
            <div className="rr-card-title" style={{ fontSize: 16 }}>
              <Zap size={16} /> AI Business Insights
            </div>
            <div className="rr-card-sub">
              {highCount} high-priority action{highCount !== 1 ? "s" : ""} for your business right now
            </div>
          </div>
          <div className="rr-insight-filters">
            {["all", "opportunity", "warning", "insight"].map(f => (
              <button
                key={f}
                className={`rr-if-btn ${insightFilter === f ? "rr-if-btn--active" : ""}`}
                onClick={() => setInsightFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="rr-insights-list">
          {filteredInsights.map(ins => (
            <InsightCard
              key={ins.id}
              insight={ins}
              isExpanded={expandedIns.has(ins.id)}
              onToggle={() => toggleInsight(ins.id)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}