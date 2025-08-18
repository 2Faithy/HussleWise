import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { FiTrendingUp, FiDollarSign, FiUsers, FiFileText, FiSmartphone, FiAward, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp, FaChartLine } from 'react-icons/fa';
import { MdPointOfSale, MdReceipt } from 'react-icons/md';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import './App.css';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import businessIllustration from './assets/business-illustration.png';
import Features from './pages/features';
import Pricing from './pages/pricing';
import About from './pages/about-us';
import Support from './pages/support';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';
import AddSale from './pages/add-sale';
import AddExpense from './pages/add-expense';
import SendReceipt from './pages/SendReceipt';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundColor: '#ECBC94' }}>
        <div className="hero-content" data-aos="fade-right">
          <h1>Manage Your Business Like a Pro</h1>
          <p>Simple tools for Nigerian entrepreneurs to track money, grow sales, and get official</p>
          <div className="hero-buttons">
            <Link to="/signup">
            <button className="primary-btn">Get Started</button>
            </Link>
            <button className="secondary-btn">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image" data-aos="fade-left">
          <img src={businessIllustration} alt="Business management" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 data-aos="fade-up">Everything You Need in One App</h2>
        <div className="features-grid">
          {[
            { icon: <FiDollarSign size={32} />, title: "Money Tracking", text: "See all money in and out at a glance" },
            { icon: <MdPointOfSale size={32} />, title: "Sales Records", text: "Log sales in seconds" },
            { icon: <FiUsers size={32} />, title: "Customer Management", text: "Track buyers and send receipts" },
            { icon: <FiFileText size={32} />, title: "CAC Registration", text: "Get your business registered easily" },
            { icon: <FaWhatsapp size={32} />, title: "WhatsApp Tools", text: "Send receipts and promotions" },
            { icon: <FaChartLine size={32} />, title: "Growth Insights", text: "AI-powered business advice" }
          ].map((feature, index) => (
            <div key={index} className="feature-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="feature-icon" style={{ color: '#1C5B56' }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Process Section */}
      <section className="process-section" style={{ backgroundColor: '#0E1B1A', color: 'white' }}>
        <h2 data-aos="fade-up">Our Simple Process</h2>
        <div className="process-grid">
          <div className="process-item" data-aos="zoom-in" data-aos-delay="200">
            <div className="process-icon-wrapper">
              <FiSmartphone size={40} className="process-icon" />
            </div>
            <h3>1. Get The App</h3>
            <p>Download Business Companion from the Play Store or App Store.</p>
          </div>
          <div className="process-item" data-aos="zoom-in" data-aos-delay="400">
            <div className="process-icon-wrapper">
              <MdReceipt size={40} className="process-icon" />
            </div>
            <h3>2. Log Transactions</h3>
            <p>Quickly enter your sales and expenses as they happen.</p>
          </div>
          <div className="process-item" data-aos="zoom-in" data-aos-delay="600">
            <div className="process-icon-wrapper">
              <FiTrendingUp size={40} className="process-icon" />
            </div>
            <h3>3. See Growth</h3>
            <p>Watch your business grow with clear, simple reports.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 data-aos="fade-up">What Our Users Say</h2>
        <div className="testimonial-cards">
          {[
            { name: "Mama Nkechi", business: "Tomato Seller", quote: "My sales increased by 30% after using the insights" },
            { name: "Mr. Ade", business: "Tailor", quote: "The CAC registration saved me weeks of stress" },
            { name: "Amina", business: "Hair Stylist", quote: "My customers love the WhatsApp receipts" }
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card" data-aos="zoom-in" data-aos-delay={index * 150}>
              <div className="quote">"{testimonial.quote}"</div>
              <div className="author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.business}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" style={{ background: '#ECBC94' }}>
        <h2 data-aos="fade-up">Choose Your Plan</h2>
        <p className="pricing-intro" data-aos="fade-up" data-aos-delay="100">Simple and affordable plans for every stage of your business.</p>
        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Basic</h3>
            <p className="price">Free</p>
            <ul>
              <li><FiCheckCircle size={18} /> Daily sales tracking</li>
              <li><FiCheckCircle size={18} /> 20 Customer records</li>
              <li><FiCheckCircle size={18} /> Basic reports</li>
            </ul>
            <Link to='/signup'>
            <button className="primary-btn">Start for Free</button>
            </Link>
          </div>
          {/* Pro Plan */}
          <div className="pricing-card highlighted-card" data-aos="fade-up" data-aos-delay="300">
            <div className="badge">Most Popular</div>
            <h3>Pro</h3>
            <p className="price">₦2,500/mo</p>
            <ul>
              <li><FiCheckCircle size={18} /> Unlimited tracking</li>
              <li><FiCheckCircle size={18} /> Unlimited customers</li>
              <li><FiCheckCircle size={18} /> Advanced AI insights</li>
              <li><FiCheckCircle size={18} /> WhatsApp integration</li>
              <li><FiCheckCircle size={18} /> Priority support</li>
            </ul>
            <button className="secondary-btn">Get Pro</button>
          </div>
          {/* Enterprise Plan */}
          <div className="pricing-card" data-aos="fade-up" data-aos-delay="400">
            <h3>Enterprise</h3>
            <p className="price">Custom</p>
            <ul>
              <li><FiCheckCircle size={18} /> All Pro features</li>
              <li><FiCheckCircle size={18} /> Multiple users</li>
              <li><FiCheckCircle size={18} /> Dedicated account manager</li>
              <li><FiCheckCircle size={18} /> Custom integrations</li>
            </ul>
            <button className="primary-btn">Contact Us</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" style={{ backgroundColor: '#1C5B56', color: 'white' }}>
        <h2 data-aos="fade-up">Ready to Grow Your Business?</h2>
        <p data-aos="fade-up" data-aos-delay="100">Join thousands of Nigerian entrepreneurs using Business Companion</p>
        <div className="cta-buttons" data-aos="fade-up" data-aos-delay="200">
          <Link to='/signup'>
          <button className="primary-btn">Start Free Trial</button>
          </Link>
          <button className="secondary-btn">Contact Sales</button>
        </div>
      </section>
    </div>
  );
}

// Layout wrapper component
function AppLayout({ children }) {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Routes that should use dashboard layout (with sidebar, no header/footer)
  const dashboardRoutes = [
    '/dashboard',
    '/cashflow',
    '/customers', 
    '/receipts',
    '/reports',
    '/payments',
    '/cac-registration',
    '/marketplace',
    '/growth-coach',
    '/settings',
    '/support-dashboard',
    '/add-sale',
    '/add-expense',
    '/send-receipt'  // Added send-receipt to dashboard routes
  ];

  const isDashboardRoute = dashboardRoutes.includes(location.pathname);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('hussleWiseUser');
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('hussleWiseUser');
      }
    }

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dashboard layout (with sidebar, no header/footer)
  if (isDashboardRoute) {
    return (
      <div className="dashboard-layout">
        <Sidebar 
          userData={userData} 
          isOnline={isOnline}
          // Remove onToggle - let Sidebar handle its own state
        />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    );
  }

  // Default layout (with header/footer, no sidebar)
  return (
    <div className="default-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/add-sale" element={<AddSale />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/send-receipt" element={<SendReceipt />} />
            {/* Add other routes as needed */}
          </Routes>
        </AppLayout>
      </div>
    </Router>
  );
}

export default App;