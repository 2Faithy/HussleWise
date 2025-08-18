import { useEffect } from 'react';
import { FiDollarSign, FiUsers, FiFileText, FiPieChart, FiSmartphone, FiShield, FiBarChart2, FiMail, FiCreditCard, FiDatabase, FiTrendingUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdPointOfSale, MdReceipt, MdSupportAgent } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Features.css';

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

export default function Features() {
  useEffect(() => {
    // Refresh AOS when component mounts to ensure proper animation timing
    AOS.refresh();
  }, []);

  const features = [
    {
      category: "Financial Tracking",
      items: [
        { icon: <FiDollarSign size={24} />, title: "Money In/Out", desc: "Track all income and expenses with intuitive categorization" },
        { icon: <MdPointOfSale size={24} />, title: "Daily Sales", desc: "Record transactions in seconds with quick-entry mode" },
        { icon: <FiPieChart size={24} />, title: "Visual Reports", desc: "Understand your finances with pie charts and trend graphs" }
      ]
    },
    {
      category: "Customer Management",
      items: [
        { icon: <FiUsers size={24} />, title: "Customer Database", desc: "Store contact details and purchase history" },
        { icon: <FaWhatsapp size={24} />, title: "WhatsApp Integration", desc: "Send receipts and promotions directly via WhatsApp" },
        { icon: <FiMail size={24} />, title: "Follow-up Reminders", desc: "Get alerts for customer follow-ups and restocks" }
      ]
    },
    {
      category: "Business Growth",
      items: [
        { icon: <FiBarChart2 size={24} />, title: "Performance Insights", desc: "AI-powered analysis of your sales trends" },
        { icon: <FiTrendingUp size={24} />, title: "Growth Tips", desc: "Personalized recommendations to increase profits" },
        { icon: <MdSupportAgent size={24} />, title: "Business Health Score", desc: "0-100 rating of your business fundamentals" }
      ]
    },
    {
      category: "Official Documentation",
      items: [
        { icon: <FiFileText size={24} />, title: "CAC Registration", desc: "Step-by-step business registration assistance" },
        { icon: <MdReceipt size={24} />, title: "Digital Receipts", desc: "Professional receipt templates with your branding" },
        { icon: <FiDatabase size={24} />, title: "Tax Preparation", desc: "Export financial data for accountant-ready reports" }
      ]
    }
  ];

  return (
    <div className="features-page">
      <main>
        {/* Hero Section */}
        <section className="features-hero" data-aos="fade-down">
          <div className="container">
            <h1 data-aos="fade-up" data-aos-delay="100">Powerful Features for Your Business</h1>
            <p className="subtitle" data-aos="fade-up" data-aos-delay="200">
              Everything you need to manage, grow, and officialize your business in Nigeria
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-grid-section">
          <div className="container">
            {features.map((section, sectionIndex) => (
              <div 
                key={sectionIndex} 
                className="feature-category"
                data-aos="fade-up"
                data-aos-delay={sectionIndex * 100}
              >
                <h2 className="category-title">{section.category}</h2>
                <div className="features-container">
                  {section.items.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="feature-card"
                      data-aos="fade-up"
                      data-aos-delay={sectionIndex * 100 + featureIndex * 50}
                    >
                      <div className="feature-icon" data-aos="zoom-in" data-aos-delay={sectionIndex * 100 + featureIndex * 50 + 100}>
                        {feature.icon}
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <h2 data-aos="fade-up">How Our Features Help You Succeed</h2>
            <div className="steps">
              <div 
                className="step"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Track Your Money</h3>
                  <p>Replace paper records with digital tracking that's always available</p>
                </div>
              </div>
              <div 
                className="step"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Understand Patterns</h3>
                  <p>Identify your best-selling days and most profitable products</p>
                </div>
              </div>
              <div 
                className="step"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Make Smarter Decisions</h3>
                  <p>Use data to optimize inventory, pricing, and customer engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="features-cta" data-aos="fade-up">
          <div className="container">
            <h2 data-aos="fade-up" data-aos-delay="100">Ready to Transform Your Business?</h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Join thousands of Nigerian entrepreneurs growing with our tools
            </p>
            <div 
              className="cta-buttons"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <button className="primary-btn">Start Free Trial</button>
              <button className="secondary-btn">See Pricing</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}