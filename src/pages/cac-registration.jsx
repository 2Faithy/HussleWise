import { useState, useRef } from "react";
import {
  Building2, CheckCircle, AlertTriangle, Clock, Info,
  ChevronRight, ChevronDown, ChevronUp, Upload, X,
  FileText, User, Phone, Mail, MapPin, Shield, Star,
  CreditCard, Banknote, Copy, ExternalLink, Zap,
  AlertCircle, ArrowRight, Calendar, Package, BadgeCheck,
  HelpCircle, Eye, EyeOff, Lock, RefreshCw, Send,
} from "lucide-react";
import "./cac-registration.css";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const BUSINESS_TYPES = [
  {
    id: "sole",
    label: "Business Name",
    subLabel: "Sole Proprietorship",
    fee: 15000,
    govFee: 10000,
    timeline: "5–10 working days",
    best: "Market traders, solo operators, artisans",
    description: "Register a business name under your personal name. Simplest and cheapest. You are personally liable for the business.",
    requirements: ["Valid ID (NIN or Int'l Passport)", "Passport photo", "Business name (3 options)", "Business address", "Nature of business"],
  },
  {
    id: "ltd",
    label: "Private Limited Company",
    subLabel: "RC (Ltd)",
    fee: 35000,
    govFee: 20000,
    timeline: "10–15 working days",
    best: "Growing businesses, partnerships, seeking investors",
    description: "A separate legal entity from its owners. Best if you have partners or want to grow big. Protects personal assets.",
    requirements: ["Valid ID for all directors", "Passport photos for all directors", "Company name (3 options)", "Registered address", "Memorandum & Articles of Association", "Share capital structure", "Nature of business"],
    popular: true,
  },
  {
    id: "ngo",
    label: "Incorporated Trustee",
    subLabel: "NGO / Church / Association",
    fee: 45000,
    govFee: 30000,
    timeline: "15–20 working days",
    best: "Churches, mosques, NGOs, clubs, associations",
    description: "For non-profit organisations, religious bodies and associations. No share capital required.",
    requirements: ["Valid ID for 2+ trustees", "Constitution / rules of association", "Trustee passport photos", "Registered address", "Minutes of inaugural meeting"],
  },
];

const COMMON_PITFALLS = [
  {
    icon: AlertTriangle,
    color: "#b04a2f",
    bg: "rgba(176,74,47,0.1)",
    title: "Name Already Taken",
    body: "The most common reason for rejection. Always submit 3 unique business name options — CAC checks against millions of existing names. Avoid generic words like 'Nigeria', 'Global', 'International', 'Best'.",
  },
  {
    icon: FileText,
    color: "#c07830",
    bg: "rgba(192,120,48,0.1)",
    title: "Blurry or Rejected ID",
    body: "CAC requires clear, government-issued ID. Driver's licences that are expired, NIN slips (not cards), or student IDs are rejected. Scan — don't photograph — your documents if possible.",
  },
  {
    icon: MapPin,
    color: "#7a3ea0",
    bg: "rgba(122,62,160,0.1)",
    title: "Unverifiable Business Address",
    body: "Your business address must be a real, locatable address in Nigeria. 'No 1 Anywhere Street' or P.O. Box addresses are rejected. If you work from home, use your home address.",
  },
  {
    icon: User,
    color: "#2d5fa0",
    bg: "rgba(45,95,160,0.1)",
    title: "Director Details Mismatch",
    body: "For Ltd companies, all directors' names must exactly match their ID documents. A middle name on ID but not in the form — or a nickname instead of legal name — causes rejection.",
  },
  {
    icon: Clock,
    color: "#1c5b56",
    bg: "rgba(28,91,86,0.1)",
    title: "Late or Missing Payment",
    body: "CAC will not process your application without confirmed government fees. Our partner handles this on your behalf — but payment to HustleWise must clear before we submit to avoid delays.",
  },
  {
    icon: RefreshCw,
    color: "#8c4a1a",
    bg: "rgba(140,74,26,0.1)",
    title: "Forgetting Post-Registration Steps",
    body: "After registration, you still need a Tax Identification Number (TIN) from FIRS, and a business bank account. These are not automatic. We will guide you through these after your certificate arrives.",
  },
];

const TIMELINE_STEPS = [
  { day: "Day 0",     label: "You Submit Form & Pay",         desc: "Complete this form and pay via our bank details. We confirm within 2 hours on business days.", done: false },
  { day: "Day 1",     label: "HustleWise Verifies Documents",  desc: "Our team reviews all your documents. We call or WhatsApp you if anything needs correction.", done: false },
  { day: "Day 2",     label: "Submitted to CAC Partner",       desc: "We submit your complete application to our certified CAC agent. You receive a tracking reference.", done: false },
  { day: "Day 5–8",   label: "CAC Name Availability Check",    desc: "CAC checks your proposed business names against their national database.", done: false },
  { day: "Day 8–12",  label: "Application Processing",         desc: "CAC processes the full application. This is where most delays happen — public holidays extend this.", done: false },
  { day: "Day 12–15", label: "Certificate Issued",             desc: "CAC approves and issues your certificate of registration. We download and send it to you via WhatsApp and email.", done: false },
  { day: "Day 15+",   label: "Post-Registration Guidance",     desc: "We guide you to get your TIN, open a business bank account, and add your RC number to your HustleWise profile.", done: false },
];

const FAQ = [
  {
    q: "Can I still trade without CAC registration?",
    a: "Yes, many Nigerians trade without registration. However, you cannot open a business bank account, access loans, win government contracts, or list on formal marketplaces without a registered business. Registration also protects your business name.",
  },
  {
    q: "What if CAC rejects my application?",
    a: "The most common reason is a taken business name. If rejected, we will resubmit with your alternative names at no extra service charge. If the rejection is due to documents, we will notify you immediately to correct and resubmit.",
  },
  {
    q: "Will I be physically present at CAC office?",
    a: "No. Our partner handles the entire process online via the CAC portal. You do not need to visit any CAC office. Everything is done remotely — you only need to submit your documents here.",
  },
  {
    q: "What is the government (CAC) fee vs HustleWise service fee?",
    a: "The government fee goes directly to CAC via our partner. The HustleWise service fee covers document verification, agent fees, portal charges, and our coordination work. Both are included in the total you pay us.",
  },
  {
    q: "How do I know my payment is safe?",
    a: "We only collect fees upfront to pay CAC. Our account details are fixed (see below). We do not ask for payment via DM or unofficial channels. If someone contacts you asking for payment outside this page, that is a scam — report it immediately.",
  },
  {
    q: "My business is in Lagos but I live in Abuja — can you still help?",
    a: "Yes. CAC registration is nationwide and fully online. Your business address can be in any state in Nigeria. We handle clients across all 36 states and FCT.",
  },
];

const STATES_NG = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const NATURE_OPTIONS = [
  "Trading / Buying & Selling","Food & Beverages","Fashion & Clothing",
  "Technology / IT Services","Transport & Logistics","Agriculture & Farming",
  "Beauty & Personal Care","Education & Training","Health & Medical",
  "Construction & Real Estate","Media & Entertainment","Religious / Non-profit",
  "Consulting & Professional Services","Manufacturing","Other",
];

const HUSTLE_BANK = {
  bankName:   "Moniepoint MFB",
  accountName:"HustleWise Technologies Ltd",
  accountNo:  "9012345678",
};

/* ─────────────────────────────────────────────────────────────
   BLANK FORMS
───────────────────────────────────────────────────────────── */
const BLANK_FORM = {
  // Step 1 — Business type
  businessType: "",

  // Step 2 — Business details
  name1: "", name2: "", name3: "",
  nature: "", address: "", state: "Lagos", lga: "",
  email: "", phone: "",

  // Step 3 — Director/Owner info
  dirFullName: "", dirPhone: "", dirEmail: "",
  dirDob: "", dirNin: "", dirAddress: "",
  dirState: "Lagos",

  // Step 4 — Additional directors (Ltd only)
  directors: [],

  // Step 5 — Documents
  idDoc: null, idDocName: "", idType: "NIN Card",
  passport: null, passportName: "",
  utilityBill: null, utilityBillName: "",
  signature: null, signatureName: "",

  // Step 6 — Payment
  paymentRef: "", paymentBank: "",
  paymentDate: "",

  // Agreement
  agreed: false,
};

  /* ── Input helpers ────────────────────────────────────────── */
  const Field = ({ label, error, required, children, full }) => (
    <div className={`cr-field ${full ? "cr-field--full" : ""}`}>
      <label className="cr-label">{label}{required && <span className="cr-req">*</span>}</label>
      {children}
      {error && <div className="cr-error"><AlertCircle size={11} />{error}</div>}
    </div>
  );
/* ─────────────────────────────────────────────────────────────
   FILE UPLOAD COMPONENT
───────────────────────────────────────────────────────────── */
function FileUpload({ label, hint, value, onChange, accept = "image/*,application/pdf" }) {
  const ref = useRef();
  return (
    <div className="cr-upload-field">
      <label className="cr-upload-label">{label}</label>
      {hint && <div className="cr-upload-hint">{hint}</div>}
      <div
        className={`cr-upload-zone ${value ? "cr-upload-zone--filled" : ""}`}
        onClick={() => ref.current?.click()}
      >
        {value ? (
          <>
            <CheckCircle size={18} className="cr-upload-check" />
            <span className="cr-upload-filename">{value}</span>
            <button className="cr-upload-remove" onClick={e => { e.stopPropagation(); onChange(null, ""); }}>
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <Upload size={20} className="cr-upload-ico" />
            <span className="cr-upload-text">Click to upload</span>
            <span className="cr-upload-formats">JPG, PNG or PDF · Max 5MB</span>
          </>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onChange(f, f.name);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────────── */
function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cr-faq-item ${open ? "cr-faq-item--open" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="cr-faq-q">
        <HelpCircle size={15} className="cr-faq-ico" />
        <span>{item.q}</span>
        {open ? <ChevronUp size={16} className="cr-faq-chevron" /> : <ChevronDown size={16} className="cr-faq-chevron" />}
      </div>
      {open && <div className="cr-faq-a">{item.a}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Business Type"   },
  { id: 2, label: "Business Info"   },
  { id: 3, label: "Owner Details"   },
  { id: 4, label: "Documents"       },
  { id: 5, label: "Payment"         },
  { id: 6, label: "Review & Submit" },
];

export default function CacRegistration() {
  const [step,        setStep]        = useState(0); // 0 = landing, 1–6 = form steps
  const [form,        setForm]        = useState(BLANK_FORM);
  const [errors,      setErrors]      = useState({});
  const [openPitfall, setOpenPitfall] = useState(null);
  const [copiedAcc,   setCopiedAcc]   = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const selectedType = BUSINESS_TYPES.find(t => t.id === form.businessType);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const copyAccount = () => {
    navigator.clipboard?.writeText(HUSTLE_BANK.accountNo);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  /* ── Validation per step ──────────────────────────────────── */
  const validate = (s) => {
    const e = {};
    if (s === 1 && !form.businessType) e.businessType = "Select a registration type";
    if (s === 2) {
      if (!form.name1.trim()) e.name1 = "First name option is required";
      if (!form.nature)       e.nature = "Select the nature of your business";
      if (!form.address.trim()) e.address = "Business address is required";
      if (!form.phone.trim() || !/^0[789][01]\d{8}$/.test(form.phone)) e.phone = "Enter a valid Nigerian phone number";
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    }
    if (s === 3) {
      if (!form.dirFullName.trim()) e.dirFullName = "Full legal name is required";
      if (!form.dirPhone.trim() || !/^0[789][01]\d{8}$/.test(form.dirPhone)) e.dirPhone = "Enter a valid phone number";
      if (!form.dirNin.trim() || form.dirNin.length < 11) e.dirNin = "Enter your 11-digit NIN";
      if (!form.dirAddress.trim()) e.dirAddress = "Residential address is required";
    }
    if (s === 4) {
      if (!form.idDocName) e.idDoc = "Government ID is required";
      if (!form.passportName) e.passport = "Passport photo is required";
    }
    if (s === 5) {
      if (!form.paymentRef.trim()) e.paymentRef = "Enter your payment reference or teller number";
      if (!form.paymentDate)       e.paymentDate = "Enter the date you made payment";
      if (!form.agreed)            e.agreed = "You must agree to proceed";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    if (step < 6) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    if (!validate(5)) { setStep(5); return; }
    setSubmitted(true);
  };

  const totalFee = selectedType ? selectedType.fee : 0;

  /* ─────────────────────────────────────────────────────────
     SUCCESS SCREEN
  ───────────────────────────────────────────────────────── */
  if (submitted) return (
    <div className="cr-root">
      <div className="cr-success">
        <div className="cr-success-ring">
          <CheckCircle size={52} />
        </div>
        <h2 className="cr-success-title">Application Submitted!</h2>
        <p className="cr-success-body">
          We have received your CAC registration application and payment confirmation.
          Our team will review your documents within <strong>2 business hours</strong> and
          reach out on WhatsApp (<strong>{form.phone || form.dirPhone}</strong>) if anything
          needs to be corrected.
        </p>
        <div className="cr-success-ref">
          <div className="cr-success-ref-label">Your Application Reference</div>
          <div className="cr-success-ref-val">HW-CAC-{String(Date.now()).slice(-7)}</div>
        </div>
        <div className="cr-success-next-title">What happens next</div>
        <div className="cr-success-steps">
          {["Documents verified by HustleWise team (Day 1)","Submitted to CAC agent (Day 2)","CAC processes application (Day 5–12)","Certificate sent to you via WhatsApp & Email (Day 12–15)"].map((s, i) => (
            <div key={i} className="cr-success-step">
              <div className="cr-success-step-num">{i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="cr-success-note">
          <Info size={13} />
          Save your reference number. If you have questions, WhatsApp us at <strong>08031234567</strong>
        </div>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────
     LANDING PAGE (step 0)
  ───────────────────────────────────────────────────────── */
  if (step === 0) return (
    <div className="cr-root">

      {/* Hero */}
      <div className="cr-hero">
        <div className="cr-hero-left">
          <span className="cr-breadcrumb">Dashboard › Register Business</span>
          <h1 className="cr-title">Register Your Business with CAC</h1>
          <p className="cr-hero-body">
            Make your hustle official. A registered business unlocks bank accounts,
            government contracts, loans, and customer trust — all done for you by
            our certified CAC partners. You never visit an office.
          </p>
          <div className="cr-hero-pills">
            <span className="cr-pill"><BadgeCheck size={13} /> 100% Online</span>
            <span className="cr-pill"><Shield size={13} /> CAC Certified Partner</span>
            <span className="cr-pill"><Clock size={13} /> 5–15 Working Days</span>
          </div>
          <button className="cr-start-btn" onClick={() => setStep(1)}>
            Start Registration <ArrowRight size={16} />
          </button>
        </div>
        <div className="cr-hero-right">
          <div className="cr-hero-card">
            <div className="cr-hero-card-ico"><Building2 size={32} /></div>
            <div className="cr-hero-card-title">HustleWise CAC Service</div>
            <div className="cr-hero-card-items">
              {["We collect your documents","We submit to CAC on your behalf","We track and follow up","You receive your certificate","We guide you on next steps"].map((item, i) => (
                <div key={i} className="cr-hero-card-item">
                  <CheckCircle size={14} className="cr-hero-card-check" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="cr-section-title">
        <Package size={16} /> Choose Your Registration Type
      </div>
      <div className="cr-type-grid">
        {BUSINESS_TYPES.map(t => (
          <div key={t.id} className={`cr-type-card ${t.popular ? "cr-type-card--popular" : ""}`}>
            {t.popular && <div className="cr-popular-badge"><Star size={11} /> Most Popular</div>}
            <div className="cr-type-label">{t.label}</div>
            <div className="cr-type-sublabel">{t.subLabel}</div>
            <div className="cr-type-fee">₦{t.fee.toLocaleString()}</div>
            <div className="cr-type-fee-sub">Total incl. CAC government fee</div>
            <div className="cr-type-timeline"><Clock size={12} /> {t.timeline}</div>
            <div className="cr-type-best"><Star size={11} /> Best for: {t.best}</div>
            <p className="cr-type-desc">{t.description}</p>
            <div className="cr-type-reqs-title">Requirements:</div>
            <ul className="cr-type-reqs">
              {t.requirements.map((r, i) => (
                <li key={i}><CheckCircle size={11} /> {r}</li>
              ))}
            </ul>
            <button
              className="cr-type-cta"
              onClick={() => { setForm(f => ({ ...f, businessType: t.id })); setStep(1); }}
            >
              Get Started <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Common pitfalls */}
      <div className="cr-section-title" style={{ marginTop: 40 }}>
        <AlertTriangle size={16} /> What Usually Goes Wrong (Read Before You Apply)
      </div>
      <div className="cr-pitfalls-grid">
        {COMMON_PITFALLS.map((p, i) => {
          const Icon = p.icon;
          const open = openPitfall === i;
          return (
            <div
              key={i}
              className={`cr-pitfall-card ${open ? "cr-pitfall-card--open" : ""}`}
              onClick={() => setOpenPitfall(open ? null : i)}
            >
              <div className="cr-pitfall-header">
                <div className="cr-pitfall-ico" style={{ background: p.bg, color: p.color }}>
                  <Icon size={18} />
                </div>
                <div className="cr-pitfall-title">{p.title}</div>
                {open ? <ChevronUp size={15} className="cr-pitfall-chevron" /> : <ChevronDown size={15} className="cr-pitfall-chevron" />}
              </div>
              {open && <div className="cr-pitfall-body">{p.body}</div>}
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="cr-section-title" style={{ marginTop: 40 }}>
        <Calendar size={16} /> Realistic Timeline (Business Name / Ltd)
      </div>
      <div className="cr-timeline">
        {TIMELINE_STEPS.map((t, i) => (
          <div key={i} className="cr-tl-item">
            <div className="cr-tl-left">
              <div className="cr-tl-dot" />
              {i < TIMELINE_STEPS.length - 1 && <div className="cr-tl-line" />}
            </div>
            <div className="cr-tl-content">
              <div className="cr-tl-day">{t.day}</div>
              <div className="cr-tl-label">{t.label}</div>
              <div className="cr-tl-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="cr-section-title" style={{ marginTop: 40 }}>
        <HelpCircle size={16} /> Frequently Asked Questions
      </div>
      <div className="cr-faq-list">
        {FAQ.map((item, i) => <FaqItem key={i} item={item} />)}
      </div>

      {/* CTA bottom */}
      <div className="cr-bottom-cta">
        <div className="cr-bottom-cta-text">
          <div className="cr-bottom-cta-title">Ready to make your business official?</div>
          <div className="cr-bottom-cta-sub">Join thousands of Nigerian entrepreneurs who registered through HustleWise.</div>
        </div>
        <button className="cr-start-btn" onClick={() => setStep(1)}>
          Start Registration <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────────────────
     FORM STEPS (1–6)
  ───────────────────────────────────────────────────────── */
  return (
    <div className="cr-root">

      {/* Step header */}
      <div className="cr-form-header">
        <button className="cr-back-btn" onClick={() => step === 1 ? setStep(0) : setStep(s => s - 1)}>
          ← Back
        </button>
        <div className="cr-form-title-wrap">
          <h2 className="cr-form-title">CAC Registration</h2>
          <div className="cr-form-sub">Step {step} of {STEPS.length} — {STEPS[step - 1].label}</div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="cr-stepper">
        {STEPS.map((s, i) => (
          <div key={s.id} className="cr-step-item">
            <div className={`cr-step-dot ${step > s.id ? "cr-step-dot--done" : step === s.id ? "cr-step-dot--active" : ""}`}>
              {step > s.id ? <CheckCircle size={14} /> : <span>{s.id}</span>}
            </div>
            <div className={`cr-step-label ${step === s.id ? "cr-step-label--active" : ""}`}>{s.label}</div>
            {i < STEPS.length - 1 && <div className={`cr-step-line ${step > s.id ? "cr-step-line--done" : ""}`} />}
          </div>
        ))}
      </div>

      <div className="cr-form-body">

        {/* ── STEP 1: Business Type ── */}
        {step === 1 && (
          <div className="cr-step-content">
            <div className="cr-step-intro">
              <Zap size={15} />
              <span>Choose the type of registration. Not sure? <strong>Business Name</strong> is best for most market traders and sole operators.</span>
            </div>
            {errors.businessType && (
              <div className="cr-top-error"><AlertCircle size={14} />{errors.businessType}</div>
            )}
            <div className="cr-type-select-grid">
              {BUSINESS_TYPES.map(t => (
                <div
                  key={t.id}
                  className={`cr-type-select-card ${form.businessType === t.id ? "cr-type-select-card--active" : ""} ${t.popular ? "cr-type-select-card--popular" : ""}`}
                  onClick={() => set("businessType", t.id)}
                >
                  {t.popular && <div className="cr-popular-badge"><Star size={10} /> Most Popular</div>}
                  <div className="cr-ts-check">
                    {form.businessType === t.id
                      ? <CheckCircle size={18} className="cr-ts-check--on" />
                      : <div className="cr-ts-check--off" />}
                  </div>
                  <div className="cr-ts-label">{t.label}</div>
                  <div className="cr-ts-sub">{t.subLabel}</div>
                  <div className="cr-ts-fee">₦{t.fee.toLocaleString()}</div>
                  <div className="cr-ts-timeline"><Clock size={11} /> {t.timeline}</div>
                  <div className="cr-ts-best">{t.best}</div>
                </div>
              ))}
            </div>
            {selectedType && (
              <div className="cr-type-detail-box">
                <div className="cr-tdb-title"><Info size={13} /> What's included in ₦{selectedType.fee.toLocaleString()}</div>
                <div className="cr-tdb-row">
                  <span>Government (CAC) fee</span>
                  <span>₦{selectedType.govFee.toLocaleString()}</span>
                </div>
                <div className="cr-tdb-row">
                  <span>HustleWise service + agent fee</span>
                  <span>₦{(selectedType.fee - selectedType.govFee).toLocaleString()}</span>
                </div>
                <div className="cr-tdb-row cr-tdb-row--total">
                  <span>Total you pay</span>
                  <span>₦{selectedType.fee.toLocaleString()}</span>
                </div>
                <div className="cr-tdb-note">
                  <AlertTriangle size={12} /> Payment is made to our bank account — not to CAC directly. We handle everything.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Business Details ── */}
        {step === 2 && (
          <div className="cr-step-content">
            <div className="cr-step-intro">
              <AlertTriangle size={15} />
              <span>Submit <strong>3 name options</strong> — CAC will pick the first available. Use unique, specific names. Avoid 'Nigeria', 'Global', 'Best', 'International'.</span>
            </div>
            <div className="cr-form-grid">
              <Field label="Business Name — Option 1" required error={errors.name1} full>
                <input className={`cr-input ${errors.name1 ? "cr-input--err" : ""}`}
                  placeholder="e.g. Nkechi Agro Ventures" value={form.name1}
                  onChange={e => set("name1", e.target.value)} />
              </Field>
              <Field label="Business Name — Option 2">
                <input className="cr-input" placeholder="Second choice" value={form.name2}
                  onChange={e => set("name2", e.target.value)} />
              </Field>
              <Field label="Business Name — Option 3">
                <input className="cr-input" placeholder="Third choice" value={form.name3}
                  onChange={e => set("name3", e.target.value)} />
              </Field>
              <Field label="Nature of Business" required error={errors.nature}>
                <select className={`cr-select ${errors.nature ? "cr-input--err" : ""}`}
                  value={form.nature} onChange={e => set("nature", e.target.value)}>
                  <option value="">Select…</option>
                  {NATURE_OPTIONS.map(n => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Business Address" required error={errors.address} full>
                <input className={`cr-input ${errors.address ? "cr-input--err" : ""}`}
                  placeholder="e.g. 14 Adeola Street, Surulere" value={form.address}
                  onChange={e => set("address", e.target.value)} />
              </Field>
              <Field label="State">
                <select className="cr-select" value={form.state} onChange={e => set("state", e.target.value)}>
                  {STATES_NG.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="LGA (Local Government Area)">
                <input className="cr-input" placeholder="e.g. Surulere" value={form.lga}
                  onChange={e => set("lga", e.target.value)} />
              </Field>
              <Field label="Business Phone" required error={errors.phone}>
                <input className={`cr-input ${errors.phone ? "cr-input--err" : ""}`}
                  placeholder="08031234567" value={form.phone} inputMode="numeric" maxLength={11}
                  onChange={e => set("phone", e.target.value)} />
              </Field>
              <Field label="Business Email" error={errors.email}>
                <input className={`cr-input ${errors.email ? "cr-input--err" : ""}`}
                  placeholder="business@email.com" value={form.email} type="email"
                  onChange={e => set("email", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 3: Owner / Director ── */}
        {step === 3 && (
          <div className="cr-step-content">
            <div className="cr-step-intro">
              <Info size={15} />
              <span>All details here must <strong>exactly match</strong> your government ID. A mismatch is the #1 cause of CAC rejection.</span>
            </div>
            <div className="cr-form-grid">
              <Field label="Full Legal Name (as on ID)" required error={errors.dirFullName} full>
                <input className={`cr-input ${errors.dirFullName ? "cr-input--err" : ""}`}
                  placeholder="e.g. Chinwe Ngozi Okafor" value={form.dirFullName}
                  onChange={e => set("dirFullName", e.target.value)} />
              </Field>
              <Field label="Phone Number" required error={errors.dirPhone}>
                <input className={`cr-input ${errors.dirPhone ? "cr-input--err" : ""}`}
                  placeholder="08031234567" value={form.dirPhone} inputMode="numeric" maxLength={11}
                  onChange={e => set("dirPhone", e.target.value)} />
              </Field>
              <Field label="Email Address">
                <input className="cr-input" placeholder="your@email.com" type="email"
                  value={form.dirEmail} onChange={e => set("dirEmail", e.target.value)} />
              </Field>
              <Field label="Date of Birth" required>
                <input className="cr-input" type="date" value={form.dirDob}
                  onChange={e => set("dirDob", e.target.value)} />
              </Field>
              <Field label="NIN (National ID Number)" required error={errors.dirNin}>
                <input className={`cr-input ${errors.dirNin ? "cr-input--err" : ""}`}
                  placeholder="11-digit NIN" value={form.dirNin} inputMode="numeric" maxLength={11}
                  onChange={e => set("dirNin", e.target.value)} />
              </Field>
              <Field label="State of Origin">
                <select className="cr-select" value={form.dirState}
                  onChange={e => set("dirState", e.target.value)}>
                  {STATES_NG.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Residential Address" required error={errors.dirAddress} full>
                <input className={`cr-input ${errors.dirAddress ? "cr-input--err" : ""}`}
                  placeholder="Your home address (not P.O. Box)" value={form.dirAddress}
                  onChange={e => set("dirAddress", e.target.value)} />
              </Field>
            </div>

            {form.businessType === "ltd" && (
              <div className="cr-extra-directors">
                <div className="cr-extra-title"><Users size={14} /> Additional Directors (Ltd requires minimum 2)</div>
                <div className="cr-extra-note">
                  A Private Limited Company needs at least 2 directors. If you have a co-director,
                  add them below. Their ID and passport photo will also be required in the next step.
                </div>
                {form.directors.map((d, i) => (
                  <div key={i} className="cr-extra-director-row">
                    <div className="cr-extra-director-num">Director {i + 2}</div>
                    <div className="cr-form-grid">
                      <Field label="Full Name" full>
                        <input className="cr-input" placeholder="Full legal name"
                          value={d.name}
                          onChange={e => {
                            const dirs = [...form.directors];
                            dirs[i].name = e.target.value;
                            set("directors", dirs);
                          }} />
                      </Field>
                      <Field label="Phone">
                        <input className="cr-input" placeholder="08031234567"
                          value={d.phone}
                          onChange={e => {
                            const dirs = [...form.directors];
                            dirs[i].phone = e.target.value;
                            set("directors", dirs);
                          }} />
                      </Field>
                      <Field label="NIN">
                        <input className="cr-input" placeholder="11-digit NIN"
                          value={d.nin}
                          onChange={e => {
                            const dirs = [...form.directors];
                            dirs[i].nin = e.target.value;
                            set("directors", dirs);
                          }} />
                      </Field>
                    </div>
                    <button className="cr-remove-director"
                      onClick={() => set("directors", form.directors.filter((_, j) => j !== i))}>
                      <X size={13} /> Remove
                    </button>
                  </div>
                ))}
                <button className="cr-add-director-btn"
                  onClick={() => set("directors", [...form.directors, { name: "", phone: "", nin: "" }])}>
                  <Plus size={13} /> Add Director
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Documents ── */}
        {step === 4 && (
          <div className="cr-step-content">
            <div className="cr-step-intro">
              <Shield size={15} />
              <span>Upload clear copies of each document. Blurry or cropped images will be rejected. All files are stored securely and used only for your CAC application.</span>
            </div>

            <div className="cr-docs-grid">
              <div className="cr-doc-section">
                <div className="cr-doc-section-title">Government-Issued ID</div>
                <div className="cr-doc-id-type-row">
                  {["NIN Card","International Passport","Driver's Licence","Voter's Card"].map(t => (
                    <button key={t}
                      className={`cr-id-type-btn ${form.idType === t ? "cr-id-type-btn--active" : ""}`}
                      onClick={() => set("idType", t)}>
                      {t}
                    </button>
                  ))}
                </div>
                <FileUpload
                  label={`Upload ${form.idType}`}
                  hint="Front face of the ID — must be clear and not expired"
                  value={form.idDocName}
                  onChange={(f, name) => { set("idDoc", f); set("idDocName", name); }}
                />
                {errors.idDoc && <div className="cr-error"><AlertCircle size={11} />{errors.idDoc}</div>}
              </div>

              <div className="cr-doc-section">
                <div className="cr-doc-section-title">Passport Photograph</div>
                <FileUpload
                  label="White-background passport photo"
                  hint="Recent passport photo on plain white background — no selfies, no phone photos in dark rooms"
                  value={form.passportName}
                  onChange={(f, name) => { set("passport", f); set("passportName", name); }}
                />
                {errors.passport && <div className="cr-error"><AlertCircle size={11} />{errors.passport}</div>}
              </div>

              <div className="cr-doc-section">
                <div className="cr-doc-section-title">Utility Bill or Proof of Address</div>
                <FileUpload
                  label="NEPA/EKEDC bill, LAWMA, or bank statement showing address"
                  hint="Not older than 3 months. Must show your name and address clearly. Optional but speeds up processing."
                  value={form.utilityBillName}
                  onChange={(f, name) => { set("utilityBill", f); set("utilityBillName", name); }}
                />
              </div>

              {form.businessType === "ltd" && (
                <div className="cr-doc-section">
                  <div className="cr-doc-section-title">Specimen Signature</div>
                  <FileUpload
                    label="Signature on white paper (scanned or clear photo)"
                    hint="Sign on plain white paper and upload a clear photo or scan"
                    value={form.signatureName}
                    onChange={(f, name) => { set("signature", f); set("signatureName", name); }}
                  />
                </div>
              )}
            </div>

            <div className="cr-doc-warning">
              <AlertTriangle size={14} />
              <div>
                <strong>Quality check:</strong> Before uploading, ensure your ID is fully visible,
                not cut off at edges, and text is clearly legible. We will reject and ask you to
                re-upload if documents are unclear — this adds 1–2 days to your timeline.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Payment ── */}
        {step === 5 && (
          <div className="cr-step-content">
            <div className="cr-step-intro">
              <Banknote size={15} />
              <span>Make payment to our account below, then fill in your payment details. We will confirm receipt within 2 business hours.</span>
            </div>

            {/* Bank details */}
            <div className="cr-bank-card">
              <div className="cr-bank-card-header">
                <Lock size={14} /> Official HustleWise Payment Account
              </div>
              <div className="cr-bank-card-body">
                <div className="cr-bank-row">
                  <span className="cr-bank-label">Bank Name</span>
                  <span className="cr-bank-val">{HUSTLE_BANK.bankName}</span>
                </div>
                <div className="cr-bank-row">
                  <span className="cr-bank-label">Account Name</span>
                  <span className="cr-bank-val">{HUSTLE_BANK.accountName}</span>
                </div>
                <div className="cr-bank-row cr-bank-row--accent">
                  <span className="cr-bank-label">Account Number</span>
                  <div className="cr-bank-acc-row">
                    <span className="cr-bank-accno">{HUSTLE_BANK.accountNo}</span>
                    <button className="cr-bank-copy" onClick={copyAccount}>
                      {copiedAcc ? <CheckCircle size={13} /> : <Copy size={13} />}
                      {copiedAcc ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="cr-bank-amount-row">
                  <span>Amount to pay:</span>
                  <span className="cr-bank-amount">
                    {selectedType ? `₦${selectedType.fee.toLocaleString()}` : "Select a plan"}
                  </span>
                </div>
              </div>
              <div className="cr-bank-warning">
                <AlertTriangle size={13} />
                <span>
                  We will <strong>never</strong> ask for payment via DM, personal account,
                  or any channel other than this account. If someone contacts you asking
                  for payment differently — it is a scam.
                </span>
              </div>
            </div>

            {/* Payment confirmation */}
            <div className="cr-form-grid" style={{ marginTop: 20 }}>
              <Field label="Payment Reference / Teller Number" required error={errors.paymentRef} full>
                <input className={`cr-input ${errors.paymentRef ? "cr-input--err" : ""}`}
                  placeholder="e.g. NXP8843712 or teller number"
                  value={form.paymentRef}
                  onChange={e => set("paymentRef", e.target.value)} />
              </Field>
              <Field label="Date of Payment" required error={errors.paymentDate}>
                <input className={`cr-input ${errors.paymentDate ? "cr-input--err" : ""}`}
                  type="date" value={form.paymentDate}
                  onChange={e => set("paymentDate", e.target.value)} />
              </Field>
              <Field label="Bank You Paid From">
                <select className="cr-select" value={form.paymentBank}
                  onChange={e => set("paymentBank", e.target.value)}>
                  <option value="">Select your bank</option>
                  {["Access Bank","Fidelity Bank","First Bank","GTBank","Kuda Bank","Moniepoint","OPay","PalmPay","UBA","Zenith Bank","Other"].map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Agreement */}
            <div className={`cr-agree-block ${errors.agreed ? "cr-agree-block--err" : ""}`}>
              <label className="cr-agree-row">
                <input type="checkbox" className="cr-checkbox"
                  checked={form.agreed} onChange={e => set("agreed", e.target.checked)} />
                <span className="cr-agree-text">
                  I confirm that:
                  <ul className="cr-agree-list">
                    <li>All information I have provided is accurate and matches my ID documents</li>
                    <li>I have made payment of ₦{selectedType ? selectedType.fee.toLocaleString() : "—"} to the HustleWise account above</li>
                    <li>I understand HustleWise is not CAC and acts as a facilitator on my behalf</li>
                    <li>Refunds are only possible if CAC rejects the application twice due to our error — not for name availability issues</li>
                  </ul>
                </span>
              </label>
              {errors.agreed && <div className="cr-error" style={{ marginTop: 6 }}><AlertCircle size={11} />You must agree to all terms to proceed</div>}
            </div>
          </div>
        )}

        {/* ── STEP 6: Review & Submit ── */}
        {step === 6 && (
          <div className="cr-step-content">
            <div className="cr-review-title">Review Your Application</div>
            <div className="cr-review-subtitle">Please confirm all details before submitting. Changes cannot be made after submission.</div>

            <div className="cr-review-sections">
              {[
                {
                  title: "Registration Type",
                  items: [
                    { label: "Type", value: selectedType?.label || "—" },
                    { label: "Timeline", value: selectedType?.timeline || "—" },
                    { label: "Total Fee", value: selectedType ? `₦${selectedType.fee.toLocaleString()}` : "—" },
                  ]
                },
                {
                  title: "Business Information",
                  items: [
                    { label: "Name Option 1", value: form.name1 || "—" },
                    { label: "Name Option 2", value: form.name2 || "—" },
                    { label: "Name Option 3", value: form.name3 || "—" },
                    { label: "Nature",        value: form.nature || "—" },
                    { label: "Address",       value: `${form.address}, ${form.state}` },
                    { label: "Phone",         value: form.phone || "—" },
                    { label: "Email",         value: form.email || "—" },
                  ]
                },
                {
                  title: "Owner / Director",
                  items: [
                    { label: "Full Name",  value: form.dirFullName || "—" },
                    { label: "Phone",      value: form.dirPhone || "—" },
                    { label: "NIN",        value: form.dirNin ? form.dirNin.slice(0,3) + "••••••••" : "—" },
                    { label: "State",      value: form.dirState },
                  ]
                },
                {
                  title: "Documents",
                  items: [
                    { label: "ID",             value: form.idDocName || "Not uploaded" },
                    { label: "Passport Photo", value: form.passportName || "Not uploaded" },
                    { label: "Utility Bill",   value: form.utilityBillName || "Not provided" },
                  ]
                },
                {
                  title: "Payment",
                  items: [
                    { label: "Payment Ref",  value: form.paymentRef || "—" },
                    { label: "Date",         value: form.paymentDate || "—" },
                    { label: "Paid From",    value: form.paymentBank || "—" },
                  ]
                },
              ].map((section, si) => (
                <div key={si} className="cr-review-section">
                  <div className="cr-review-section-title">{section.title}</div>
                  {section.items.map((item, ii) => (
                    <div key={ii} className="cr-review-row">
                      <span className="cr-review-label">{item.label}</span>
                      <span className={`cr-review-val ${item.value === "Not uploaded" ? "cr-review-val--warn" : ""}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="cr-submit-note">
              <Send size={14} />
              <span>
                After submission, our team reviews your documents and contacts you within
                <strong> 2 business hours</strong> on <strong>{form.dirPhone || form.phone}</strong> via
                WhatsApp if corrections are needed.
              </span>
            </div>
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div className="cr-form-nav">
          <button className="cr-nav-back"
            onClick={() => step === 1 ? setStep(0) : setStep(s => s - 1)}>
            ← Back
          </button>
          <div className="cr-nav-right">
            <div className="cr-nav-step-hint">Step {step} of {STEPS.length}</div>
            <button className="cr-nav-next" onClick={goNext}>
              {step === 6 ? <><Send size={14} /> Submit Application</> : <>Continue <ChevronRight size={15} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}