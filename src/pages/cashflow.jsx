import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./cashflow.css";

const MOCK_TRANSACTIONS = [
  { id: 1,  type: "in",  amount: 45000, label: "Tomato Sales – Bulk Order",   category: "Product Sales", method: "Transfer", date: "2025-07-18", customer: "Tolu Adeyemi" },
  { id: 2,  type: "out", amount: 8500,  label: "Transport – Oyingbo Market",  category: "Transport",     method: "Cash",     date: "2025-07-18", customer: null },
  { id: 3,  type: "in",  amount: 12000, label: "Pepper & Onion Mix",          category: "Product Sales", method: "POS",      date: "2025-07-17", customer: "Mama Blessing" },
  { id: 4,  type: "out", amount: 15000, label: "Shop Rent (Monthly)",         category: "Rent",          method: "Transfer", date: "2025-07-17", customer: null },
  { id: 5,  type: "in",  amount: 6500,  label: "Tomato – Walk-in Sale",       category: "Product Sales", method: "Cash",     date: "2025-07-16", customer: null },
  { id: 6,  type: "out", amount: 3200,  label: "Fuel for Generator",          category: "Utilities",     method: "Cash",     date: "2025-07-16", customer: null },
  { id: 7,  type: "in",  amount: 22000, label: "Wholesale Order – Iya Risi",  category: "Product Sales", method: "Transfer", date: "2025-07-15", customer: "Iya Risi" },
  { id: 8,  type: "out", amount: 5000,  label: "Market Association Levy",     category: "Fees",          method: "Cash",     date: "2025-07-15", customer: null },
  { id: 9,  type: "in",  amount: 9800,  label: "Mixed Vegetables",            category: "Product Sales", method: "POS",      date: "2025-07-14", customer: "Chidinma O." },
  { id: 10, type: "out", amount: 11000, label: "Restock – Tomato Farm",       category: "Inventory",     method: "Transfer", date: "2025-07-14", customer: null },
];

const CATEGORIES_IN  = ["All", "Product Sales", "Service", "Other Income"];
const CATEGORIES_OUT = ["All", "Transport", "Rent", "Utilities", "Inventory", "Fees", "Materials"];
const METHODS        = ["All", "Cash", "Transfer", "POS"];

const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const METHOD_ICONS = { Cash: "💵", Transfer: "🏦", POS: "💳" };

const CATEGORY_COLORS = {
  "Product Sales": "#1c5b56",
  Service:         "#2d8a82",
  Rent:            "#b04a2f",
  Transport:       "#c07830",
  Utilities:       "#7a5c1e",
  Inventory:       "#3a7a6e",
  Fees:            "#8c4a1a",
  Materials:       "#5a6e2c",
  "Other Income":  "#3d6b5e",
};

export default function Cashflow() {
  const navigate = useNavigate();

  const [activeTab,      setActiveTab]      = useState("all");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMethod,   setFilterMethod]   = useState("All");
  const [search,         setSearch]         = useState("");

  const totalsIn  = MOCK_TRANSACTIONS.filter(t => t.type === "in").reduce((s, t)  => s + t.amount, 0);
  const totalsOut = MOCK_TRANSACTIONS.filter(t => t.type === "out").reduce((s, t) => s + t.amount, 0);
  const balance   = totalsIn - totalsOut;

  const filtered = useMemo(() => MOCK_TRANSACTIONS.filter(t => {
    if (activeTab === "in"  && t.type !== "in")  return false;
    if (activeTab === "out" && t.type !== "out") return false;
    if (filterCategory !== "All" && t.category !== filterCategory) return false;
    if (filterMethod   !== "All" && t.method   !== filterMethod)   return false;
    if (search &&
      !t.label.toLowerCase().includes(search.toLowerCase()) &&
      !(t.customer || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [activeTab, filterCategory, filterMethod, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(t => { if (!g[t.date]) g[t.date] = []; g[t.date].push(t); });
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const formatDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long",
  });

  const dayTotal = (txns) => ({
    inn: txns.filter(t => t.type === "in").reduce((s, t)  => s + t.amount, 0),
    out: txns.filter(t => t.type === "out").reduce((s, t) => s + t.amount, 0),
  });

  const categories = activeTab === "out" ? CATEGORIES_OUT : CATEGORIES_IN;

  return (
    <div className="cf-root">

      {/* ── PAGE HEADER ── */}
      <div className="cf-header">
        <div className="cf-header-left">
          <span className="cf-breadcrumb">Dashboard &rsaquo; Cashflow</span>
          <h1 className="cf-title">Money Flow</h1>
          <p className="cf-subtitle">Every naira in and out of your business</p>
        </div>

        <div className="cf-header-actions">
          <button
            className="cf-btn cf-btn--out"
            onClick={() => navigate("/add-expense")}
          >
            <span className="cf-btn-arrow">↑</span>
            Add Expense
          </button>
          <button
            className="cf-btn cf-btn--in"
            onClick={() => navigate("/add-sale")}
          >
            <span className="cf-btn-arrow">↓</span>
            Record Sale
          </button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="cf-summary-row">

        <div className="cf-card cf-card--in">
          <div className="cf-card-top">
            <div className="cf-card-label">
              <span className="cf-dot cf-dot--in" />
              Money In
            </div>
            <div className="cf-card-ico cf-card-ico--in">↙</div>
          </div>
          <div className="cf-card-amount">{fmt(totalsIn)}</div>
          <div className="cf-card-sub">
            {MOCK_TRANSACTIONS.filter(t => t.type === "in").length} transactions this month
          </div>
          <div className="cf-progress-track">
            <div
              className="cf-progress-fill cf-progress-fill--in"
              style={{ width: `${Math.min((totalsIn / (totalsIn + totalsOut)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="cf-card cf-card--balance">
          <div className="cf-card-top">
            <div className="cf-card-label">Net Balance</div>
          </div>
          <div className={`cf-card-amount ${balance >= 0 ? "cf-pos" : "cf-neg"}`}>
            {balance >= 0 ? "+" : ""}{fmt(balance)}
          </div>
          <div className="cf-card-sub">
            {balance >= 0 ? "Profitable this month" : "Running a deficit"}
          </div>
          <div className="cf-ring-wrap">
            <svg viewBox="0 0 80 80" className="cf-ring-svg">
              <circle cx="40" cy="40" r="30" className="cf-ring-track" />
              <circle
                cx="40" cy="40" r="30"
                className="cf-ring-fill"
                strokeDasharray={`${(totalsIn / (totalsIn + totalsOut)) * 188} 188`}
                strokeDashoffset="47"
              />
            </svg>
            <span className="cf-ring-label">
              {Math.round((totalsIn / (totalsIn + totalsOut)) * 100)}%
            </span>
          </div>
        </div>

        <div className="cf-card cf-card--out">
          <div className="cf-card-top">
            <div className="cf-card-label">
              <span className="cf-dot cf-dot--out" />
              Money Out
            </div>
            <div className="cf-card-ico cf-card-ico--out">↗</div>
          </div>
          <div className="cf-card-amount">{fmt(totalsOut)}</div>
          <div className="cf-card-sub">
            {MOCK_TRANSACTIONS.filter(t => t.type === "out").length} transactions this month
          </div>
          <div className="cf-progress-track">
            <div
              className="cf-progress-fill cf-progress-fill--out"
              style={{ width: `${Math.min((totalsOut / (totalsIn + totalsOut)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── FILTERS BAR ── */}
      <div className="cf-filters-bar">
        <div className="cf-tabs">
          {[["all", "All"], ["in", "Money In"], ["out", "Money Out"]].map(([val, lbl]) => (
            <button
              key={val}
              className={[
                "cf-tab",
                activeTab === val ? "cf-tab--active" : "",
                activeTab === val && val === "in"  ? "cf-tab--active-in"  : "",
                activeTab === val && val === "out" ? "cf-tab--active-out" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => { setActiveTab(val); setFilterCategory("All"); }}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className="cf-controls">
          <div className="cf-search-wrap">
            <span className="cf-search-ico">⌕</span>
            <input
              className="cf-search"
              placeholder="Search transactions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="cf-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="cf-select" value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
            {METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div className="cf-list">
        {grouped.length === 0 ? (
          <div className="cf-empty">
            <span className="cf-empty-ico">📭</span>
            <p>No transactions match your filters.</p>
          </div>
        ) : grouped.map(([date, txns]) => {
          const { inn, out } = dayTotal(txns);
          return (
            <div key={date} className="cf-day-group">

              <div className="cf-day-head">
                <span className="cf-day-label">{formatDate(date)}</span>
                <div className="cf-day-sums">
                  {inn > 0 && <span className="cf-day-sum cf-pos">+{fmt(inn)}</span>}
                  {out > 0 && <span className="cf-day-sum cf-neg">−{fmt(out)}</span>}
                </div>
              </div>

              <div className="cf-txn-list">
                {txns.map(t => (
                  <div key={t.id} className={`cf-txn ${t.type === "in" ? "cf-txn--in" : "cf-txn--out"}`}>
                    <div className="cf-txn-bar" />
                    <div className={`cf-txn-ico ${t.type === "in" ? "cf-txn-ico--in" : "cf-txn-ico--out"}`}>
                      {t.type === "in" ? "↙" : "↗"}
                    </div>
                    <div className="cf-txn-info">
                      <div className="cf-txn-name">{t.label}</div>
                      <div className="cf-txn-meta">
                        <span
                          className="cf-txn-tag"
                          style={{
                            background: (CATEGORY_COLORS[t.category] || "#555") + "22",
                            color:       CATEGORY_COLORS[t.category] || "#555",
                          }}
                        >
                          {t.category}
                        </span>
                        <span className="cf-txn-method">{METHOD_ICONS[t.method]} {t.method}</span>
                        {t.customer && <span className="cf-txn-customer">· {t.customer}</span>}
                      </div>
                    </div>
                    <div className={`cf-txn-amt ${t.type === "in" ? "cf-pos" : "cf-neg"}`}>
                      {t.type === "in" ? "+" : "−"}{fmt(t.amount)}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}