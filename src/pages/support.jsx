import {
  FiHeadphones,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { FaWhatsapp, FaTwitter, FaFacebook } from "react-icons/fa";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./support.css";

const CHANNELS = [
  {
    icon: <FiHeadphones size={24} />,
    title: "Live Chat",
    body: "Instant help from our support team.",
    action: "Start Chat",
    href: "#chat",
  },
  {
    icon: <FiMail size={24} />,
    title: "Email",
    body: "We respond within 24 hours.",
    action: "support@husslewise.com",
    href: "mailto:support@husslewise.com",
  },
  {
    icon: <FiPhone size={24} />,
    title: "Phone",
    body: "Mon–Fri, 9am–5pm WAT.",
    action: "+234 800 123 4567",
    href: "tel:+2348001234567",
  },
  {
    icon: <FaWhatsapp size={24} />,
    title: "WhatsApp",
    body: "24/7 messaging support.",
    action: "Chat on WhatsApp",
    href: "https://wa.me/2348001234567",
  },
];

const FAQS = [
  {
    q: "How do I reset my password?",
    a: 'Go to the login page and click "Forgot Password". You\'ll receive an email with reset instructions.',
  },
  {
    q: "Is there a mobile app?",
    a: "Yes — Hussle Wise is available on both iOS and Android.",
  },
  {
    q: "How do I upgrade my plan?",
    a: "Go to Settings → Billing in your dashboard to upgrade your subscription.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept debit cards, bank transfers, and USSD payments.",
  },
];

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 650,
      once: true,
      easing: "ease-out-quad",
      offset: 60,
    });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="sp-page">
      {/* ── HERO ── */}
      <section className="sp-hero">
        <div className="sp-container" data-aos="fade-up">
          <p className="sp-eyebrow">Support</p>
          <h1 className="sp-hero__h1">We're here to help</h1>
          <p className="sp-hero__sub">
            Get help with your Hussle Wise account, or reach our team directly.
          </p>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section className="sp-section sp-section--white">
        <div className="sp-container">
          <p className="sp-eyebrow sp-center" data-aos="fade-up">
            Contact
          </p>
          <h2
            className="sp-h2 sp-center"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            Choose how to reach us
          </h2>
          <div className="sp-channels" data-aos="fade-up" data-aos-delay="120">
            {CHANNELS.map((c, i) => (
              <div key={i} className="sp-channel">
                <div className="sp-channel__icon">{c.icon}</div>
                <h3 className="sp-channel__title">{c.title}</h3>
                <p className="sp-channel__body">{c.body}</p>
                <a href={c.href} className="sp-link">
                  {c.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM + INFO ── */}
      <section className="sp-section sp-section--warm">
        <div className="sp-container sp-contact">
          <div data-aos="fade-right">
            <p className="sp-eyebrow">Message Us</p>
            <h2 className="sp-h2">Send us a message</h2>
            <form className="sp-form" onSubmit={handleSubmit}>
              <div className="sp-form__row">
                <div className="sp-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Amina Ibrahim"
                  />
                </div>
                <div className="sp-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="amina@email.com"
                  />
                </div>
              </div>
              <div className="sp-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>
              <div className="sp-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more..."
                />
              </div>
              <button type="submit" className="sp-submit">
                Send Message
              </button>
            </form>
          </div>

          <div className="sp-info" data-aos="fade-left" data-aos-delay="100">
            <p className="sp-eyebrow">Find Us</p>
            <h2 className="sp-h2">Contact information</h2>

            <div className="sp-info__list">
              <div className="sp-info__item">
                <div className="sp-info__icon">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div className="sp-info__label">Office</div>
                  <div className="sp-info__value">
                    123 Business Avenue, Victoria Island, Lagos
                  </div>
                </div>
              </div>
              <div className="sp-info__item">
                <div className="sp-info__icon">
                  <FiMail size={18} />
                </div>
                <div>
                  <div className="sp-info__label">Email</div>
                  <div className="sp-info__value">hello@husslewise.com</div>
                  <div className="sp-info__value">support@husslewise.com</div>
                </div>
              </div>
              <div className="sp-info__item">
                <div className="sp-info__icon">
                  <FiPhone size={18} />
                </div>
                <div>
                  <div className="sp-info__label">Phone</div>
                  <div className="sp-info__value">+234 800 123 4567</div>
                  <div className="sp-info__value">+234 800 765 4321</div>
                </div>
              </div>
              <div className="sp-info__item">
                <div className="sp-info__icon">
                  <FiClock size={18} />
                </div>
                <div>
                  <div className="sp-info__label">Hours</div>
                  <div className="sp-info__value">Mon–Fri: 9am–5pm WAT</div>
                  <div className="sp-info__value">Saturday: 10am–2pm WAT</div>
                </div>
              </div>
            </div>

            <div className="sp-socials">
              <a
                href="https://twitter.com/husslewise"
                aria-label="Twitter"
                className="sp-social"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://facebook.com/husslewise"
                aria-label="Facebook"
                className="sp-social"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://wa.me/2348001234567"
                aria-label="WhatsApp"
                className="sp-social"
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sp-section sp-section--white">
        <div className="sp-container">
          <p className="sp-eyebrow sp-center" data-aos="fade-up">
            FAQ
          </p>
          <h2
            className="sp-h2 sp-center"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            Common questions
          </h2>
          <div className="sp-faqs" data-aos="fade-up" data-aos-delay="120">
            {FAQS.map((f, i) => (
              <div key={i} className="sp-faq">
                <h3 className="sp-faq__q">{f.q}</h3>
                <p className="sp-faq__a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section className="sp-section sp-section--dark">
        <div className="sp-container">
          <p
            className="sp-eyebrow sp-eyebrow--light sp-center"
            data-aos="fade-up"
          >
            Resources
          </p>
          <h2
            className="sp-h2 sp-h2--light sp-center"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            Helpful resources
          </h2>
          <div className="sp-resources" data-aos="fade-up" data-aos-delay="120">
            {[
              {
                title: "Knowledge Base",
                body: "Browse articles and tutorials for every feature.",
                link: "#",
              },
              {
                title: "Video Tutorials",
                body: "Step-by-step video guides to get the most out of Hussle Wise.",
                link: "#",
              },
              {
                title: "Community Forum",
                body: "Connect with thousands of other Nigerian entrepreneurs.",
                link: "#",
              },
            ].map((r, i) => (
              <div key={i} className="sp-resource">
                <h3 className="sp-resource__title">{r.title}</h3>
                <p className="sp-resource__body">{r.body}</p>
                <a href={r.link} className="sp-resource__link">
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
