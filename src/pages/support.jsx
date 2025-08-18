import { FiHeadphones, FiMail, FiPhone, FiMessageSquare, FiClock, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './support.css';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Your message has been sent! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const supportOptions = [
    {
      icon: <FiHeadphones size={32} />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      link: "#chat"
    },
    {
      icon: <FiMail size={32} />,
      title: "Email Support",
      description: "We respond within 24 hours",
      action: "support@husslewise.com",
      link: "mailto:support@husslewise.com"
    },
    {
      icon: <FiPhone size={32} />,
      title: "Phone Support",
      description: "Mon-Fri, 9am-5pm WAT",
      action: "+234 800 123 4567",
      link: "tel:+2348001234567"
    },
    {
      icon: <FaWhatsapp size={32} />,
      title: "WhatsApp",
      description: "24/7 messaging support",
      action: "Chat on WhatsApp",
      link: "https://wa.me/2348001234567"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. You'll receive an email with reset instructions."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! HussleWise is available on both iOS and Android devices."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "Navigate to Settings > Billing in your dashboard to upgrade your subscription."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major debit cards, bank transfers, and USSD payments."
    }
  ];

  return (
    <div className="support-page">
      
      <main>
        {/* Hero Section */}
        <section className="support-hero" data-aos="fade-down">
          <div className="container">
            <h1 data-aos="fade-up" data-aos-delay="100">We're Here to Help</h1>
            <p className="subtitle" data-aos="fade-up" data-aos-delay="200">
              Get support for your HussleWise account or contact our team directly
            </p>
          </div>
        </section>

        {/* Support Options */}
        <section className="support-options">
          <div className="container">
            <h2 data-aos="fade-up">Support Channels</h2>
            <p className="section-intro" data-aos="fade-up" data-aos-delay="100">
              Choose your preferred way to get help
            </p>
            <div className="options-grid">
              {supportOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="option-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="option-icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <a href={option.link} className="option-link">
                    {option.action}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="container">
            <div className="form-container" data-aos="fade-right">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
            <div className="contact-info" data-aos="fade-left" data-aos-delay="200">
              <h2>Contact Information</h2>
              <div className="info-item">
                <FiMapPin className="info-icon" />
                <div>
                  <h3>Our Office</h3>
                  <p>123 Business Avenue, Victoria Island, Lagos, Nigeria</p>
                </div>
              </div>
              <div className="info-item">
                <FiMail className="info-icon" />
                <div>
                  <h3>Email Us</h3>
                  <p>hello@husslewise.com</p>
                  <p>support@husslewise.com</p>
                </div>
              </div>
              <div className="info-item">
                <FiPhone className="info-icon" />
                <div>
                  <h3>Call Us</h3>
                  <p>+234 800 123 4567</p>
                  <p>+234 800 765 4321</p>
                </div>
              </div>
              <div className="info-item">
                <FiClock className="info-icon" />
                <div>
                  <h3>Working Hours</h3>
                  <p>Monday - Friday: 9am - 5pm WAT</p>
                  <p>Saturday: 10am - 2pm WAT</p>
                </div>
              </div>
              <div className="social-links">
                <a href="https://twitter.com/husslewise" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://facebook.com/husslewise" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://wa.me/2348001234567" aria-label="WhatsApp">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h2 data-aos="fade-up">Frequently Asked Questions</h2>
            <p className="section-intro" data-aos="fade-up" data-aos-delay="100">
              Quick answers to common questions
            </p>
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

        {/* Resources Section */}
        <section className="resources-section">
          <div className="container">
            <h2 data-aos="fade-up">Helpful Resources</h2>
            <div className="resources-grid">
              <div className="resource-card" data-aos="fade-up" data-aos-delay="100">
                <h3>Knowledge Base</h3>
                <p>Browse our library of articles and tutorials</p>
                <a href="#" className="resource-link">Visit Knowledge Base</a>
              </div>
              <div className="resource-card" data-aos="fade-up" data-aos-delay="200">
                <h3>Video Tutorials</h3>
                <p>Watch step-by-step guides for using HussleWise</p>
                <a href="#" className="resource-link">Watch Tutorials</a>
              </div>
              <div className="resource-card" data-aos="fade-up" data-aos-delay="300">
                <h3>Community Forum</h3>
                <p>Connect with other HussleWise users</p>
                <a href="#" className="resource-link">Join Community</a>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}