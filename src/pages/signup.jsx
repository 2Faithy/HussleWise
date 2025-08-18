import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineApple } from 'react-icons/ai';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './signup.css';

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Enhanced mock users with business types
const mockUsers = [
  {
    id: 1,
    name: "Mama Nkechi",
    email: "mama@example.com",
    password: "tomatoes123",
    business: "Nkechi Tomatoes",
    type: "small",
    metrics: {
      todaySales: 45000,
      todayExpenses: 18000,
      balance: 27000,
      businessHealth: 68
    }
  },
  {
    id: 2,
    name: "Oga Femi",
    email: "femi@example.com",
    password: "electronics123",
    business: "Femi Electronics",
    type: "medium",
    metrics: {
      todaySales: 185000,
      todayExpenses: 75000,
      balance: 110000,
      businessHealth: 78
    }
  },
  {
    id: 3,
    name: "Chief Adebayo",
    email: "adebayo@example.com",
    password: "supermarket123",
    business: "Adebayo Supermarket",
    type: "large",
    metrics: {
      todaySales: 450000,
      todayExpenses: 220000,
      balance: 230000,
      businessHealth: 85
    }
  }
];

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessType: 'small' // Default to small business
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.hash === '#login') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    AOS.refresh();
  }, [location.hash]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mockAuthAPI = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      const user = mockUsers.find(
        user => user.email === formData.email && user.password === formData.password
      );

      if (user) {
        setSuccess(`Welcome back, ${user.name}!`);
        // Save user to localStorage before navigating
        localStorage.setItem('hussleWiseUser', JSON.stringify(user));
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError('Invalid email or password');
      }
    } else {
      const emailExists = mockUsers.some(user => user.email === formData.email);

      if (emailExists) {
        setError('Email already registered');
      } else {
        const newUser = {
          id: mockUsers.length + 1,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          business: formData.businessName || `${formData.name}'s Business`,
          type: formData.businessType,
          metrics: {
            todaySales: formData.businessType === 'small' ? 45000 : 
                       formData.businessType === 'medium' ? 185000 : 450000,
            todayExpenses: formData.businessType === 'small' ? 18000 : 
                          formData.businessType === 'medium' ? 75000 : 220000,
            balance: formData.businessType === 'small' ? 27000 : 
                    formData.businessType === 'medium' ? 110000 : 230000,
            businessHealth: formData.businessType === 'small' ? 68 : 
                           formData.businessType === 'medium' ? 78 : 85
          }
        };

        mockUsers.push(newUser);
        setSuccess(`Account created for ${newUser.name}!`);
        // Save user to localStorage before navigating
        localStorage.setItem('hussleWiseUser', JSON.stringify(newUser));
        setTimeout(() => navigate('/onboarding'), 1500);
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mockAuthAPI();
  };

  const toggleAuthMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    navigate(newIsLogin ? '#login' : '#', { replace: true });
  };

  return (
    <div className="signup-page">
      <main className="signup-container">
        {/* Left Side - Branding */}
        <div className="signup-branding" data-aos="fade-right" data-aos-delay="100">
          <h2 className="signup-heading" data-aos="fade-up" data-aos-delay="200">
            Your Business Companion for Nigeria's Informal Sector
          </h2>
          <p className="signup-description" data-aos="fade-up" data-aos-delay="300">
            Hussle Wise simplifies your business operations with easy bookkeeping, CAC registration support, 
            and smart growth insights.
          </p>
          <div className="signup-features-card" data-aos="fade-up" data-aos-delay="400">
            <h3 className="features-heading" data-aos="fade-up" data-aos-delay="450">
              Why Choose Hussle Wise?
            </h3>
            <ul className="features-list">
              {[
                "Simple 'Money In/Money Out' tracking",
                "Official CAC business registration",
                "WhatsApp receipts and customer follow-ups",
                "Works offline with SMS sync"
              ].map((feature, index) => (
                <li key={index} className="feature-item" data-aos="fade-up" data-aos-delay={500 + (index * 100)}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="signup-form-container" data-aos="fade-left" data-aos-delay="100">
          <h2 className="form-title" data-aos="fade-up" data-aos-delay="200">
            {isLogin ? 'Welcome Back!' : 'Get Started for Free'}
          </h2>
          <p className="form-subtitle" data-aos="fade-up" data-aos-delay="250">
            {isLogin ? 'Sign in to your Hussle Wise account' : 'Join thousands of Nigerian entrepreneurs'}
          </p>

          <div className="social-login" data-aos="fade-up" data-aos-delay="300">
            <button className="social-btn google-btn" data-aos="fade-right" data-aos-delay="350">
              <FcGoogle className="social-icon" />
              Continue with Google
            </button>
            <button className="social-btn apple-btn" data-aos="fade-left" data-aos-delay="350">
              <AiOutlineApple className="social-icon" />
              Continue with Apple
            </button>
          </div>

          <div className="divider" data-aos="fade-up" data-aos-delay="400">
            <span className="divider-text">or</span>
          </div>

          {(success || error) && (
            <div className={`alert ${success ? 'success' : 'error'}`} data-aos="fade-up" data-aos-delay="450">
              {success || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" data-aos="fade-up" data-aos-delay="500">
            {!isLogin && (
              <>
                <div className="form-group" data-aos="fade-up" data-aos-delay="550">
                  <div className="input-icon">
                    <FiUser className="icon" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="600">
                  <div className="input-icon">
                    <FiBriefcase className="icon" />
                  </div>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Business name (optional)"
                    className="form-input"
                  />
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="650">
                  <label>Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="small">Small Business</option>
                    <option value="medium">Medium Business</option>
                    <option value="large">Large Business</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group" data-aos="fade-up" data-aos-delay={isLogin ? "550" : "700"}>
              <div className="input-icon">
                <FiMail className="icon" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="form-input"
                required
              />
            </div>

            <div className="form-group" data-aos="fade-up" data-aos-delay={isLogin ? "600" : "750"}>
              <div className="input-icon">
                <FiLock className="icon" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-input"
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
              data-aos="fade-up" 
              data-aos-delay={isLogin ? "650" : "800"}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-toggle" data-aos="fade-up" data-aos-delay={isLogin ? "700" : "850"}>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button type="button" className="toggle-btn" onClick={toggleAuthMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <p className="terms-text" data-aos="fade-up" data-aos-delay={isLogin ? "750" : "900"}>
            By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
            <a href="#" className="terms-link">Terms</a> and{' '}
            <a href="#" className="terms-link">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;