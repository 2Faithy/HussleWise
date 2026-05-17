import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Send,
  Megaphone,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Eye,
  Download,
  MessageCircle,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Zap,
  Tag,
  TrendingUp,
  FileText,
  RefreshCw,
  Package,
  Star,
  Gift,
  Truck,
  X,
  ArrowLeft,
  Edit3,
  BarChart2,
  Users,
  Banknote,
  Share2,
} from "lucide-react";
import "./receiptspromos.css";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & MOCK DATA
───────────────────────────────────────────────────────────── */
const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

const METHOD_MAP = {
  Cash: "Cash",
  Transfer: "Bank Transfer",
  POS: "POS Terminal",
  Credit: "Buy Now Pay Later",
};

const MOCK_RECEIPTS = [
  {
    id: "HW-AA391Bc",
    date: "2025-07-18T09:22:00",
    customer: "Tolu Adeyemi",
    phone: "08031234567",
    amount: 45000,
    method: "Transfer",
    items: [{ description: "Tomato – Bulk Order", qty: 3, price: 15000 }],
    status: "sent",
    channel: "whatsapp",
  },
  {
    id: "HW-BB204Kd",
    date: "2025-07-17T14:05:00",
    customer: "Mama Blessing",
    phone: "08059876543",
    amount: 12000,
    method: "POS",
    items: [{ description: "Pepper & Onion Mix", qty: 4, price: 3000 }],
    status: "sent",
    channel: "whatsapp",
  },
  {
    id: "HW-CC819Xe",
    date: "2025-07-16T11:30:00",
    customer: "Walk-in Customer",
    phone: "",
    amount: 6500,
    method: "Cash",
    items: [{ description: "Tomato – Walk-in", qty: 1, price: 6500 }],
    status: "downloaded",
    channel: "download",
  },
  {
    id: "HW-DD512Tf",
    date: "2025-07-15T08:45:00",
    customer: "Iya Risi",
    phone: "07012345678",
    amount: 22000,
    method: "Transfer",
    items: [{ description: "Wholesale Order", qty: 1, price: 22000 }],
    status: "sent",
    channel: "whatsapp",
  },
  {
    id: "HW-EE730Rg",
    date: "2025-07-14T16:10:00",
    customer: "Chidinma O.",
    phone: "08167890123",
    amount: 9800,
    method: "POS",
    items: [{ description: "Mixed Vegetables", qty: 2, price: 4900 }],
    status: "viewed",
    channel: "email",
  },
  {
    id: "HW-FF128Wh",
    date: "2025-07-13T10:00:00",
    customer: "Alhaji Musa",
    phone: "08023456789",
    amount: 50000,
    method: "Transfer",
    items: [{ description: "Wholesale Order", qty: 1, price: 50000 }],
    status: "sent",
    channel: "whatsapp",
  },
  {
    id: "HW-GG445Ji",
    date: "2025-07-12T13:20:00",
    customer: "Funke Adesanya",
    phone: "09087654321",
    amount: 4200,
    method: "Cash",
    items: [{ description: "Tomato – Walk-in", qty: 1, price: 4200 }],
    status: "pending",
    channel: null,
  },
];

// ── WhatsApp Promo Templates ──────────────────────────────────
const PROMO_TEMPLATES = [
  {
    id: 1,
    icon: Zap,
    category: "Flash Sale",
    title: "Flash Sale – Limited Time",
    description: "Drive urgency for a short window sale",
    color: "#b8860b",
    bg: "rgba(184,134,11,0.1)",
    variables: ["businessName", "discount", "product", "endTime", "phone"],
    template: (v) =>
      `🔥 *FLASH SALE — TODAY ONLY!* 🔥

Hello valued customer!

We at *${v.businessName}* are offering an incredible deal just for you:

✅ *${v.discount}% OFF* on ${v.product}
⏰ Offer ends: *${v.endTime}*

Don't miss out! Order now before stock runs out.

📞 Call/WhatsApp: ${v.phone}

_Thank you for your continued support!_
_Powered by HussleWise_`,
  },
  {
    id: 2,
    icon: Package,
    category: "Restock Alert",
    title: "Fresh Stock Available",
    description: "Tell customers new goods have arrived",
    color: "#1c5b56",
    bg: "rgba(28,91,86,0.1)",
    variables: ["businessName", "product", "price", "phone"],
    template: (v) =>
      `📦 *FRESH STOCK ALERT!*

Hello! Good news from *${v.businessName}*:

✅ *${v.product}* is back in stock!
💰 Price: *${v.price}*

Fresh, quality goods available now. 
First come, first served — quantities are limited!

📞 To order, call/WhatsApp: ${v.phone}

_Thank you for choosing us!_
_Powered by HussleWise_`,
  },
  {
    id: 3,
    icon: Users,
    category: "Referral",
    title: "Refer a Friend & Earn",
    description: "Grow your customer base through referrals",
    color: "#2d5fa0",
    bg: "rgba(45,95,160,0.1)",
    variables: ["businessName", "reward", "phone"],
    template: (v) =>
      `🤝 *REFER A FRIEND — EARN REWARDS!*

Hello from *${v.businessName}*!

Do you know anyone who needs quality products?

👉 Refer a friend to us and *EARN ${v.reward}* off your next purchase!

How it works:
1. Share our contact with your friend
2. They buy from us and mention your name
3. You get your reward on your next order!

📞 Our number: ${v.phone}

_Thank you for spreading the word!_
_Powered by HussleWise_`,
  },
  {
    id: 4,
    icon: Star,
    category: "VIP Offer",
    title: "Special VIP Customer Deal",
    description: "Reward your best customers personally",
    color: "#7a3ea0",
    bg: "rgba(122,62,160,0.1)",
    variables: ["customerName", "businessName", "offer", "expiry", "phone"],
    template: (v) =>
      `⭐ *EXCLUSIVE VIP OFFER — JUST FOR YOU*

Dear *${v.customerName}*,

As one of our most valued customers, we have a special offer just for you from *${v.businessName}*:

🎁 *${v.offer}*

This offer is exclusively for you and expires on *${v.expiry}*.

📞 To redeem, call/WhatsApp us: ${v.phone}

_We appreciate your loyalty!_
_Powered by HussleWise_`,
  },
  {
    id: 5,
    icon: Truck,
    category: "Delivery Notice",
    title: "Your Order Is On The Way",
    description: "Keep customers informed about delivery",
    color: "#c07830",
    bg: "rgba(192,120,48,0.1)",
    variables: [
      "customerName",
      "businessName",
      "items",
      "driverPhone",
      "estimatedTime",
    ],
    template: (v) =>
      `🚚 *YOUR ORDER IS ON THE WAY!*

Hello *${v.customerName}*!

Great news from *${v.businessName}* — your order has been dispatched!

📦 Order: *${v.items}*
🕐 Estimated arrival: *${v.estimatedTime}*
📞 Driver contact: ${v.driverPhone}

Please ensure someone is available to receive the delivery.

_Thank you for shopping with us!_
_Powered by HussleWise_`,
  },
  {
    id: 6,
    icon: Gift,
    category: "Festive Promo",
    title: "Celebration / Festive Offer",
    description: "Eid, Christmas, Easter, end-of-month deals",
    color: "#b04a2f",
    bg: "rgba(176,74,47,0.1)",
    variables: ["businessName", "occasion", "offer", "validity", "phone"],
    template: (v) =>
      `🎉 *${v.occasion.toUpperCase()} SPECIAL OFFER!*

Greetings from *${v.businessName}*!

We are celebrating *${v.occasion}* with an amazing offer for you:

🛍️ *${v.offer}*

Valid until: *${v.validity}*

Come in, call, or WhatsApp us to take advantage of this offer before it's gone!

📞 ${v.phone}

_From our family to yours — Happy ${v.occasion}!_
_Powered by HussleWise_`,
  },
  {
    id: 7,
    icon: RefreshCw,
    category: "Follow-Up",
    title: "We Miss You — Come Back!",
    description: "Re-engage customers who haven't bought recently",
    color: "#3a7a6e",
    bg: "rgba(58,122,110,0.1)",
    variables: ["customerName", "businessName", "incentive", "phone"],
    template: (v) =>
      `👋 *WE MISS YOU, ${v.customerName.toUpperCase()}!*

It's been a while since we last saw you at *${v.businessName}*.

We would love to have you back! As a special welcome back gift:

🎁 *${v.incentive}* on your next purchase

Just mention this message when you order!

📞 Call/WhatsApp: ${v.phone}

_We're always here for you._
_Powered by HussleWise_`,
  },
  {
    id: 8,
    icon: Banknote,
    category: "Debt Reminder",
    title: "Friendly Payment Reminder",
    description: "Politely remind customers about outstanding balance",
    color: "#8c4a1a",
    bg: "rgba(140,74,26,0.1)",
    variables: ["customerName", "businessName", "amount", "dueDate", "phone"],
    template: (v) =>
      `📋 *FRIENDLY PAYMENT REMINDER*

Dear *${v.customerName}*,

We hope you are doing well!

This is a gentle reminder from *${v.businessName}* that you have an outstanding balance of:

💰 *${v.amount}*
📅 Due by: *${v.dueDate}*

Kindly make payment at your earliest convenience. If you have any questions, please don't hesitate to reach out.

📞 ${v.phone}

_Thank you for your prompt attention!_
_Powered by HussleWise_`,
  },
];

const STATUS_META = {
  sent: {
    label: "Sent",
    color: "#1c5b56",
    bg: "rgba(28,91,86,0.1)",
    Icon: CheckCircle,
  },
  viewed: {
    label: "Viewed",
    color: "#2d5fa0",
    bg: "rgba(45,95,160,0.1)",
    Icon: Eye,
  },
  downloaded: {
    label: "Downloaded",
    color: "#7a3ea0",
    bg: "rgba(122,62,160,0.1)",
    Icon: Download,
  },
  pending: {
    label: "Not Sent",
    color: "#b04a2f",
    bg: "rgba(176,74,47,0.1)",
    Icon: Clock,
  },
};

const CHANNEL_META = {
  whatsapp: { label: "WhatsApp", Icon: MessageCircle, color: "#25D366" },
  email: { label: "Email", Icon: Mail, color: "#2d5fa0" },
  download: { label: "Download", Icon: Download, color: "#7a3ea0" },
};

/* ─────────────────────────────────────────────────────────────
   RECEIPT DETAIL DRAWER
───────────────────────────────────────────────────────────── */
function ReceiptDrawer({ receipt, onClose }) {
  const status = STATUS_META[receipt.status] || STATUS_META.pending;
  const channel = receipt.channel ? CHANNEL_META[receipt.channel] : null;

  const waText = encodeURIComponent(
    `*RECEIPT FROM YOUR BUSINESS*\n\nReceipt #: ${receipt.id}\nDate: ${fmtDate(
      receipt.date
    )}\n\nCustomer: ${receipt.customer}\n\nITEMS:\n${receipt.items
      .map(
        (i) =>
          `${i.description} — ${i.qty} x ${fmt(i.price)} = ${fmt(
            i.qty * i.price
          )}`
      )
      .join("\n")}\n\n*TOTAL: ${fmt(receipt.amount)}*\nPayment: ${
      receipt.method
    }\n\nThank you for your business!\nPowered by HussleWise`
  );

  return (
    <div
      className="rp-drawer-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rp-drawer">
        <div className="rp-drawer-header">
          <div>
            <div className="rp-drawer-eyebrow">Receipt</div>
            <div className="rp-drawer-id">{receipt.id}</div>
          </div>
          <button className="rp-drawer-close" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Status + channel */}
        <div className="rp-drawer-badges">
          <span
            className="rp-status-pill"
            style={{ background: status.bg, color: status.color }}
          >
            <status.Icon size={12} /> {status.label}
          </span>
          {channel && (
            <span className="rp-channel-pill" style={{ color: channel.color }}>
              <channel.Icon size={12} /> {channel.label}
            </span>
          )}
        </div>

        {/* Receipt document */}
        <div className="rp-receipt-doc">
          <div className="rp-doc-header">
            <div className="rp-doc-brand">HussleWise</div>
            <div className="rp-doc-meta">
              <div className="rp-doc-date">
                <Calendar size={12} /> {fmtDate(receipt.date)}
              </div>
              <div className="rp-doc-time">
                <Clock size={12} /> {fmtTime(receipt.date)}
              </div>
            </div>
          </div>

          <div className="rp-doc-customer">
            <div className="rp-doc-section-label">Billed To</div>
            <div className="rp-doc-customer-name">{receipt.customer}</div>
            {receipt.phone && (
              <div className="rp-doc-customer-phone">
                <Phone size={11} /> {receipt.phone}
              </div>
            )}
          </div>

          <div className="rp-doc-items">
            <div className="rp-doc-section-label">Items</div>
            <div className="rp-doc-items-table">
              <div className="rp-doc-items-head">
                <span>Description</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {receipt.items.map((item, i) => (
                <div key={i} className="rp-doc-items-row">
                  <span>{item.description}</span>
                  <span>{item.qty}</span>
                  <span>{fmt(item.price)}</span>
                  <span>{fmt(item.qty * item.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rp-doc-total-row">
            <span>Total Amount</span>
            <span className="rp-doc-total-value">{fmt(receipt.amount)}</span>
          </div>
          <div className="rp-doc-method">
            Payment:{" "}
            <strong>{METHOD_MAP[receipt.method] || receipt.method}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="rp-drawer-actions">
          <div className="rp-drawer-action-label">Resend Receipt</div>
          <div className="rp-drawer-ctas">
            {receipt.phone && (
              <a
                className="rp-cta rp-cta--wa"
                href={`https://wa.me/234${receipt.phone.slice(
                  1
                )}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            <button
              className="rp-cta rp-cta--copy"
              onClick={() => {
                navigator.clipboard?.writeText(decodeURIComponent(waText));
              }}
            >
              <Copy size={15} /> Copy Text
            </button>
            <button className="rp-cta rp-cta--download">
              <Download size={15} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROMO TEMPLATE COMPOSER
───────────────────────────────────────────────────────────── */
const VAR_LABELS = {
  businessName: "Your Business Name",
  discount: "Discount % (e.g. 20)",
  product: "Product / Service Name",
  endTime: "End Time (e.g. 6pm today)",
  phone: "Your Phone / WhatsApp",
  price: "Price (e.g. ₦5,000 per bag)",
  reward: "Reward (e.g. ₦500)",
  customerName: "Customer's Name",
  offer: "Offer Description",
  expiry: "Expiry Date",
  items: "Item(s) Ordered",
  driverPhone: "Driver's Phone Number",
  estimatedTime: "Estimated Arrival",
  occasion: "Occasion (e.g. Eid, Christmas)",
  validity: "Valid Until (e.g. Sunday)",
  incentive: "Incentive (e.g. 10% off)",
  amount: "Amount Owed (e.g. ₦12,000)",
  dueDate: "Due Date",
};

function TemplateComposer({ template, onClose }) {
  const [vars, setVars] = useState(
    Object.fromEntries(template.variables.map((v) => [v, ""]))
  );
  const [copied, setCopied] = useState(false);

  const preview = template.template(vars);

  const waLink =
    template.variables.includes("phone") && vars.phone
      ? `https://wa.me/?text=${encodeURIComponent(preview)}`
      : `https://wa.me/?text=${encodeURIComponent(preview)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const IconComp = template.icon;

  return (
    <div
      className="rp-composer-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rp-composer">
        <div
          className="rp-composer-header"
          style={{ borderColor: template.color + "33" }}
        >
          <div className="rp-composer-header-left">
            <div
              className="rp-composer-icon"
              style={{ background: template.bg, color: template.color }}
            >
              <IconComp size={18} />
            </div>
            <div>
              <div className="rp-composer-title">{template.title}</div>
              <div className="rp-composer-cat">{template.category}</div>
            </div>
          </div>
          <button className="rp-drawer-close" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="rp-composer-body">
          {/* Variables */}
          <div className="rp-composer-fields">
            <div className="rp-composer-section-label">
              <Edit3 size={13} /> Fill in your details
            </div>
            <div className="rp-composer-grid">
              {template.variables.map((v) => (
                <div key={v} className="rp-composer-field">
                  <label className="rp-composer-label">
                    {VAR_LABELS[v] || v}
                  </label>
                  <input
                    className="rp-composer-input"
                    placeholder={VAR_LABELS[v] || v}
                    value={vars[v]}
                    onChange={(e) =>
                      setVars((prev) => ({ ...prev, [v]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="rp-composer-preview-wrap">
            <div className="rp-composer-section-label">
              <Eye size={13} /> Live Preview
            </div>
            <div className="rp-composer-preview">
              <div className="rp-wa-bubble">
                <pre className="rp-wa-text">{preview}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="rp-composer-footer">
          <button className="rp-cta rp-cta--copy" onClick={handleCopy}>
            {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
            {copied ? "Copied!" : "Copy Message"}
          </button>
          <a
            className="rp-cta rp-cta--wa"
            href={waLink}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={15} /> Send via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function ReceiptsPromos() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("receipts"); // receipts | promos
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [promoSearch, setPromoSearch] = useState("");

  // ── Stats ──────────────────────────────────────────────────
  const totalSent = MOCK_RECEIPTS.filter((r) => r.status === "sent").length;
  const totalRevenue = MOCK_RECEIPTS.reduce((s, r) => s + r.amount, 0);
  const waCount = MOCK_RECEIPTS.filter((r) => r.channel === "whatsapp").length;
  const pendingCount = MOCK_RECEIPTS.filter(
    (r) => r.status === "pending"
  ).length;

  // ── Filtered receipts ──────────────────────────────────────
  const filteredReceipts = useMemo(() => {
    return MOCK_RECEIPTS.filter((r) => {
      const q = search.toLowerCase();
      if (
        q &&
        !r.customer.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q)
      )
        return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (filterChannel !== "All" && r.channel !== filterChannel) return false;
      return true;
    });
  }, [search, filterStatus, filterChannel]);

  // ── Filtered promo templates ───────────────────────────────
  const filteredTemplates = useMemo(() => {
    const q = promoSearch.toLowerCase();
    if (!q) return PROMO_TEMPLATES;
    return PROMO_TEMPLATES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [promoSearch]);

  return (
    <div className="rp-root">
      {/* ── MODALS ── */}
      {selectedReceipt && (
        <ReceiptDrawer
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
      {selectedTemplate && (
        <TemplateComposer
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="rp-header">
        <div className="rp-header-left">
          <span className="rp-breadcrumb">
            Dashboard › Receipts &amp; Promos
          </span>
          <h1 className="rp-title">Receipts &amp; Promos</h1>
          <p className="rp-subtitle">
            WhatsApp receipts, history &amp; promotion templates
          </p>
        </div>
        <button
          className="rp-btn-new"
          onClick={() => navigate("/send-receipt")}
        >
          <Plus size={16} /> New Receipt
        </button>
      </div>

      {/* ── STAT STRIP ── */}
      <div className="rp-stats-row">
        <div className="rp-stat">
          <div className="rp-stat-icon">
            <FileText size={16} />
          </div>
          <div className="rp-stat-value">{MOCK_RECEIPTS.length}</div>
          <div className="rp-stat-label">Total Receipts</div>
        </div>
        <div className="rp-stat-divider" />
        <div className="rp-stat">
          <div className="rp-stat-icon">
            <CheckCircle size={16} />
          </div>
          <div className="rp-stat-value">{totalSent}</div>
          <div className="rp-stat-label">Sent</div>
        </div>
        <div className="rp-stat-divider" />
        <div className="rp-stat">
          <div className="rp-stat-icon rp-stat-icon--green">
            <TrendingUp size={16} />
          </div>
          <div className="rp-stat-value">{fmt(totalRevenue)}</div>
          <div className="rp-stat-label">Total Invoiced</div>
        </div>
        <div className="rp-stat-divider" />
        <div className="rp-stat">
          <div className="rp-stat-icon rp-stat-icon--wa">
            <MessageCircle size={16} />
          </div>
          <div className="rp-stat-value">{waCount}</div>
          <div className="rp-stat-label">Via WhatsApp</div>
        </div>
        <div className="rp-stat-divider" />
        <div className="rp-stat">
          <div
            className={`rp-stat-icon ${
              pendingCount > 0 ? "rp-stat-icon--warn" : ""
            }`}
          >
            <Clock size={16} />
          </div>
          <div
            className={`rp-stat-value ${
              pendingCount > 0 ? "rp-stat-value--warn" : ""
            }`}
          >
            {pendingCount}
          </div>
          <div className="rp-stat-label">Not Sent Yet</div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="rp-tab-bar">
        <button
          className={`rp-tab ${
            activeTab === "receipts" ? "rp-tab--active" : ""
          }`}
          onClick={() => setActiveTab("receipts")}
        >
          <Receipt size={15} /> Receipt History
        </button>
        <button
          className={`rp-tab ${activeTab === "promos" ? "rp-tab--active" : ""}`}
          onClick={() => setActiveTab("promos")}
        >
          <Megaphone size={15} /> Promo Templates
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          RECEIPTS TAB
      ══════════════════════════════════════════════════════ */}
      {activeTab === "receipts" && (
        <div className="rp-receipts-panel">
          {/* Toolbar */}
          <div className="rp-toolbar">
            <div className="rp-search-wrap">
              <Search size={14} className="rp-search-ico" />
              <input
                className="rp-search"
                placeholder="Search customer or receipt ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rp-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <select
              className="rp-select"
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
            >
              <option value="All">All Channels</option>
              {Object.entries(CHANNEL_META).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Receipt list */}
          <div className="rp-receipt-list">
            {filteredReceipts.length === 0 ? (
              <div className="rp-empty">
                <FileText size={38} strokeWidth={1.2} />
                <p>No receipts found.</p>
                <button
                  className="rp-empty-cta"
                  onClick={() => navigate("/send-receipt")}
                >
                  <Plus size={13} /> Create your first receipt
                </button>
              </div>
            ) : (
              filteredReceipts.map((r) => {
                const status = STATUS_META[r.status] || STATUS_META.pending;
                const channel = r.channel ? CHANNEL_META[r.channel] : null;
                return (
                  <div
                    key={r.id}
                    className="rp-receipt-row"
                    onClick={() => setSelectedReceipt(r)}
                  >
                    {/* Left accent */}
                    <div
                      className="rp-receipt-bar"
                      style={{ background: status.color }}
                    />

                    {/* Icon */}
                    <div
                      className="rp-receipt-ico"
                      style={{ background: status.bg, color: status.color }}
                    >
                      <Receipt size={17} />
                    </div>

                    {/* Info */}
                    <div className="rp-receipt-info">
                      <div className="rp-receipt-name-row">
                        <span className="rp-receipt-customer">
                          {r.customer}
                        </span>
                        <span className="rp-receipt-id">{r.id}</span>
                      </div>
                      <div className="rp-receipt-meta">
                        <span className="rp-receipt-date">
                          <Calendar size={11} /> {fmtDate(r.date)}
                        </span>
                        <span className="rp-receipt-time">
                          <Clock size={11} /> {fmtTime(r.date)}
                        </span>
                        {r.method && (
                          <span className="rp-receipt-method">{r.method}</span>
                        )}
                        {channel && (
                          <span
                            className="rp-receipt-channel"
                            style={{ color: channel.color }}
                          >
                            <channel.Icon size={11} /> {channel.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: amount + status */}
                    <div className="rp-receipt-right">
                      <div className="rp-receipt-amount">{fmt(r.amount)}</div>
                      <span
                        className="rp-status-pill"
                        style={{ background: status.bg, color: status.color }}
                      >
                        <status.Icon size={10} /> {status.label}
                      </span>
                    </div>

                    <ChevronRight size={16} className="rp-receipt-chevron" />
                  </div>
                );
              })
            )}
          </div>

          <div className="rp-list-footer">
            Showing {filteredReceipts.length} of {MOCK_RECEIPTS.length} receipts
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PROMOS TAB
      ══════════════════════════════════════════════════════ */}
      {activeTab === "promos" && (
        <div className="rp-promos-panel">
          <div className="rp-promos-intro">
            <Megaphone size={15} />
            <span>
              Choose a template, fill in your details, and send directly to your
              customers via WhatsApp. All messages are in plain text and
              formatted for Nigerian mobile users.
            </span>
          </div>

          {/* Promo search */}
          <div className="rp-promo-search-wrap">
            <Search size={14} className="rp-search-ico" />
            <input
              className="rp-search rp-search--wide"
              placeholder="Search templates (e.g. flash sale, reminder, delivery…)"
              value={promoSearch}
              onChange={(e) => setPromoSearch(e.target.value)}
            />
          </div>

          {/* Template grid */}
          <div className="rp-template-grid">
            {filteredTemplates.map((t) => {
              const IconComp = t.icon;
              return (
                <div
                  key={t.id}
                  className="rp-template-card"
                  onClick={() => setSelectedTemplate(t)}
                >
                  <div
                    className="rp-template-icon"
                    style={{ background: t.bg, color: t.color }}
                  >
                    <IconComp size={22} />
                  </div>
                  <div className="rp-template-cat" style={{ color: t.color }}>
                    {t.category}
                  </div>
                  <div className="rp-template-title">{t.title}</div>
                  <div className="rp-template-desc">{t.description}</div>
                  <div className="rp-template-vars">
                    {t.variables.slice(0, 3).map((v) => (
                      <span key={v} className="rp-template-var-pill">
                        {VAR_LABELS[v]?.split(" ")[0] || v}
                      </span>
                    ))}
                    {t.variables.length > 3 && (
                      <span className="rp-template-var-pill">
                        +{t.variables.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="rp-template-footer">
                    <span className="rp-template-use">
                      <MessageCircle size={13} /> Use Template
                    </span>
                    <ChevronRight size={14} className="rp-template-chevron" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="rp-empty">
              <Megaphone size={36} strokeWidth={1.2} />
              <p>No templates match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
