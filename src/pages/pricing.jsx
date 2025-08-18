import { FiCheckCircle, FiStar, FiZap, FiShield, FiHeadphones } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './pricing.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Pricing() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      popular: false,
      features: [
        "Track up to 50 transactions/month",
        "Basic sales reports",
        "Email support",
        "5 customer records",
        "Mobile app access"
      ]
    },
    {
      name: "Pro",
      price: "₦2,500",
      period: "/month",
      description: "Best for growing businesses",
      popular: true,
      features: [
        "Unlimited transactions",
        "Advanced analytics",
        "WhatsApp receipts",
        "100 customer records",
        "Priority email support",
        "Business health score"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large businesses",
      popular: false,
      features: [
        "All Pro features",
        "Unlimited customers",
        "CAC registration assistance",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations"
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade at any time."
    },
    {
      question: "Is there a contract?",
      answer: "No, all plans are month-to-month with no long-term commitment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major debit cards, bank transfers, and USSD payments."
    },
    {
      question: "Is my data safe?",
      answer: "We use bank-level encryption to protect your business data."
    }
  ];

  return (
    <div className="pricing-page">
      {/* Remove Header component */}
      
      <main>
        {/* Hero Section */}
        <section className="pricing-hero" data-aos="fade-down">
          <div className="container">
            <h1 data-aos="fade-up" data-aos-delay="100">Simple, Transparent Pricing</h1>
            <p className="subtitle" data-aos="fade-up" data-aos-delay="200">Choose the perfect plan for your business growth</p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="pricing-plans">
          <div className="container">
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`plan-card ${plan.popular ? 'popular' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {plan.popular && <div className="popular-badge" data-aos="zoom-in" data-aos-delay="300">Most Popular</div>}
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <div className="price">
                      <span className="amount">{plan.price}</span>
                      {plan.period && <span className="period">{plan.period}</span>}
                    </div>
                    <p className="description">{plan.description}</p>
                  </div>
                  <ul className="features-list">
                    {plan.features.map((feature, i) => (
                      <li key={i} data-aos="fade-right" data-aos-delay={i * 50 + index * 50}>
                        <FiCheckCircle className="feature-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`plan-button ${plan.popular ? 'primary' : 'secondary'}`}
                    data-aos="zoom-in"
                    data-aos-delay="400"
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="value-props">
          <div className="container">
            <h2 data-aos="fade-up">More Than Just Pricing</h2>
            <div className="props-grid">
              <div className="prop-card" data-aos="fade-up" data-aos-delay="100">
                <FiStar className="prop-icon" />
                <h3>7-Day Free Trial</h3>
                <p>Try all Pro features with no commitment</p>
              </div>
              <div className="prop-card" data-aos="fade-up" data-aos-delay="200">
                <FiZap className="prop-icon" />
                <h3>30-Day Guarantee</h3>
                <p>Get a full refund if you're not satisfied</p>
              </div>
              <div className="prop-card" data-aos="fade-up" data-aos-delay="300">
                <FiShield className="prop-icon" />
                <h3>Data Protection</h3>
                <p>Your business data is always secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h2 data-aos="fade-up">Frequently Asked Questions</h2>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="faq-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pricing-cta" data-aos="fade-up">
          <div className="container">
            <h2 data-aos="fade-up" data-aos-delay="100">Still have questions?</h2>
            <p data-aos="fade-up" data-aos-delay="200">Our team is ready to help you choose the right plan</p>
            <Link to="/support">
            <button 
              className="cta-button"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              Contact Our Support
            </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Remove Footer component */}
    </div>
  );
}