import { useEffect, useRef, useState } from "react";
import "./Features.css";

const NAV_TABS = ["Financial", "Customers", "Growth", "Compliance"];

const FEATURES = [
  {
    tab: "Financial",
    label: "01",
    headline: "Your Money,\nClearly Tracked",
    subhead: "Financial Tracking",
    description:
      "Say goodbye to paper records and guesswork. HustleWise turns every sale and expense into clean, actionable data — in plain language you actually understand.",
    accent: "#1C5B56",
    items: [
      {
        title: "Money In / Money Out",
        body: "Log every sale and expense in seconds. No accounting jargon — just simple labels that make sense for your hustle.",
        stat: "₦ 0 hidden fees",
      },
      {
        title: "Daily Sales Entry",
        body: "Quick-tap mode lets you record cash, transfer, or POS payments on the go — even in the middle of a busy market day.",
        stat: "< 10 sec per entry",
      },
      {
        title: "Visual Reports",
        body: "Weekly and monthly charts show exactly where your money comes from and where it goes. Spot your best days instantly.",
        stat: "30-day cashflow at a glance",
      },
      {
        title: "Profit vs Loss",
        body: "Know your real take-home after every expense. HustleWise calculates your net profit automatically, no spreadsheet needed.",
        stat: "Auto-calculated daily",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=900&q=80",
    imageAlt: "Entrepreneur tracking finances on phone",
  },
  {
    tab: "Customers",
    label: "02",
    headline: "Know Your\nCustomers Better",
    subhead: "Customer Management",
    description:
      "Every customer is a relationship. Store their details, track what they buy, and reach them on WhatsApp with professional receipts and promotions — all in one place.",
    accent: "#C4873B",
    items: [
      {
        title: "Customer Database",
        body: "Store names, phone numbers, and purchase history. Find any customer in seconds and see exactly what they bought and when.",
        stat: "Unlimited contacts",
      },
      {
        title: "WhatsApp Receipts",
        body: "Generate a professional receipt and send it directly via WhatsApp in one tap. Your customers see you as serious.",
        stat: "Sent in 1 tap",
      },
      {
        title: "Follow-up Reminders",
        body: "Get nudged when it's time to restock a customer's usual order or send a promo. Never let a customer go cold.",
        stat: "Smart alerts",
      },
      {
        title: "Promo Templates",
        body: "Ready-made WhatsApp promotion templates — just fill in your offer and hit send. Flash sales, restocks, specials.",
        stat: "10+ templates included",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    imageAlt: "Business owner sending receipt on phone",
  },
  {
    tab: "Growth",
    label: "03",
    headline: "Insights That\nGrow Your Hustle",
    subhead: "Business Growth",
    description:
      "HustleWise acts as your personal AI business coach. It analyzes your patterns, flags problems early, and tells you exactly what to do to make more money.",
    accent: "#1C5B56",
    items: [
      {
        title: "AI Sales Insights",
        body: '"Your best day is Saturday — stock up on Fridays." Real, plain-English advice based on your actual numbers.',
        stat: "Powered by AI",
      },
      {
        title: "Business Health Score",
        body: "A 0–100 score based on how consistently you track, send receipts, and grow your customer base. Higher scores unlock microloans.",
        stat: "Score updates weekly",
      },
      {
        title: "Expense Alerts",
        body: '"Your fuel costs are 20% higher this month." Spot spending spikes before they eat into your profits.',
        stat: "Real-time alerts",
      },
      {
        title: "Microloan Access",
        body: "After 3 months of consistent tracking, HustleWise can show lenders your financial history to unlock working capital.",
        stat: "From ₦50,000",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
    imageAlt: "Charts and business growth analytics",
  },
  {
    tab: "Compliance",
    label: "04",
    headline: "Go Official,\nStress-Free",
    subhead: "Official Documentation",
    description:
      "From CAC registration to tax-ready reports, HustleWise helps you formalize your business without the confusion, middlemen, or hidden costs.",
    accent: "#C4873B",
    items: [
      {
        title: "CAC Registration",
        body: "Search for your business name, upload documents, pay securely — and track your registration status all inside the app.",
        stat: "End-to-end in-app",
      },
      {
        title: "Digital Receipts",
        body: "Branded receipt templates with your business name and logo. Look professional from day one.",
        stat: "5 free / month",
      },
      {
        title: "Tax Preparation",
        body: "Export your financial history in accountant-ready format. No more scrambling at year-end.",
        stat: "One-click export",
      },
      {
        title: "Trusted Badge",
        body: "Registered businesses earn a Verified badge on the HustleWise Marketplace, boosting customer trust.",
        stat: "Visible to buyers",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
    imageAlt: "Professional business registration documents",
  },
];

const STATS = [
  { value: "50K+", label: "Active Entrepreneurs" },
  { value: "₦2B+", label: "Transactions Tracked" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "3 min", label: "Average Onboarding" },
];

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.key]: true,
            }));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  const observe = (key) => (el) => {
    sectionRefs.current[key] = el;
    if (el) el.dataset.key = key;
  };

  const switchTab = (i) => {
    if (i === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(i);
      setAnimating(false);
    }, 220);
  };

  const feature = FEATURES[activeTab];

  return (
    <div className="fp-root">
      {/* ── HERO ── */}
      <section className="fp-hero" ref={observe("hero")}>
        <div className={`fp-hero-inner ${visible["hero"] ? "fp-visible" : ""}`}>
          <div className="fp-hero-text">
            <span className="fp-eyebrow">Built for Nigerian Entrepreneurs</span>
            <h1 className="fp-hero-h1">
              Every Tool Your
              <br />
              <em>Hustle Needs</em>
            </h1>
            <p className="fp-hero-desc">
              HustleWise replaces the notebook, the middleman, and the
              guesswork. Manage money, customers, and your business reputation —
              all in one app, built for how Nigeria actually works.
            </p>
            <div className="fp-hero-cta">
              <button className="fp-btn-primary">Start Free Trial</button>
              <button className="fp-btn-ghost">See Pricing →</button>
            </div>
          </div>
          <div className="fp-hero-img-wrap">
            <div className="fp-hero-badge">
              Trusted by 50,000+ Entrepreneurs
            </div>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
              alt="Nigerian entrepreneur using HustleWise"
              className="fp-hero-img"
            />
            <div className="fp-hero-pill">
              <span className="fp-pill-dot" />
              ₦15,000 earned today
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="fp-stats" ref={observe("stats")}>
        <div
          className={`fp-stats-inner ${visible["stats"] ? "fp-visible" : ""}`}
        >
          {STATS.map((s, i) => (
            <div className="fp-stat" key={i} style={{ "--d": `${i * 0.12}s` }}>
              <span className="fp-stat-val">{s.value}</span>
              <span className="fp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <section className="fp-tabs-section" ref={observe("tabs")}>
        <div className="fp-tabs-header">
          <div className="fp-tabs-nav">
            {NAV_TABS.map((t, i) => (
              <button
                key={t}
                className={`fp-tab-btn ${
                  i === activeTab ? "fp-tab-active" : ""
                }`}
                onClick={() => switchTab(i)}
              >
                <span className="fp-tab-num">0{i + 1}</span>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`fp-feature-panel ${
            animating ? "fp-panel-exit" : "fp-panel-enter"
          }`}
        >
          <div className="fp-panel-left">
            <span className="fp-panel-label">{feature.subhead}</span>
            <h2 className="fp-panel-h2">
              {feature.headline.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h2>
            <p className="fp-panel-desc">{feature.description}</p>
            <div className="fp-cards">
              {feature.items.map((item, i) => (
                <div
                  className="fp-card"
                  key={i}
                  style={{ "--d": `${i * 0.08}s` }}
                >
                  <div className="fp-card-top">
                    <h3 className="fp-card-title">{item.title}</h3>
                    <span className="fp-card-stat">{item.stat}</span>
                  </div>
                  <p className="fp-card-body">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="fp-panel-right">
            <div className="fp-panel-img-frame">
              <img
                src={feature.image}
                alt={feature.imageAlt}
                className="fp-panel-img"
              />
              <div
                className="fp-img-overlay"
                style={{ "--accent": feature.accent }}
              />
              <div className="fp-img-badge">{feature.label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="fp-how" ref={observe("how")}>
        <div className={`fp-how-inner ${visible["how"] ? "fp-visible" : ""}`}>
          <div className="fp-how-header">
            <span className="fp-eyebrow">The Process</span>
            <h2 className="fp-how-h2">From First Log to Formal Business</h2>
          </div>
          <div className="fp-steps">
            {[
              {
                n: "01",
                title: "Download & Register",
                body: "Sign up with your phone number. No bank card needed to get started.",
              },
              {
                n: "02",
                title: "Log Your First Sale",
                body: "Add any amount — cash, transfer, or POS. Takes under 10 seconds.",
              },
              {
                n: "03",
                title: "Watch Patterns Emerge",
                body: "After a week, HustleWise shows your best days, biggest costs, and growth gaps.",
              },
              {
                n: "04",
                title: "Go Official",
                body: "Register with CAC, earn your Verified badge, and access microloans.",
              },
            ].map((step, i) => (
              <div
                className="fp-step"
                key={i}
                style={{ "--d": `${i * 0.15}s` }}
              >
                <div className="fp-step-num">{step.n}</div>
                <div className="fp-step-line" />
                <h3 className="fp-step-title">{step.title}</h3>
                <p className="fp-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section className="fp-testimonial" ref={observe("test")}>
        <div className={`fp-test-inner ${visible["test"] ? "fp-visible" : ""}`}>
          <blockquote className="fp-quote">
            "Before HustleWise I didn't know if I was making profit or loss. Now
            I know my numbers every single day."
          </blockquote>
          <cite className="fp-cite">
            — Mama Nkechi, Tomato Seller · Ojota Market, Lagos
          </cite>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="fp-pricing" ref={observe("pricing")}>
        <div
          className={`fp-pricing-inner ${
            visible["pricing"] ? "fp-visible" : ""
          }`}
        >
          <div className="fp-price-card fp-price-free">
            <span className="fp-price-tag">Free</span>
            <h3>Get Started</h3>
            <ul>
              <li>Basic sales & expense tracking</li>
              <li>5 digital receipts / month</li>
              <li>Customer database (up to 20)</li>
              <li>Weekly cashflow summary</li>
            </ul>
            <button className="fp-btn-primary" style={{ marginTop: "auto" }}>
              Start for Free
            </button>
          </div>
          <div className="fp-price-card fp-price-pro">
            <span className="fp-price-tag">₦1,000 / month</span>
            <h3>Pro Hustle</h3>
            <ul>
              <li>Unlimited receipts & customers</li>
              <li>AI growth tips & alerts</li>
              <li>CAC registration (discounted)</li>
              <li>Marketplace listing</li>
              <li>Microloan eligibility</li>
              <li>WhatsApp promo templates</li>
            </ul>
            <button className="fp-btn-light" style={{ marginTop: "auto" }}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="fp-cta" ref={observe("cta")}>
        <div className={`fp-cta-inner ${visible["cta"] ? "fp-visible" : ""}`}>
          <span className="fp-eyebrow fp-eyebrow-light">Join the Movement</span>
          <h2 className="fp-cta-h2">
            Your business deserves
            <br />
            <em>better tools.</em>
          </h2>
          <p className="fp-cta-p">
            50,000 Nigerian entrepreneurs already growing with HustleWise. Start
            tracking today — free, forever.
          </p>
          <div className="fp-cta-btns">
            <button className="fp-btn-cta">Download the App</button>
            <span className="fp-cta-sub">
              Available on iOS & Android · No card required
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
