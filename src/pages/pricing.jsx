import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './pricing.css';

const PLANS = [
  {
    id: 'free',
    label: '01',
    name: 'Starter',
    price: 'Free',
    period: null,
    tagline: 'Get your hustle off the ground',
    cta: 'Start for Free',
    ctaType: 'ghost',
    highlight: false,
    features: [
      { text: 'Up to 50 transactions / month', included: true },
      { text: '5 customer records', included: true },
      { text: 'Basic cashflow summary', included: true },
      { text: 'Mobile app access', included: true },
      { text: '5 digital receipts / month', included: true },
      { text: 'WhatsApp receipts', included: false },
      { text: 'AI growth insights', included: false },
      { text: 'CAC registration support', included: false },
      { text: 'Marketplace listing', included: false },
      { text: 'Microloan eligibility', included: false },
    ],
  },
  {
    id: 'pro',
    label: '02',
    name: 'Pro Hustle',
    price: '₦1,000',
    period: '/month',
    tagline: 'For the serious entrepreneur',
    cta: 'Start Pro Trial',
    ctaType: 'primary',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited transactions', included: true },
      { text: 'Unlimited customer records', included: true },
      { text: 'Full cashflow & analytics', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Unlimited digital receipts', included: true },
      { text: 'WhatsApp receipts & promos', included: true },
      { text: 'AI growth insights & alerts', included: true },
      { text: 'CAC registration (discounted)', included: true },
      { text: 'Marketplace listing', included: true },
      { text: 'Microloan eligibility', included: true },
    ],
  },
  {
    id: 'enterprise',
    label: '03',
    name: 'Enterprise',
    price: 'Custom',
    period: null,
    tagline: 'Built around your operation',
    cta: 'Contact Sales',
    ctaType: 'outline',
    highlight: false,
    features: [
      { text: 'Everything in Pro Hustle', included: true },
      { text: 'Multiple business profiles', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations (API)', included: true },
      { text: '24/7 phone & chat support', included: true },
      { text: 'Priority CAC processing', included: true },
      { text: 'Team access (up to 10)', included: true },
      { text: 'Branded app experience', included: true },
      { text: 'Custom reporting', included: true },
      { text: 'SLA guarantee', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes — upgrade or downgrade at any time. Changes take effect immediately, and we prorate your billing automatically.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: "Absolutely. Every new account gets 7 days of Pro features, no card required. Downgrade to Starter if you don't upgrade.",
  },
  {
    q: 'How do I pay?',
    a: 'We accept debit cards, bank transfers, and USSD payments. Pro subscriptions are billed monthly with no annual lock-in.',
  },
  {
    q: 'Is my business data safe?',
    a: 'Your data is encrypted with bank-level security. We never sell or share your information with third parties.',
  },
  {
    q: 'What makes me eligible for a microloan?',
    a: 'After 3 months of consistent tracking on a Pro plan, HustleWise calculates your Business Health Score and presents microloan offers from partner lenders.',
  },
  {
    q: 'Does the free plan have ads?',
    a: 'Never. HustleWise is ad-free on all plans. We earn through subscriptions, not your attention.',
  },
];

const GUARANTEES = [
  { num: '7', unit: 'days', label: 'Free Pro trial for new accounts' },
  { num: '30', unit: 'day', label: 'Money-back guarantee, no questions' },
  { num: '256', unit: 'bit', label: 'Bank-level encryption on all data' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible((p) => ({ ...p, [e.target.dataset.key]: true }));
        }),
      { threshold: 0.12 }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const observe = (key) => (el) => {
    refs.current[key] = el;
    if (el) el.dataset.key = key;
  };

  return (
    <div className="pp-root">

      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-hero-inner">
          <span className="pp-eyebrow">Transparent Pricing</span>
          <h1 className="pp-hero-h1">
            Pay for what<br />
            <em>your hustle needs.</em>
          </h1>
          <p className="pp-hero-desc">
            No hidden fees, no confusing tiers. One free plan to get started,
            one powerful Pro plan to grow — and Enterprise when you're ready to scale.
          </p>
          <div className="pp-hero-meta">
            <span className="pp-hero-chip">✓ No card required</span>
            <span className="pp-hero-chip">✓ Cancel anytime</span>
            <span className="pp-hero-chip">✓ 7-day Pro trial</span>
          </div>
        </div>
        <div className="pp-hero-scroll">
          <span>Scroll to compare plans</span>
          <div className="pp-scroll-line" />
        </div>
      </section>

      {/* ── PLAN CARDS ── */}
      <section className="pp-plans-section" ref={observe('plans')}>
        <div className={`pp-plans-inner ${visible['plans'] ? 'pp-vis' : ''}`}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`pp-plan ${plan.highlight ? 'pp-plan--highlight' : ''}`}
              style={{ ['--di']: i }}
            >
              {plan.badge && (
                <div className="pp-plan-badge">{plan.badge}</div>
              )}
              <div className="pp-plan-top">
                <span className="pp-plan-num">{plan.label}</span>
                <h2 className="pp-plan-name">{plan.name}</h2>
                <p className="pp-plan-tagline">{plan.tagline}</p>
              </div>

              <div className="pp-plan-price">
                <span className="pp-price-amount">{plan.price}</span>
                {plan.period && (
                  <span className="pp-price-period">{plan.period}</span>
                )}
              </div>

              <ul className="pp-feature-list">
                {plan.features.map((f, fi) => (
                  <li
                    key={fi}
                    className={`pp-feat ${f.included ? 'pp-feat--on' : 'pp-feat--off'}`}
                  >
                    <span className="pp-feat-dot" />
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.id === 'enterprise' ? (
                <Link to="/support">
                  <button className={`pp-plan-btn pp-plan-btn--${plan.ctaType}`}>
                    {plan.cta}
                  </button>
                </Link>
              ) : (
                <button className={`pp-plan-btn pp-plan-btn--${plan.ctaType}`}>
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON FOOTNOTE ── */}
      <div className="pp-footnote">
        All prices in Nigerian Naira (₦) · Billed monthly · No annual commitment required
      </div>

      {/* ── GUARANTEES ── */}
      <section className="pp-guarantees" ref={observe('guar')}>
        <div className={`pp-guar-inner ${visible['guar'] ? 'pp-vis' : ''}`}>
          <span className="pp-eyebrow">Our Promise</span>
          <h2 className="pp-guar-h2">Buy with confidence.</h2>
          <div className="pp-guar-grid">
            {GUARANTEES.map((g, i) => (
              <div className="pp-guar-card" key={i} style={{ ['--di']: i }}>
                <div className="pp-guar-num">
                  {g.num}
                  <span className="pp-guar-unit">{g.unit}</span>
                </div>
                <p className="pp-guar-label">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="pp-for-section" ref={observe('for')}>
        <div className={`pp-for-inner ${visible['for'] ? 'pp-vis' : ''}`}>
          <div className="pp-for-text">
            <span className="pp-eyebrow">Who It's For</span>
            <h2 className="pp-for-h2">
              Built for every<br /><em>kind of hustle.</em>
            </h2>
            <p className="pp-for-desc">
              Whether you sell tomatoes at Ojota Market, run a fashion brand from
              Yaba, or manage a growing logistics company — HustleWise scales
              with you. Start free. Grow into Pro. Never pay for what you don't use.
            </p>
            <div className="pp-for-list">
              {[
                'Market traders & street vendors',
                'Freelancers & service providers',
                'Fashion, beauty & lifestyle brands',
                'Food & catering businesses',
                'Logistics & delivery operators',
                'Growing SMEs seeking formalization',
              ].map((item, i) => (
                <div className="pp-for-item" key={i}>
                  <span className="pp-for-arrow">→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="pp-for-visual">
            <img
              src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=700&q=80"
              alt="Nigerian entrepreneurs using HustleWise"
              className="pp-for-img"
            />
            <div className="pp-for-float">
              <div className="pp-float-label">Business Health Score</div>
              <div className="pp-float-score">
                <div className="pp-score-ring">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" className="pp-ring-bg" />
                    <circle
                      cx="40" cy="40" r="32"
                      className="pp-ring-fill"
                      strokeDasharray="201"
                      strokeDashoffset="50"
                    />
                  </svg>
                  <span className="pp-score-num">78</span>
                </div>
                <div className="pp-score-meta">
                  <span className="pp-score-status">Good standing</span>
                  <span className="pp-score-sub">↑ 12 pts this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pp-faq" ref={observe('faq')}>
        <div className={`pp-faq-inner ${visible['faq'] ? 'pp-vis' : ''}`}>
          <div className="pp-faq-header">
            <span className="pp-eyebrow">Got Questions?</span>
            <h2 className="pp-faq-h2">We've got answers.</h2>
          </div>
          <div className="pp-faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`pp-faq-item ${openFaq === i ? 'pp-faq-open' : ''}`}
                style={{ ['--di']: i }}
              >
                <button
                  className="pp-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className="pp-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="pp-faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pp-cta" ref={observe('cta')}>
        <div className={`pp-cta-inner ${visible['cta'] ? 'pp-vis' : ''}`}>
          <span className="pp-eyebrow pp-eyebrow--light">Ready to Grow?</span>
          <h2 className="pp-cta-h2">
            Start tracking today.<br />
            <em>First 7 days are on us.</em>
          </h2>
          <p className="pp-cta-p">
            Join 50,000+ Nigerian entrepreneurs who chose HustleWise to
            manage their money and grow their business.
          </p>
          <div className="pp-cta-actions">
            <button className="pp-btn-cta">Start Free Trial</button>
            <Link to="/support" className="pp-cta-link">
              Still have questions? Talk to us →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}