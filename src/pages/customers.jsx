import { useState, useMemo } from "react";
import {
  UserPlus, Search, Phone, Mail, MessageCircle, Receipt,
  ChevronRight, X, User, MapPin, Tag, Calendar, Hash,
  TrendingUp, ShoppingBag, Banknote, Pencil, CheckCircle,
  AlertCircle, Building2, Users, Star, Truck, Package,
} from "lucide-react";
import "./customers.css";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const TAG_META = {
  VIP:       { color: "#b8860b", bg: "rgba(184,134,11,0.12)" },
  Wholesale: { color: "#1c5b56", bg: "rgba(28,91,86,0.12)"  },
  Regular:   { color: "#2d5fa0", bg: "rgba(45,95,160,0.12)" },
  New:       { color: "#7a3ea0", bg: "rgba(122,62,160,0.12)"},
  Debtor:    { color: "#b04a2f", bg: "rgba(176,74,47,0.12)" },
};

const PAYMENT_METHODS = ["Cash", "Transfer", "POS", "Credit (Owe)"];
const STATES_NG = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const BUSINESS_TYPES = [
  "Retailer","Wholesaler","Market Trader","Restaurant / Buka","School",
  "Church / Mosque","Hospital / Clinic","Hotel / Guesthouse","Individual",
  "Government Office","NGO","Other",
];

const HOW_HEARD = [
  "Walk-in","Referral from customer","WhatsApp","Social media","Market","Other",
];

const AVATAR_COLORS = [
  ["#1c5b56","#ecbc94"],["#b04a2f","#fdf5ec"],["#2d5fa0","#ecbc94"],
  ["#7a3ea0","#fdf5ec"],["#b8860b","#0e1b1a"],["#3a7a6e","#ecbc94"],
];

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */
const INITIAL_CUSTOMERS = [
  {
    id: 1, name: "Tolu Adeyemi", phone: "08031234567", altPhone: "",
    email: "tolu@gmail.com", whatsapp: "08031234567", tag: "VIP",
    businessName: "Tolu Provisions", businessType: "Retailer",
    address: "14 Adeola Street, Surulere", state: "Lagos",
    creditLimit: 50000, outstandingDebt: 0, howHeard: "Referral from customer",
    notes: "Prefers early morning delivery. Pays promptly.",
    joinDate: "2025-03-12", totalSpent: 184500,
    purchases: [
      { id:"p1", date:"2025-07-18", item:"Tomato – Bulk Order",   amount:45000, method:"Transfer", paid:true  },
      { id:"p2", date:"2025-07-04", item:"Pepper & Onion Mix",    amount:18000, method:"Transfer", paid:true  },
      { id:"p3", date:"2025-06-20", item:"Tomato – Bulk Order",   amount:42000, method:"Transfer", paid:true  },
      { id:"p4", date:"2025-06-01", item:"Mixed Vegetables",      amount:11500, method:"POS",      paid:true  },
      { id:"p5", date:"2025-05-15", item:"Tomato – Bulk Order",   amount:38000, method:"Transfer", paid:true  },
      { id:"p6", date:"2025-04-10", item:"Pepper & Onion Mix",    amount:30000, method:"Cash",     paid:true  },
    ],
  },
  {
    id: 2, name: "Mama Blessing", phone: "08059876543", altPhone: "07065432190",
    email: "", whatsapp: "08059876543", tag: "Regular",
    businessName: "", businessType: "Market Trader",
    address: "Stall 22, Oyingbo Market", state: "Lagos",
    creditLimit: 0, outstandingDebt: 0, howHeard: "Walk-in",
    notes: "",
    joinDate: "2025-04-05", totalSpent: 67800,
    purchases: [
      { id:"p7",  date:"2025-07-17", item:"Pepper & Onion Mix", amount:12000, method:"POS",  paid:true  },
      { id:"p8",  date:"2025-07-01", item:"Mixed Vegetables",   amount:8500,  method:"Cash", paid:true  },
      { id:"p9",  date:"2025-06-14", item:"Tomato – Walk-in",   amount:6500,  method:"Cash", paid:true  },
      { id:"p10", date:"2025-05-28", item:"Pepper & Onion Mix", amount:14200, method:"POS",  paid:true  },
      { id:"p11", date:"2025-05-10", item:"Mixed Vegetables",   amount:9600,  method:"Cash", paid:true  },
    ],
  },
  {
    id: 3, name: "Iya Risi", phone: "07012345678", altPhone: "",
    email: "iyarisi@yahoo.com", whatsapp: "07012345678", tag: "Wholesale",
    businessName: "Risi Wholesale Depot", businessType: "Wholesaler",
    address: "Block C, Mile 12 Market", state: "Lagos",
    creditLimit: 100000, outstandingDebt: 22000, howHeard: "Market",
    notes: "Monthly standing order. Call before delivery.",
    joinDate: "2025-02-20", totalSpent: 312000,
    purchases: [
      { id:"p12", date:"2025-07-15", item:"Wholesale Order", amount:22000, method:"Transfer",      paid:false },
      { id:"p13", date:"2025-07-01", item:"Wholesale Order", amount:22000, method:"Transfer",      paid:true  },
      { id:"p14", date:"2025-06-15", item:"Wholesale Order", amount:22000, method:"Transfer",      paid:true  },
      { id:"p15", date:"2025-06-01", item:"Wholesale Order", amount:22000, method:"Transfer",      paid:true  },
      { id:"p16", date:"2025-05-15", item:"Wholesale Order", amount:22000, method:"Transfer",      paid:true  },
      { id:"p17", date:"2025-04-15", item:"Wholesale Order", amount:20000, method:"Transfer",      paid:true  },
    ],
  },
  {
    id: 4, name: "Chidinma O.", phone: "08167890123", altPhone: "",
    email: "chidinma@outlook.com", whatsapp: "08167890123", tag: "Regular",
    businessName: "", businessType: "Individual",
    address: "Festac Town, Lagos", state: "Lagos",
    creditLimit: 0, outstandingDebt: 0, howHeard: "Social media",
    notes: "",
    joinDate: "2025-05-18", totalSpent: 41300,
    purchases: [
      { id:"p18", date:"2025-07-14", item:"Mixed Vegetables",   amount:9800,  method:"POS",  paid:true },
      { id:"p19", date:"2025-06-28", item:"Tomato – Walk-in",   amount:6500,  method:"Cash", paid:true },
      { id:"p20", date:"2025-06-10", item:"Pepper & Onion Mix", amount:11000, method:"POS",  paid:true },
      { id:"p21", date:"2025-05-25", item:"Mixed Vegetables",   amount:8200,  method:"POS",  paid:true },
      { id:"p22", date:"2025-05-19", item:"Tomato – Walk-in",   amount:5800,  method:"Cash", paid:true },
    ],
  },
  {
    id: 5, name: "Alhaji Musa", phone: "08023456789", altPhone: "08098765400",
    email: "", whatsapp: "08023456789", tag: "Wholesale",
    businessName: "Musa General Goods", businessType: "Wholesaler",
    address: "Kano Road, Sharada Industrial Estate", state: "Kano",
    creditLimit: 200000, outstandingDebt: 0, howHeard: "Referral from customer",
    notes: "Sends driver. Always pays same day via transfer.",
    joinDate: "2025-01-08", totalSpent: 520000,
    purchases: [
      { id:"p23", date:"2025-07-10", item:"Wholesale Order", amount:50000, method:"Transfer", paid:true },
      { id:"p24", date:"2025-06-25", item:"Wholesale Order", amount:50000, method:"Transfer", paid:true },
      { id:"p25", date:"2025-06-10", item:"Wholesale Order", amount:45000, method:"Transfer", paid:true },
      { id:"p26", date:"2025-05-28", item:"Wholesale Order", amount:50000, method:"Transfer", paid:true },
    ],
  },
  {
    id: 6, name: "Funke Adesanya", phone: "09087654321", altPhone: "",
    email: "funke@gmail.com", whatsapp: "09087654321", tag: "New",
    businessName: "", businessType: "Individual",
    address: "Ikeja GRA", state: "Lagos",
    creditLimit: 0, outstandingDebt: 0, howHeard: "WhatsApp",
    notes: "",
    joinDate: "2025-07-01", totalSpent: 8400,
    purchases: [
      { id:"p27", date:"2025-07-12", item:"Tomato – Walk-in",  amount:4200, method:"Cash", paid:true },
      { id:"p28", date:"2025-07-03", item:"Mixed Vegetables",  amount:4200, method:"Cash", paid:true },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const fmt      = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const fmtDate  = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-NG", {
  day: "numeric", month: "short", year: "numeric",
});
const initials = (name) => name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const today    = () => new Date().toISOString().slice(0, 10);
let   nextId   = 100;

const BLANK_FORM = {
  name: "", phone: "", altPhone: "", email: "", whatsapp: "",
  businessName: "", businessType: "Individual", address: "", state: "Lagos",
  tag: "New", creditLimit: "", outstandingDebt: "0",
  howHeard: "Walk-in", notes: "",
  sameAsPhone: true, // whatsapp = phone checkbox
};

/* ─────────────────────────────────────────────────────────────
   FIELD — defined OUTSIDE modal so its identity never changes
   between renders (prevents input focus loss on keystroke)
───────────────────────────────────────────────────────────── */
function Field({ label, error, required, children }) {
  return (
    <div className="cxm-field">
      <label className="cxm-label">
        {label}{required && <span className="cxm-req">*</span>}
      </label>
      {children}
      {error && (
        <div className="cxm-error">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ADD CUSTOMER MODAL
───────────────────────────────────────────────────────────── */
function AddCustomerModal({ onClose, onSave }) {
  const [form,   setForm]   = useState(BLANK_FORM);
  const [errors, setErrors] = useState({});
  const [step,   setStep]   = useState(1); // 1 = Basic, 2 = Business, 3 = Settings
  const [saved,  setSaved]  = useState(false);

  const set = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === "phone" && next.sameAsPhone) next.whatsapp = v;
      if (k === "sameAsPhone") next.whatsapp = v ? next.phone : "";
      return next;
    });
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name  = "Full name is required";
    if (!/^0[789][01]\d{8}$/.test(form.phone))  e.phone = "Enter a valid Nigerian phone number";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (step === 1 && Object.keys(e).length) { setErrors(e); return false; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const handleSave = () => {
    if (!validate()) return;
    const customer = {
      id: nextId++,
      name:            form.name.trim(),
      phone:           form.phone.trim(),
      altPhone:        form.altPhone.trim(),
      email:           form.email.trim(),
      whatsapp:        form.whatsapp.trim() || form.phone.trim(),
      tag:             form.tag,
      businessName:    form.businessName.trim(),
      businessType:    form.businessType,
      address:         form.address.trim(),
      state:           form.state,
      creditLimit:     Number(form.creditLimit) || 0,
      outstandingDebt: Number(form.outstandingDebt) || 0,
      howHeard:        form.howHeard,
      notes:           form.notes.trim(),
      joinDate:        today(),
      totalSpent:      0,
      purchases:       [],
    };
    setSaved(true);
    setTimeout(() => { onSave(customer); onClose(); }, 1000);
  };

  const STEPS = ["Basic Info", "Business", "Settings"];

  return (
    <div className="cxm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cxm-modal">

        {/* Header */}
        <div className="cxm-header">
          <div className="cxm-header-left">
            <div className="cxm-header-icon"><UserPlus size={18} /></div>
            <div>
              <div className="cxm-header-title">Add New Customer</div>
              <div className="cxm-header-sub">Step {step} of 3 — {STEPS[step - 1]}</div>
            </div>
          </div>
          <button className="cxm-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Step indicator */}
        <div className="cxm-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`cxm-step ${step > i + 1 ? "cxm-step--done" : ""} ${step === i + 1 ? "cxm-step--active" : ""}`}>
              <div className="cxm-step-dot">
                {step > i + 1 ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
              </div>
              <div className="cxm-step-label">{s}</div>
              {i < 2 && <div className="cxm-step-line" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="cxm-body">

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div className="cxm-section-grid">
              <Field label="Full Name" required error={errors.name}>
                <div className="cxm-input-wrap">
                  <User size={15} className="cxm-input-ico" />
                  <input
                    className={`cxm-input ${errors.name ? "cxm-input--err" : ""}`}
                    placeholder="e.g. Mama Blessing"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Phone Number" required error={errors.phone}>
                <div className="cxm-input-wrap">
                  <Phone size={15} className="cxm-input-ico" />
                  <input
                    className={`cxm-input ${errors.phone ? "cxm-input--err" : ""}`}
                    placeholder="e.g. 08031234567"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    maxLength={11}
                    inputMode="numeric"
                  />
                </div>
              </Field>

              <Field label="Alternative Phone">
                <div className="cxm-input-wrap">
                  <Phone size={15} className="cxm-input-ico" />
                  <input
                    className="cxm-input"
                    placeholder="Second number (optional)"
                    value={form.altPhone}
                    onChange={e => set("altPhone", e.target.value)}
                    maxLength={11}
                    inputMode="numeric"
                  />
                </div>
              </Field>

              <Field label="Email Address" error={errors.email}>
                <div className="cxm-input-wrap">
                  <Mail size={15} className="cxm-input-ico" />
                  <input
                    className={`cxm-input ${errors.email ? "cxm-input--err" : ""}`}
                    placeholder="e.g. customer@gmail.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    type="email"
                  />
                </div>
              </Field>

              <div className="cxm-field cxm-field--full">
                <label className="cxm-label">WhatsApp Number</label>
                <label className="cxm-checkbox-row">
                  <input
                    type="checkbox"
                    className="cxm-checkbox"
                    checked={form.sameAsPhone}
                    onChange={e => set("sameAsPhone", e.target.checked)}
                  />
                  <span className="cxm-checkbox-label">Same as phone number</span>
                </label>
                {!form.sameAsPhone && (
                  <div className="cxm-input-wrap" style={{ marginTop: 8 }}>
                    <MessageCircle size={15} className="cxm-input-ico" />
                    <input
                      className="cxm-input"
                      placeholder="WhatsApp number"
                      value={form.whatsapp}
                      onChange={e => set("whatsapp", e.target.value)}
                      maxLength={11}
                      inputMode="numeric"
                    />
                  </div>
                )}
              </div>

              <div className="cxm-field cxm-field--full">
                <label className="cxm-label">Home / Delivery Address</label>
                <div className="cxm-input-wrap">
                  <MapPin size={15} className="cxm-input-ico" />
                  <input
                    className="cxm-input"
                    placeholder="Street, area, market stall number…"
                    value={form.address}
                    onChange={e => set("address", e.target.value)}
                  />
                </div>
              </div>

              <Field label="State">
                <select className="cxm-select" value={form.state} onChange={e => set("state", e.target.value)}>
                  {STATES_NG.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="How did they hear about you?">
                <select className="cxm-select" value={form.howHeard} onChange={e => set("howHeard", e.target.value)}>
                  {HOW_HEARD.map(h => <option key={h}>{h}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* ── STEP 2: Business Info ── */}
          {step === 2 && (
            <div className="cxm-section-grid">
              <div className="cxm-info-banner">
                <Hash size={14} />
                If this customer is a business or market trader, fill in their business details
                to help you track B2B sales and issue proper receipts.
              </div>

              <Field label="Business / Shop Name">
                <div className="cxm-input-wrap">
                  <Building2 size={15} className="cxm-input-ico" />
                  <input
                    className="cxm-input"
                    placeholder="e.g. Risi Wholesale Depot"
                    value={form.businessName}
                    onChange={e => set("businessName", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Business Type">
                <select className="cxm-select" value={form.businessType} onChange={e => set("businessType", e.target.value)}>
                  {BUSINESS_TYPES.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>

              <div className="cxm-field cxm-field--full">
                <label className="cxm-label">Customer Tag</label>
                <div className="cxm-tag-picker">
                  {Object.entries(TAG_META).map(([t, meta]) => (
                    <button
                      key={t}
                      type="button"
                      className={`cxm-tag-option ${form.tag === t ? "cxm-tag-option--active" : ""}`}
                      style={form.tag === t ? { background: meta.bg, color: meta.color, borderColor: meta.color + "66" } : {}}
                      onClick={() => set("tag", t)}
                    >
                      {t === "VIP"       && <Star size={12} />}
                      {t === "Wholesale" && <Truck size={12} />}
                      {t === "Regular"   && <Users size={12} />}
                      {t === "New"       && <UserPlus size={12} />}
                      {t === "Debtor"    && <AlertCircle size={12} />}
                      {t}
                    </button>
                  ))}
                </div>
                <div className="cxm-tag-hint">
                  {form.tag === "Debtor" && "Mark as Debtor if this customer owes you money."}
                  {form.tag === "Wholesale" && "Wholesale customers get bulk pricing and credit limits."}
                  {form.tag === "VIP" && "VIP customers get priority service and special offers."}
                  {form.tag === "New" && "New tag auto-updates after first purchase."}
                  {form.tag === "Regular" && "Regular walk-in or repeat customer."}
                </div>
              </div>

              <div className="cxm-field cxm-field--full">
                <label className="cxm-label">Notes / Special Instructions</label>
                <textarea
                  className="cxm-textarea"
                  placeholder="e.g. Prefers early morning delivery. Pays by transfer only. Call before sending driver…"
                  value={form.notes}
                  onChange={e => set("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Credit & Settings ── */}
          {step === 3 && (
            <div className="cxm-section-grid">
              <div className="cxm-info-banner">
                <Banknote size={14} />
                Set a credit limit if you allow this customer to buy on credit (owe). This helps
                you track how much they owe and send payment reminders.
              </div>

              <Field label="Credit Limit (₦)">
                <div className="cxm-input-wrap">
                  <Banknote size={15} className="cxm-input-ico" />
                  <input
                    className="cxm-input"
                    placeholder="0 = no credit allowed"
                    value={form.creditLimit}
                    onChange={e => set("creditLimit", e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </Field>

              <Field label="Current Outstanding Debt (₦)">
                <div className="cxm-input-wrap">
                  <AlertCircle size={15} className="cxm-input-ico" />
                  <input
                    className="cxm-input"
                    placeholder="Amount they already owe you"
                    value={form.outstandingDebt}
                    onChange={e => set("outstandingDebt", e.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </Field>

              {/* Summary preview */}
              <div className="cxm-field cxm-field--full">
                <label className="cxm-label">Customer Summary</label>
                <div className="cxm-preview">
                  <div className="cxm-preview-avatar">
                    {initials(form.name || "?")}
                  </div>
                  <div className="cxm-preview-info">
                    <div className="cxm-preview-name">{form.name || "—"}</div>
                    {form.businessName && <div className="cxm-preview-biz">{form.businessName}</div>}
                    <div className="cxm-preview-meta">
                      <span>{form.phone || "No phone"}</span>
                      {form.state && <span>· {form.state}</span>}
                    </div>
                  </div>
                  <span
                    className="cx-tag"
                    style={{
                      background: TAG_META[form.tag]?.bg,
                      color:      TAG_META[form.tag]?.color,
                    }}
                  >
                    {form.tag}
                  </span>
                </div>

                {Number(form.outstandingDebt) > 0 && (
                  <div className="cxm-debt-warning">
                    <AlertCircle size={14} />
                    This customer will be added with an outstanding debt of{" "}
                    <strong>{fmt(Number(form.outstandingDebt))}</strong>. A debt record will be created.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cxm-footer">
          {step > 1 && (
            <button className="cxm-btn-back" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}
          <div className="cxm-footer-right">
            <button className="cxm-btn-cancel" onClick={onClose}>Cancel</button>
            {step < 3 ? (
              <button className="cxm-btn-next" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button
                className={`cxm-btn-save ${saved ? "cxm-btn-save--done" : ""}`}
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Customer"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────────────────────── */
export default function Customers() {
  const [customers,   setCustomers]   = useState(INITIAL_CUSTOMERS);
  const [search,      setSearch]      = useState("");
  const [filterTag,   setFilterTag]   = useState("All");
  const [sortBy,      setSortBy]      = useState("totalSpent");
  const [selected,    setSelected]    = useState(null);
  const [detailTab,   setDetailTab]   = useState("history");
  const [showAdd,     setShowAdd]     = useState(false);

  const tags = ["All", ...Object.keys(TAG_META)];

  const filtered = useMemo(() => {
    let list = customers.filter(c => {
      const q = search.toLowerCase();
      if (q &&
        !c.name.toLowerCase().includes(q) &&
        !c.phone.includes(q) &&
        !(c.businessName || "").toLowerCase().includes(q)) return false;
      if (filterTag !== "All" && c.tag !== filterTag) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "name")      return a.name.localeCompare(b.name);
      if (sortBy === "joinDate")  return b.joinDate.localeCompare(a.joinDate);
      if (sortBy === "purchases") return b.purchases.length - a.purchases.length;
      return b.totalSpent - a.totalSpent;
    });
  }, [customers, search, filterTag, sortBy]);

  const selectedCustomer = customers.find(c => c.id === selected) || null;

  const totalAllSpend  = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalCustomers = customers.length;
  const vipCount       = customers.filter(c => c.tag === "VIP" || c.tag === "Wholesale").length;
  const debtorCount    = customers.filter(c => c.outstandingDebt > 0).length;
  const totalDebt      = customers.reduce((s, c) => s + (c.outstandingDebt || 0), 0);

  const openDetail  = (id) => { setSelected(id); setDetailTab("history"); };
  const closeDetail = ()   => setSelected(null);

  const handleSaveCustomer = (customer) => {
    setCustomers(prev => [customer, ...prev]);
    setSelected(customer.id);
    setDetailTab("contact");
  };

  return (
    <div className="cx-root">

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onSave={handleSaveCustomer}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="cx-header">
        <div className="cx-header-left">
          <span className="cx-breadcrumb">Dashboard › Customers</span>
          <h1 className="cx-title">Customers</h1>
          <p className="cx-subtitle">Contact details &amp; purchase history</p>
        </div>
        <button className="cx-btn-add" onClick={() => setShowAdd(true)}>
          <UserPlus size={16} />
          Add Customer
        </button>
      </div>

      {/* ── STAT STRIP ── */}
      <div className="cx-stats-row">
        <div className="cx-stat">
          <div className="cx-stat-icon"><Users size={16} /></div>
          <div className="cx-stat-value">{totalCustomers}</div>
          <div className="cx-stat-label">Total Customers</div>
        </div>
        <div className="cx-stat-divider" />
        <div className="cx-stat">
          <div className="cx-stat-icon"><TrendingUp size={16} /></div>
          <div className="cx-stat-value">{fmt(totalAllSpend)}</div>
          <div className="cx-stat-label">Lifetime Revenue</div>
        </div>
        <div className="cx-stat-divider" />
        <div className="cx-stat">
          <div className="cx-stat-icon"><ShoppingBag size={16} /></div>
          <div className="cx-stat-value">{fmt(Math.round(totalAllSpend / (totalCustomers || 1)))}</div>
          <div className="cx-stat-label">Avg. per Customer</div>
        </div>
        <div className="cx-stat-divider" />
        <div className="cx-stat">
          <div className="cx-stat-icon"><Star size={16} /></div>
          <div className="cx-stat-value">{vipCount}</div>
          <div className="cx-stat-label">VIP &amp; Wholesale</div>
        </div>
        <div className="cx-stat-divider" />
        <div className="cx-stat">
          <div className="cx-stat-icon cx-stat-icon--debt"><AlertCircle size={16} /></div>
          <div className={`cx-stat-value ${debtorCount > 0 ? "cx-stat-value--debt" : ""}`}>
            {debtorCount > 0 ? fmt(totalDebt) : "—"}
          </div>
          <div className="cx-stat-label">Outstanding Debt</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={`cx-body ${selectedCustomer ? "cx-body--split" : ""}`}>

        {/* ── LIST COLUMN ── */}
        <div className="cx-list-col">
          <div className="cx-toolbar">
            <div className="cx-search-wrap">
              <Search size={15} className="cx-search-ico" />
              <input
                className="cx-search"
                placeholder="Search name, phone or business…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="cx-tag-filters">
              {tags.map(t => (
                <button
                  key={t}
                  className={`cx-tag-btn ${filterTag === t ? "cx-tag-btn--active" : ""}`}
                  style={filterTag === t && TAG_META[t] ? {
                    background:  TAG_META[t].bg,
                    color:       TAG_META[t].color,
                    borderColor: TAG_META[t].color + "55",
                  } : {}}
                  onClick={() => setFilterTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <select className="cx-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="totalSpent">Sort: Top Spenders</option>
              <option value="purchases">Sort: Most Purchases</option>
              <option value="joinDate">Sort: Newest First</option>
              <option value="name">Sort: A – Z</option>
            </select>
          </div>

          <div className="cx-list">
            {filtered.length === 0 ? (
              <div className="cx-empty">
                <User size={36} strokeWidth={1.2} />
                <p>No customers found.</p>
                <button className="cx-empty-cta" onClick={() => setShowAdd(true)}>
                  <UserPlus size={14} /> Add your first customer
                </button>
              </div>
            ) : filtered.map((c, i) => {
              const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const tag      = TAG_META[c.tag] || {};
              const isActive = selected === c.id;
              return (
                <div
                  key={c.id}
                  className={`cx-card ${isActive ? "cx-card--active" : ""}`}
                  onClick={() => isActive ? closeDetail() : openDetail(c.id)}
                >
                  <div className="cx-avatar" style={{ background: bg, color: fg }}>
                    {initials(c.name)}
                  </div>
                  <div className="cx-card-info">
                    <div className="cx-card-name-row">
                      <span className="cx-card-name">{c.name}</span>
                      <span className="cx-tag" style={{ background: tag.bg, color: tag.color }}>
                        {c.tag}
                      </span>
                      {c.outstandingDebt > 0 && (
                        <span className="cx-debt-badge">
                          <AlertCircle size={10} /> Owes {fmt(c.outstandingDebt)}
                        </span>
                      )}
                    </div>
                    <div className="cx-card-meta">
                      <Phone size={11} />
                      <span className="cx-card-phone">{c.phone}</span>
                      {c.businessName && (
                        <><Building2 size={11} /><span>{c.businessName}</span></>
                      )}
                      <Package size={11} />
                      <span>{c.purchases.length} purchase{c.purchases.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="cx-card-spend">
                    <div className="cx-card-spend-amt">{fmt(c.totalSpent)}</div>
                    <div className="cx-card-spend-label">total spent</div>
                  </div>
                  <ChevronRight size={18} className={`cx-chevron ${isActive ? "cx-chevron--open" : ""}`} />
                </div>
              );
            })}
          </div>

          <div className="cx-list-footer">
            Showing {filtered.length} of {customers.length} customers
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        {selectedCustomer && (() => {
          const c   = selectedCustomer;
          const idx = customers.findIndex(x => x.id === c.id);
          const [bg, fg] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const tag = TAG_META[c.tag] || {};

          return (
            <div className="cx-detail">
              <button className="cx-detail-close" onClick={closeDetail}><X size={14} /></button>

              <div className="cx-detail-profile">
                <div className="cx-detail-avatar" style={{ background: bg, color: fg }}>
                  {initials(c.name)}
                </div>
                <div className="cx-detail-name">{c.name}</div>
                {c.businessName && <div className="cx-detail-biz">{c.businessName}</div>}
                <span className="cx-tag cx-tag--lg" style={{ background: tag.bg, color: tag.color }}>
                  {c.tag}
                </span>
                <div className="cx-detail-since">
                  <Calendar size={12} /> Customer since {fmtDate(c.joinDate)}
                </div>

                {c.outstandingDebt > 0 && (
                  <div className="cx-detail-debt-alert">
                    <AlertCircle size={14} />
                    Outstanding debt: <strong>{fmt(c.outstandingDebt)}</strong>
                  </div>
                )}

                <div className="cx-detail-metrics">
                  <div className="cx-dm">
                    <div className="cx-dm-value">{fmt(c.totalSpent)}</div>
                    <div className="cx-dm-label">Lifetime spend</div>
                  </div>
                  <div className="cx-dm-divider" />
                  <div className="cx-dm">
                    <div className="cx-dm-value">{c.purchases.length}</div>
                    <div className="cx-dm-label">Purchases</div>
                  </div>
                  <div className="cx-dm-divider" />
                  <div className="cx-dm">
                    <div className="cx-dm-value">
                      {c.purchases.length > 0 ? fmt(Math.round(c.totalSpent / c.purchases.length)) : "—"}
                    </div>
                    <div className="cx-dm-label">Avg. order</div>
                  </div>
                </div>

                <div className="cx-detail-ctas">
                  <a className="cx-cta cx-cta--wa" href={`https://wa.me/234${c.whatsapp.slice(1)}`} target="_blank" rel="noreferrer">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a className="cx-cta cx-cta--call" href={`tel:${c.phone}`}>
                    <Phone size={14} /> Call
                  </a>
                  <button className="cx-cta cx-cta--receipt">
                    <Receipt size={14} /> Receipt
                  </button>
                </div>
              </div>

              <div className="cx-detail-tabs">
                {[["history","Purchase History"],["contact","Contact Info"]].map(([val, lbl]) => (
                  <button
                    key={val}
                    className={`cx-detail-tab ${detailTab === val ? "cx-detail-tab--active" : ""}`}
                    onClick={() => setDetailTab(val)}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="cx-detail-body">
                {detailTab === "history" && (
                  <div className="cx-history">
                    {c.purchases.length === 0 ? (
                      <div className="cx-history-empty">No purchases recorded yet.</div>
                    ) : c.purchases.map((p, pi) => (
                      <div key={p.id} className="cx-purchase-line">
                        <div className="cx-purchase-num">{pi + 1}</div>
                        <div className="cx-purchase-info">
                          <div className="cx-purchase-item">{p.item}</div>
                          <div className="cx-purchase-date">{fmtDate(p.date)}</div>
                        </div>
                        <div className="cx-purchase-right">
                          <div className="cx-purchase-amt">{fmt(p.amount)}</div>
                          <div className={`cx-purchase-status ${p.paid ? "cx-paid" : "cx-unpaid"}`}>
                            {p.paid
                              ? <><CheckCircle size={10} /> {p.method}</>
                              : <><AlertCircle size={10} /> Unpaid</>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                    {c.purchases.length > 0 && (
                      <div className="cx-history-total">
                        <span>Total spent</span>
                        <span className="cx-history-total-amt">{fmt(c.totalSpent)}</span>
                      </div>
                    )}
                  </div>
                )}

                {detailTab === "contact" && (
                  <div className="cx-contact">
                    {[
                      { Icon: Phone,          label: "Phone",         value: c.phone || "—" },
                      { Icon: Phone,          label: "Alt. Phone",    value: c.altPhone || "—" },
                      { Icon: MessageCircle,  label: "WhatsApp",      value: c.whatsapp || "—" },
                      { Icon: Mail,           label: "Email",         value: c.email || "—" },
                      { Icon: Building2,      label: "Business",      value: c.businessName || "—" },
                      { Icon: Users,          label: "Business Type", value: c.businessType || "—" },
                      { Icon: MapPin,         label: "Address",       value: c.address ? `${c.address}, ${c.state}` : c.state || "—" },
                      { Icon: Banknote,       label: "Credit Limit",  value: c.creditLimit ? fmt(c.creditLimit) : "No credit" },
                      { Icon: Tag,            label: "How they found us", value: c.howHeard || "—" },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="cx-contact-row">
                        <div className="cx-contact-icon"><Icon size={15} /></div>
                        <div className="cx-contact-data">
                          <div className="cx-contact-label">{label}</div>
                          <div className="cx-contact-value">{value}</div>
                        </div>
                      </div>
                    ))}
                    {c.notes && (
                      <div className="cx-notes-block">
                        <div className="cx-notes-label">Notes</div>
                        <div className="cx-notes-text">{c.notes}</div>
                      </div>
                    )}
                    <button className="cx-edit-btn"><Pencil size={13} /> Edit Customer Info</button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}