import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet, Calculator as CalcIcon, QrCode, ArrowUpRight, ArrowDownLeft,
  Plus, Minus, X, Delete, CheckCircle, AlertCircle, Clock,
  Phone, Copy, ChevronRight, TrendingUp, Users, Banknote,
  CreditCard, Building2, Send, Receipt, ShoppingBag,
  RefreshCw, Info, Star, Zap, Calendar, Filter, Search,
  ArrowRight, Eye, EyeOff, Link2, FileText, PieChart,
  BarChart2, BookOpen,
} from "lucide-react";
import "./payments.css";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const fmt     = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */

// Wallet summary
const WALLET = {
  totalReceived:  261000,
  totalPaid:      135000,
  outstandingDebt: 44000,  // customers owe me
  iOwe:            0,       // i owe suppliers
  thisMonth:      261000,
  lastMonth:      229000,
};

// Payment log
const PAYMENT_LOG = [
  { id:"PY-001", date:"2025-07-18T09:22:00", type:"in",  customer:"Tolu Adeyemi",    amount:45000, method:"Transfer", ref:"NXP8843712", note:"Bulk tomato order", linked:"sale",     status:"confirmed" },
  { id:"PY-002", date:"2025-07-18T11:00:00", type:"out", customer:"Alaba Market",     amount:11000, method:"Cash",     ref:"",           note:"Restock – tomato & pepper", linked:"expense",  status:"confirmed" },
  { id:"PY-003", date:"2025-07-17T14:05:00", type:"in",  customer:"Mama Blessing",   amount:12000, method:"POS",      ref:"POS44221",   note:"Pepper mix", linked:"sale",     status:"confirmed" },
  { id:"PY-004", date:"2025-07-17T16:30:00", type:"out", customer:"LAWMA",           amount:3000,  method:"Cash",     ref:"",           note:"Waste disposal levy", linked:"expense",  status:"confirmed" },
  { id:"PY-005", date:"2025-07-16T10:10:00", type:"in",  customer:"Walk-in",          amount:6500,  method:"Cash",     ref:"",           note:"Tomato walk-in", linked:"sale",     status:"confirmed" },
  { id:"PY-006", date:"2025-07-15T08:45:00", type:"in",  customer:"Iya Risi",         amount:22000, method:"Transfer", ref:"NXP9912001", note:"Wholesale – monthly", linked:"sale",     status:"confirmed" },
  { id:"PY-007", date:"2025-07-15T09:00:00", type:"out", customer:"Landlord",         amount:15000, method:"Transfer", ref:"TRF556621",  note:"Shop rent July", linked:"expense",  status:"confirmed" },
  { id:"PY-008", date:"2025-07-14T16:10:00", type:"in",  customer:"Chidinma O.",      amount:9800,  method:"POS",      ref:"POS22119",   note:"Mixed veg", linked:"sale",     status:"confirmed" },
  { id:"PY-009", date:"2025-07-13T10:00:00", type:"in",  customer:"Alhaji Musa",      amount:50000, method:"Transfer", ref:"NXP7700234", note:"Wholesale", linked:"sale",     status:"confirmed" },
  { id:"PY-010", date:"2025-07-12T13:00:00", type:"in",  customer:"Funke Adesanya",   amount:4200,  method:"Cash",     ref:"",           note:"Tomato walk-in", linked:"sale",     status:"confirmed" },
  { id:"PY-011", date:"2025-07-11T09:30:00", type:"in",  customer:"Iya Risi",         amount:22000, method:"Transfer", ref:"NXP7700111", note:"Wholesale – July 1st", linked:"sale",     status:"confirmed" },
  { id:"PY-012", date:"2025-07-10T14:00:00", type:"out", customer:"Dele Transport",   amount:8500,  method:"Cash",     ref:"",           note:"Delivery to Ojota", linked:"expense",  status:"confirmed" },
];

// Debts — customers who owe me
const DEBTS = [
  { id:"DB-001", customer:"Iya Risi",     phone:"07012345678", amount:22000, dueDate:"2025-07-25", daysPast:0,  sale:"Wholesale July 15", status:"pending" },
  { id:"DB-002", customer:"Tunde Bakare", phone:"08112345670", amount:8500,  dueDate:"2025-07-10", daysPast:8,  sale:"Mixed veg bulk",     status:"overdue" },
  { id:"DB-003", customer:"Sade Oguns",   phone:"09011223344", amount:13500, dueDate:"2025-07-05", daysPast:13, sale:"Pepper & onion",     status:"overdue" },
];

// Quick transfer banks for Nigerian market
const NIGERIAN_BANKS = [
  "Access Bank","Fidelity Bank","First Bank","GTBank","Keystone Bank",
  "Kuda Bank","Moniepoint","OPay","PalmPay","Polaris Bank","Stanbic IBTC",
  "Sterling Bank","UBA","Union Bank","Wema Bank","Zenith Bank",
];

const METHOD_META = {
  Transfer: { color: "#1c5b56",  bg: "rgba(28,91,86,0.1)"  },
  POS:      { color: "#7a3ea0",  bg: "rgba(122,62,160,0.1)" },
  Cash:     { color: "#c07830",  bg: "rgba(192,120,48,0.1)" },
  Credit:   { color: "#b04a2f",  bg: "rgba(176,74,47,0.1)"  },
};

/* ─────────────────────────────────────────────────────────────
   CALCULATOR COMPONENT
───────────────────────────────────────────────────────────── */
function CalcModal({ onClose, onUseAmount }) {
  const [display, setDisplay] = useState("0");
  const [expr,    setExpr]    = useState("");
  const [fresh,   setFresh]   = useState(true);

  const press = useCallback((val) => {
    if (val === "C") { setDisplay("0"); setExpr(""); setFresh(true); return; }
    if (val === "⌫") {
      setDisplay(p => p.length > 1 ? p.slice(0, -1) : "0");
      return;
    }
    if (val === "=") {
      try {
        const result = Function(`"use strict"; return (${expr + display})`)();
        const rounded = Math.round(result * 100) / 100;
        setDisplay(String(rounded));
        setExpr("");
        setFresh(true);
      } catch { setDisplay("Err"); }
      return;
    }
    if (["+", "-", "×", "÷", "%"].includes(val)) {
      const op = val === "×" ? "*" : val === "÷" ? "/" : val;
      setExpr(e => e + display + op);
      setFresh(true);
      return;
    }
    if (val === ".") {
      if (fresh) { setDisplay("0."); setFresh(false); return; }
      if (!display.includes(".")) setDisplay(p => p + ".");
      return;
    }
    // digit
    if (fresh) { setDisplay(val); setFresh(false); }
    else setDisplay(p => p === "0" ? val : p + val);
  }, [display, expr, fresh]);

  const BTNS = [
    ["C", "%", "⌫", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    [".", "0", "00", "="],
  ];

  const numericDisplay = parseFloat(display.replace(/,/g, ""));

  return (
    <div className="pw-calc-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pw-calc">
        <div className="pw-calc-header">
          <div className="pw-calc-title"><CalcIcon size={15} /> Payment Calculator</div>
          <button className="pw-calc-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="pw-calc-screen">
          <div className="pw-calc-expr">{expr || " "}</div>
          <div className="pw-calc-display">
            {isNaN(numericDisplay) ? display : fmt(numericDisplay)}
          </div>
        </div>

        <div className="pw-calc-grid">
          {BTNS.map((row, ri) =>
            row.map((btn) => (
              <button
                key={btn}
                className={[
                  "pw-calc-btn",
                  btn === "=" ? "pw-calc-btn--eq" : "",
                  ["÷","×","-","+"].includes(btn) ? "pw-calc-btn--op" : "",
                  ["C","⌫","%"].includes(btn) ? "pw-calc-btn--fn" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => press(btn)}
              >
                {btn}
              </button>
            ))
          )}
        </div>

        {!isNaN(numericDisplay) && numericDisplay > 0 && (
          <div className="pw-calc-actions">
            <div className="pw-calc-hint">Use this amount in a transaction:</div>
            <div className="pw-calc-cta-row">
              <button className="pw-calc-cta pw-calc-cta--sale"
                onClick={() => { onUseAmount("sale", numericDisplay); onClose(); }}>
                <ArrowDownLeft size={14} /> Log as Sale
              </button>
              <button className="pw-calc-cta pw-calc-cta--exp"
                onClick={() => { onUseAmount("expense", numericDisplay); onClose(); }}>
                <ArrowUpRight size={14} /> Log as Expense
              </button>
              <button className="pw-calc-cta pw-calc-cta--debt"
                onClick={() => { onUseAmount("debt", numericDisplay); onClose(); }}>
                <BookOpen size={14} /> Log as Debt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   QR CODE DISPLAY (SVG-based, no external lib)
───────────────────────────────────────────────────────────── */
function QRDisplay({ onClose, businessName, phone }) {
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const payLink = `https://hustlewise.app/pay/${phone}${amount ? `?amount=${amount}` : ""}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(payLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple deterministic QR-like pattern from phone string
  const cells = 21;
  const seed   = phone.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid   = Array.from({ length: cells * cells }, (_, i) => {
    const row = Math.floor(i / cells), col = i % cells;
    // finder patterns
    if ((row < 7 && col < 7) || (row < 7 && col > cells - 8) || (row > cells - 8 && col < 7)) return true;
    return ((seed * (i + 1) * 31) % 97) > 50;
  });

  return (
    <div className="pw-qr-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pw-qr-modal">
        <div className="pw-qr-header">
          <div className="pw-qr-title"><QrCode size={16} /> Payment QR Code</div>
          <button className="pw-calc-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="pw-qr-body">
          <div className="pw-qr-business">{businessName}</div>
          <div className="pw-qr-sub">{phone} · HustleWise Pay</div>

          {/* Optional amount */}
          <div className="pw-qr-amount-wrap">
            <div className="pw-qr-amount-label">Set specific amount (optional)</div>
            <div className="pw-qr-amount-input-wrap">
              <span className="pw-qr-naira">₦</span>
              <input
                className="pw-qr-amount-input"
                type="number"
                placeholder="Leave blank for any amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* QR art */}
          <div className="pw-qr-frame">
            <svg width={180} height={180} viewBox={`0 0 ${cells} ${cells}`} shapeRendering="crispEdges">
              <rect width={cells} height={cells} fill="white" />
              {grid.map((on, i) => on ? (
                <rect key={i} x={i % cells} y={Math.floor(i / cells)} width={1} height={1} fill="#0e1b1a" />
              ) : null)}
            </svg>
            <div className="pw-qr-logo-overlay">HW</div>
          </div>

          {amount && <div className="pw-qr-amount-badge">{fmt(Number(amount))}</div>}

          <div className="pw-qr-note">
            <Info size={12} /> Customers scan this to get your payment details.
            HustleWise is not a bank — this helps customers pay you via their banking app.
          </div>

          <div className="pw-qr-link-row">
            <div className="pw-qr-link">{payLink}</div>
            <button className="pw-qr-copy" onClick={handleCopy}>
              {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="pw-qr-actions">
            <button className="pw-qr-btn pw-qr-btn--wa"
              onClick={() => window.open(`https://wa.me/?text=Pay me via HustleWise: ${payLink}`, "_blank")}>
              <Send size={14} /> Share on WhatsApp
            </button>
            <button className="pw-qr-btn pw-qr-btn--dl">
              <FileText size={14} /> Save as Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOG PAYMENT MODAL
───────────────────────────────────────────────────────────── */
const BLANK_LOG = {
  type: "in", amount: "", customer: "", phone: "",
  method: "Transfer", bank: "", ref: "", note: "",
  isDebt: false, dueDate: "",
};

function LogPaymentModal({ onClose, onSave, prefillAmount, prefillType }) {
  const [form, setForm] = useState({
    ...BLANK_LOG,
    ...(prefillAmount ? { amount: String(prefillAmount) } : {}),
    ...(prefillType   ? { type: prefillType } : {}),
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.customer.trim()) e.customer = "Customer / payer name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const entry = {
      id: `PY-${String(Date.now()).slice(-5)}`,
      date: new Date().toISOString(),
      type: form.type,
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      amount: Number(form.amount),
      method: form.method,
      ref: form.ref.trim(),
      note: form.note.trim(),
      linked: form.type === "in" ? "sale" : "expense",
      status: "confirmed",
      isDebt: form.isDebt,
      dueDate: form.dueDate,
    };
    setSaved(true);
    setTimeout(() => { onSave(entry); onClose(); }, 900);
  };

  return (
    <div className="pw-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pw-modal">
        <div className="pw-modal-header">
          <div className="pw-modal-header-left">
            <div className={`pw-modal-ico ${form.type === "in" ? "pw-modal-ico--in" : "pw-modal-ico--out"}`}>
              {form.type === "in" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </div>
            <div>
              <div className="pw-modal-title">Log a Payment</div>
              <div className="pw-modal-sub">Record money received or paid out</div>
            </div>
          </div>
          <button className="pw-calc-close" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="pw-modal-body">
          {/* Type toggle */}
          <div className="pw-lp-type-row">
            <button
              className={`pw-type-btn ${form.type === "in" ? "pw-type-btn--in" : ""}`}
              onClick={() => set("type", "in")}
            >
              <ArrowDownLeft size={15} /> Money In (Received)
            </button>
            <button
              className={`pw-type-btn ${form.type === "out" ? "pw-type-btn--out" : ""}`}
              onClick={() => set("type", "out")}
            >
              <ArrowUpRight size={15} /> Money Out (Paid)
            </button>
          </div>

          {/* Amount — big */}
          <div className="pw-lp-amount-field">
            <label className="pw-lp-label">Amount (₦) <span className="pw-lp-req">*</span></label>
            <div className="pw-lp-amount-wrap">
              <span className="pw-lp-naira">₦</span>
              <input
                className={`pw-lp-amount-input ${errors.amount ? "pw-lp-input--err" : ""}`}
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={e => set("amount", e.target.value)}
                inputMode="numeric"
              />
            </div>
            {errors.amount && <div className="pw-lp-error"><AlertCircle size={11} />{errors.amount}</div>}
          </div>

          <div className="pw-lp-grid">
            <div className="pw-lp-field">
              <label className="pw-lp-label">{form.type === "in" ? "Customer / Payer" : "Who You Paid"} <span className="pw-lp-req">*</span></label>
              <input className={`pw-lp-input ${errors.customer ? "pw-lp-input--err" : ""}`}
                placeholder="e.g. Mama Blessing"
                value={form.customer} onChange={e => set("customer", e.target.value)} />
              {errors.customer && <div className="pw-lp-error"><AlertCircle size={11} />{errors.customer}</div>}
            </div>

            <div className="pw-lp-field">
              <label className="pw-lp-label">Phone Number</label>
              <input className="pw-lp-input" placeholder="08031234567"
                value={form.phone} onChange={e => set("phone", e.target.value)}
                inputMode="numeric" maxLength={11} />
            </div>

            <div className="pw-lp-field">
              <label className="pw-lp-label">Payment Method</label>
              <select className="pw-lp-select" value={form.method} onChange={e => set("method", e.target.value)}>
                <option>Cash</option>
                <option>Transfer</option>
                <option>POS</option>
                <option>Credit (Owe)</option>
              </select>
            </div>

            {form.method === "Transfer" && (
              <div className="pw-lp-field">
                <label className="pw-lp-label">Bank</label>
                <select className="pw-lp-select" value={form.bank} onChange={e => set("bank", e.target.value)}>
                  <option value="">Select bank</option>
                  {NIGERIAN_BANKS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}

            {(form.method === "Transfer" || form.method === "POS") && (
              <div className="pw-lp-field">
                <label className="pw-lp-label">Reference / Transaction ID</label>
                <input className="pw-lp-input" placeholder="e.g. NXP8843712"
                  value={form.ref} onChange={e => set("ref", e.target.value)} />
              </div>
            )}

            <div className="pw-lp-field pw-lp-field--full">
              <label className="pw-lp-label">Note / Description</label>
              <input className="pw-lp-input" placeholder="e.g. Bulk tomato order — July"
                value={form.note} onChange={e => set("note", e.target.value)} />
            </div>

            {/* Debt toggle */}
            {form.type === "in" && form.method !== "Credit (Owe)" && (
              <div className="pw-lp-field pw-lp-field--full">
                <label className="pw-lp-checkbox-row">
                  <input type="checkbox" className="pw-lp-checkbox"
                    checked={form.isDebt} onChange={e => set("isDebt", e.target.checked)} />
                  <span className="pw-lp-checkbox-label">
                    This customer still owes me — log as partial payment / debt
                  </span>
                </label>
              </div>
            )}

            {form.method === "Credit (Owe)" && (
              <div className="pw-lp-field pw-lp-field--full">
                <div className="pw-lp-debt-banner">
                  <AlertCircle size={13} />
                  This will be logged as a debt. You will be reminded to collect payment.
                </div>
                <label className="pw-lp-label" style={{ marginTop: 10 }}>Payment Due Date</label>
                <input className="pw-lp-input" type="date"
                  value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div className="pw-modal-footer">
          <button className="pw-modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`pw-modal-save ${saved ? "pw-modal-save--done" : ""} ${form.type === "in" ? "pw-modal-save--in" : "pw-modal-save--out"}`}
            onClick={handleSave} disabled={saved}
          >
            {saved ? <><CheckCircle size={14} /> Saved!</> : `Save ${form.type === "in" ? "Receipt" : "Payment"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DEBT ROW
───────────────────────────────────────────────────────────── */
function DebtRow({ debt, onSendReminder, onMarkPaid }) {
  const statusMeta = {
    pending: { color: "#c07830", bg: "rgba(192,120,48,0.1)", label: "Pending" },
    overdue: { color: "#b04a2f", bg: "rgba(176,74,47,0.1)",  label: "Overdue" },
    paid:    { color: "#1c5b56", bg: "rgba(28,91,86,0.1)",   label: "Paid"    },
  };
  const s = statusMeta[debt.status] || statusMeta.pending;

  const waText = encodeURIComponent(
    `Dear ${debt.customer},\n\nThis is a friendly reminder from our records that you have an outstanding balance of *${fmt(debt.amount)}* for "${debt.sale}".\n\nKindly make payment at your earliest convenience.\n\nThank you!\nPowered by HustleWise`
  );

  return (
    <div className={`pw-debt-row ${debt.status === "overdue" ? "pw-debt-row--overdue" : ""}`}>
      <div className="pw-debt-bar" style={{ background: s.color }} />
      <div className="pw-debt-info">
        <div className="pw-debt-name-row">
          <span className="pw-debt-name">{debt.customer}</span>
          <span className="pw-debt-status" style={{ background: s.bg, color: s.color }}>{s.label}</span>
          {debt.daysPast > 0 && (
            <span className="pw-debt-days">{debt.daysPast}d overdue</span>
          )}
        </div>
        <div className="pw-debt-meta">
          <Phone size={11} /> {debt.phone}
          <span>· {debt.sale}</span>
          <Calendar size={11} /> Due: {fmtDate(debt.dueDate)}
        </div>
      </div>
      <div className="pw-debt-amount">{fmt(debt.amount)}</div>
      <div className="pw-debt-actions">
        <a
          className="pw-debt-btn pw-debt-btn--wa"
          href={`https://wa.me/234${debt.phone.slice(1)}?text=${waText}`}
          target="_blank" rel="noreferrer"
          title="Send WhatsApp reminder"
        >
          <Send size={13} /> Remind
        </a>
        <button className="pw-debt-btn pw-debt-btn--paid" onClick={() => onMarkPaid(debt.id)}>
          <CheckCircle size={13} /> Mark Paid
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function Payments() {
  const navigate = useNavigate();

  const [showCalc,    setShowCalc]    = useState(false);
  const [showQR,      setShowQR]      = useState(false);
  const [showLog,     setShowLog]     = useState(false);
  const [prefillAmt,  setPrefillAmt]  = useState(null);
  const [prefillType, setPrefillType] = useState(null);
  const [activeTab,   setActiveTab]   = useState("log");   // log | debts
  const [filter,      setFilter]      = useState("all");   // all | in | out
  const [search,      setSearch]      = useState("");
  const [hideBalance, setHideBalance] = useState(false);
  const [payments,    setPayments]    = useState(PAYMENT_LOG);
  const [debts,       setDebts]       = useState(DEBTS);

  const totalIn    = payments.filter(p => p.type === "in").reduce((s, p) => s + p.amount, 0);
  const totalOut   = payments.filter(p => p.type === "out").reduce((s, p) => s + p.amount, 0);
  const netBalance = totalIn - totalOut;
  const totalDebt  = debts.filter(d => d.status !== "paid").reduce((s, d) => s + d.amount, 0);

  const filteredPayments = useMemo(() => payments.filter(p => {
    if (filter === "in"  && p.type !== "in")  return false;
    if (filter === "out" && p.type !== "out") return false;
    const q = search.toLowerCase();
    if (q && !p.customer.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q) && !p.note.toLowerCase().includes(q)) return false;
    return true;
  }), [payments, filter, search]);

  const handleCalcUse = (type, amount) => {
    setPrefillAmt(amount);
    setPrefillType(type === "sale" ? "in" : "out");
    setShowLog(true);
  };

  const handleSavePayment = (entry) => {
    setPayments(prev => [entry, ...prev]);
    if (entry.method === "Credit (Owe)" || entry.isDebt) {
      setDebts(prev => [{
        id: `DB-${String(Date.now()).slice(-4)}`,
        customer: entry.customer,
        phone: entry.phone,
        amount: entry.amount,
        dueDate: entry.dueDate || "",
        daysPast: 0,
        sale: entry.note || "Payment",
        status: "pending",
      }, ...prev]);
    }
  };

  const markDebtPaid = (id) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, status: "paid" } : d));
  };

  const overdueCount = debts.filter(d => d.status === "overdue").length;

  return (
    <div className="pw-root">

      {/* ── MODALS ── */}
      {showCalc && <CalcModal onClose={() => setShowCalc(false)} onUseAmount={handleCalcUse} />}
      {showQR   && <QRDisplay  onClose={() => setShowQR(false)} businessName="My HustleWise Business" phone="08031234567" />}
      {showLog  && (
        <LogPaymentModal
          onClose={() => { setShowLog(false); setPrefillAmt(null); setPrefillType(null); }}
          onSave={handleSavePayment}
          prefillAmount={prefillAmt}
          prefillType={prefillType}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="pw-header">
        <div className="pw-header-left">
          <span className="pw-breadcrumb">Dashboard › Payments</span>
          <h1 className="pw-title">Payments &amp; Wallet</h1>
          <p className="pw-subtitle">Log payments, track debts, generate QR codes</p>
        </div>
        <div className="pw-header-actions">
          <button className="pw-hdr-btn pw-hdr-btn--ghost" onClick={() => setShowCalc(true)}>
            <CalcIcon size={15} /> Calculator
          </button>
          <button className="pw-hdr-btn pw-hdr-btn--ghost" onClick={() => setShowQR(true)}>
            <QrCode size={15} /> My QR Code
          </button>
          <button className="pw-hdr-btn pw-hdr-btn--primary" onClick={() => setShowLog(true)}>
            <Plus size={15} /> Log Payment
          </button>
        </div>
      </div>

      {/* ── WALLET CARD ── */}
      <div className="pw-wallet-card">
        <div className="pw-wallet-left">
          <div className="pw-wallet-eyebrow"><Wallet size={13} /> HustleWise Money Tracker</div>
          <div className="pw-wallet-balance-label">
            Net Balance (This Month)
            <button className="pw-wallet-eye" onClick={() => setHideBalance(h => !h)}>
              {hideBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
          <div className="pw-wallet-balance">
            {hideBalance ? "₦ ••••••" : fmt(netBalance)}
          </div>
          <div className="pw-wallet-note">
            <Info size={12} /> HustleWise is not a bank. This tracks your business money in/out.
          </div>
        </div>

        <div className="pw-wallet-stats">
          <div className="pw-ws">
            <div className="pw-ws-icon pw-ws-icon--in"><ArrowDownLeft size={16} /></div>
            <div className="pw-ws-val">{hideBalance ? "••••" : fmt(totalIn)}</div>
            <div className="pw-ws-label">Money In</div>
          </div>
          <div className="pw-ws-divider" />
          <div className="pw-ws">
            <div className="pw-ws-icon pw-ws-icon--out"><ArrowUpRight size={16} /></div>
            <div className="pw-ws-val">{hideBalance ? "••••" : fmt(totalOut)}</div>
            <div className="pw-ws-label">Money Out</div>
          </div>
          <div className="pw-ws-divider" />
          <div className="pw-ws">
            <div className="pw-ws-icon pw-ws-icon--debt"><BookOpen size={16} /></div>
            <div className="pw-ws-val pw-ws-val--debt">{hideBalance ? "••••" : fmt(totalDebt)}</div>
            <div className="pw-ws-label">Owed to You</div>
          </div>
        </div>

        <div className="pw-wallet-actions">
          <button className="pw-wa-btn" onClick={() => { setPrefillType("in"); setShowLog(true); }}>
            <ArrowDownLeft size={14} /> Record Receipt
          </button>
          <button className="pw-wa-btn" onClick={() => { setPrefillType("out"); setShowLog(true); }}>
            <ArrowUpRight size={14} /> Log Payment
          </button>
          <button className="pw-wa-btn" onClick={() => setShowQR(true)}>
            <QrCode size={14} /> QR Code
          </button>
          <button className="pw-wa-btn" onClick={() => setShowCalc(true)}>
            <CalcIcon size={14} /> Calculator
          </button>
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="pw-quicklinks">
        <div className="pw-ql-label"><Link2 size={12} /> Quick links to money pages</div>
        <div className="pw-ql-row">
          {[
            { label: "Add Sale",     icon: ArrowDownLeft, path: "/add-sale",     color: "#1c5b56" },
            { label: "Add Expense",  icon: ArrowUpRight,  path: "/add-expense",  color: "#b04a2f" },
            { label: "Cashflow",     icon: BarChart2,     path: "/cashflow",     color: "#2d5fa0" },
            { label: "Customers",    icon: Users,         path: "/customers",    color: "#7a3ea0" },
            { label: "Send Receipt", icon: Receipt,       path: "/send-receipt", color: "#c07830" },
            { label: "Reports",      icon: PieChart,      path: "/reports",      color: "#3a7a6e" },
          ].map(({ label, icon: Icon, path, color }) => (
            <button key={label} className="pw-ql-btn" onClick={() => navigate(path)}
              style={{ "--ql-color": color }}>
              <div className="pw-ql-icon" style={{ background: color + "18", color }}>
                <Icon size={16} />
              </div>
              <span>{label}</span>
              <ChevronRight size={12} className="pw-ql-chevron" />
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="pw-tabs">
        <button className={`pw-tab ${activeTab === "log" ? "pw-tab--active" : ""}`}
          onClick={() => setActiveTab("log")}>
          <FileText size={14} /> Payment Log
          <span className="pw-tab-count">{payments.length}</span>
        </button>
        <button className={`pw-tab ${activeTab === "debts" ? "pw-tab--active" : ""}`}
          onClick={() => setActiveTab("debts")}>
          <BookOpen size={14} /> Debt Tracker
          {overdueCount > 0 && <span className="pw-tab-badge">{overdueCount} overdue</span>}
        </button>
      </div>

      {/* ══ PAYMENT LOG TAB ══ */}
      {activeTab === "log" && (
        <div className="pw-log-panel">
          <div className="pw-log-toolbar">
            <div className="pw-search-wrap">
              <Search size={14} className="pw-search-ico" />
              <input className="pw-search" placeholder="Search customer, note or ID…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="pw-filter-tabs">
              {[["all","All"],["in","Money In"],["out","Money Out"]].map(([v,l]) => (
                <button key={v}
                  className={`pw-filter-btn ${filter === v ? "pw-filter-btn--active" : ""} ${filter === v && v === "in" ? "pw-filter-btn--in" : ""} ${filter === v && v === "out" ? "pw-filter-btn--out" : ""}`}
                  onClick={() => setFilter(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="pw-log-list">
            {filteredPayments.length === 0 ? (
              <div className="pw-empty">
                <FileText size={36} strokeWidth={1.2} />
                <p>No payments found.</p>
                <button className="pw-empty-cta" onClick={() => setShowLog(true)}>
                  <Plus size={13} /> Log your first payment
                </button>
              </div>
            ) : filteredPayments.map(p => {
              const mm = METHOD_META[p.method] || Method_META.Cash;
              const isIn = p.type === "in";
              return (
                <div key={p.id} className={`pw-log-row ${isIn ? "pw-log-row--in" : "pw-log-row--out"}`}>
                  <div className="pw-log-bar" style={{ background: isIn ? "#1c5b56" : "#b04a2f" }} />
                  <div className={`pw-log-ico ${isIn ? "pw-log-ico--in" : "pw-log-ico--out"}`}>
                    {isIn ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div className="pw-log-info">
                    <div className="pw-log-name-row">
                      <span className="pw-log-customer">{p.customer}</span>
                      <span className="pw-log-id">{p.id}</span>
                      {p.ref && <span className="pw-log-ref">Ref: {p.ref}</span>}
                    </div>
                    <div className="pw-log-meta">
                      <span><Calendar size={10} /> {fmtDate(p.date)}</span>
                      <span><Clock size={10} /> {fmtTime(p.date)}</span>
                      <span className="pw-log-method"
                        style={{ color: (METHOD_META[p.method] || {}).color, background: (METHOD_META[p.method] || {}).bg }}>
                        {p.method}
                      </span>
                      {p.note && <span className="pw-log-note">{p.note}</span>}
                    </div>
                  </div>
                  <div className={`pw-log-amount ${isIn ? "pw-log-amount--in" : "pw-log-amount--out"}`}>
                    {isIn ? "+" : "−"}{fmt(p.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pw-log-footer">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        </div>
      )}

      {/* ══ DEBT TRACKER TAB ══ */}
      {activeTab === "debts" && (
        <div className="pw-debts-panel">
          {/* Summary */}
          <div className="pw-debt-summary">
            <div className="pw-ds">
              <div className="pw-ds-val pw-ds-val--total">{fmt(totalDebt)}</div>
              <div className="pw-ds-label">Total Owed to You</div>
            </div>
            <div className="pw-ds-divider" />
            <div className="pw-ds">
              <div className="pw-ds-val">{debts.filter(d => d.status === "pending").length}</div>
              <div className="pw-ds-label">Pending</div>
            </div>
            <div className="pw-ds-divider" />
            <div className="pw-ds">
              <div className="pw-ds-val pw-ds-val--red">{overdueCount}</div>
              <div className="pw-ds-label">Overdue</div>
            </div>
            <div className="pw-ds-divider" />
            <div className="pw-ds">
              <div className="pw-ds-val pw-ds-val--green">{debts.filter(d => d.status === "paid").length}</div>
              <div className="pw-ds-label">Paid</div>
            </div>
          </div>

          {overdueCount > 0 && (
            <div className="pw-debt-alert">
              <AlertCircle size={14} />
              <span>You have <strong>{overdueCount} overdue debt{overdueCount > 1 ? "s" : ""}</strong>. Send a WhatsApp reminder to collect.</span>
            </div>
          )}

          <div className="pw-debt-list">
            {debts.length === 0 ? (
              <div className="pw-empty">
                <BookOpen size={36} strokeWidth={1.2} />
                <p>No debts recorded yet. When customers owe you, they appear here.</p>
              </div>
            ) : debts.map(d => (
              <DebtRow
                key={d.id}
                debt={d}
                onSendReminder={() => {}}
                onMarkPaid={markDebtPaid}
              />
            ))}
          </div>

          <button className="pw-add-debt-btn" onClick={() => {
            setShowLog(true);
          }}>
            <Plus size={14} /> Record New Debt / Credit Sale
          </button>
        </div>
      )}
    </div>
  );
}