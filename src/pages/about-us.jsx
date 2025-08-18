import { FiGlobe, FiTrendingUp, FiUsers, FiAward, FiBook, FiBriefcase, FiBarChart2, FiZap } from 'react-icons/fi';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './about-us.css';
import Valuegate from '../assets/valuegate.png';

export default function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  const services = [
    {
      icon: <FiGlobe size={32} />,
      title: "Digital Transformation",
      description: "We help businesses establish powerful online presence and digital brands to reach global markets."
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: "Business & Strategic Advisory",
      description: "Comprehensive advisory services for both short-term wins and long-term goals."
    },
    {
      icon: <FiUsers size={32} />,
      title: "International Client Representation",
      description: "Global network ensuring successful outcomes for international ventures."
    },
    {
      icon: <FiAward size={32} />,
      title: "Board and Leadership Training",
      description: "Customized leadership development programs for executives."
    },
    {
      icon: <FiBook size={32} />,
      title: "Education & Certification",
      description: "Professional development programs for competitive advantage."
    },
    {
      icon: <FiBriefcase size={32} />,
      title: "Talent Development & Management",
      description: "End-to-end talent solutions through our ValueTDM unit."
    },
    {
      icon: <FiZap size={32} />,
      title: "Energy Audit & Mapping",
      description: "Sustainability experts optimizing energy consumption."
    },
    {
      icon: <FiBarChart2 size={32} />,
      title: "Economic & Data Analysis",
      description: "Transforming data into actionable business intelligence."
    }
  ];

  return (
    <div className="about-page">      
      <main>
        {/* Hero Section */}
        <section className="about-hero" data-aos="fade-down">
          <div className="container">
            <h1 data-aos="fade-up" data-aos-delay="100">About HussleWise & ValueGate</h1>
            <p className="subtitle" data-aos="fade-up" data-aos-delay="200">
              Empowering businesses through innovative digital solutions
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="company-overview">
          <div className="container">
            <div className="overview-content">
              <div className="overview-text" data-aos="fade-right">
                <h2>Our Story</h2>
                <p>
                  HussleWise is a flagship product of ValueGate Consulting, a global consulting firm with 
                  engineers, analysts, and technical specialists serving clients worldwide since 2010.
                </p>
                <div className="stats-grid">
                  <div className="stat-card" data-aos="flip-up" data-aos-delay="100">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Active Users</span>
                  </div>
                  <div className="stat-card" data-aos="flip-up" data-aos-delay="200">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Markets</span>
                  </div>
                  <div className="stat-card" data-aos="flip-up" data-aos-delay="300">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Nigerian Focus</span>
                  </div>
                </div>
              </div>
              <div className="overview-image" data-aos="fade-left" data-aos-delay="200">
                <img src={Valuegate} alt="Valuegate Logo" loading='lazy'/>
              </div>
            </div>
          </div>
        </section>

        {/* HussleWise Focus */}
        <section className="husslewise-focus">
          <div className="container">
            <h2 data-aos="fade-up">Why Choose HussleWise?</h2>
            <div className="focus-points">
              <div className="focus-card" data-aos="fade-up" data-aos-delay="100">
                <h3>Localized Solutions</h3>
                <p>
                  Built specifically for Nigerian market dynamics, addressing cash-based transactions 
                  and mobile-first users.
                </p>
              </div>
              <div className="focus-card" data-aos="fade-up" data-aos-delay="200">
                <h3>Financial Inclusion</h3>
                <p>
                  Democratizing business tools for micro-entrepreneurs to access digital financial services.
                </p>
              </div>
              <div className="focus-card" data-aos="fade-up" data-aos-delay="300">
                <h3>Smart Automation</h3>
                <p>
                  AI-powered insights helping small businesses compete through data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ValueGate Services */}
        <section className="services-section">
          <div className="container">
            <h2 data-aos="fade-up">Our Consulting Services</h2>
            <p className="section-intro" data-aos="fade-up" data-aos-delay="100">
              Multidisciplinary expertise powering solutions across industries
            </p>
            <div className="services-grid">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="service-card"
                  data-aos="fade-up"
                  data-aos-delay={index % 2 === 0 ? 200 : 300}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta" data-aos="fade-up">
          <div className="container">
            <h2 data-aos="fade-up" data-aos-delay="100">Ready to Transform Your Business?</h2>
            <p data-aos="fade-up" data-aos-delay="200">
              Whether you need HussleWise or ValueGate's consulting expertise, we're here to help.
            </p>
            <div className="cta-buttons">
              <a 
                href="https://valuegateconsulting.com/" 
                className="primary-btn"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                Visit ValueGate
              </a>
              <a 
                href="/contact" 
                className="secondary-btn"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}