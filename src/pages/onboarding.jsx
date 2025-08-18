import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './onboarding.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    email: '',
    password: '',
    phone: '',
    businessCategory: '',
    dailySales: '',
    businessLocation: '',
    cacRegistration: 'undecided',
    cacNumber: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        if (!formData.fullName || !formData.businessType || !formData.email || !formData.password || !formData.phone) {
          alert('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!formData.businessCategory || !formData.dailySales || !formData.businessLocation) {
          alert('Please fill in all business details');
          return false;
        }
        return true;
      case 3:
        if (formData.cacRegistration === 'yes' && !formData.cacNumber) {
          alert('Please enter your CAC registration number');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      // const response = await api.registerBusiness(formData);
      
      navigate('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  // Step 1: Basic Information
  if (step === 1) {
    return (
      <div className="onboarding-container" data-aos="zoom-in">
        <div className="progress-bar" data-aos="fade-up">
          <div className="progress-step active">1</div>
          <div className="progress-line"></div>
          <div className="progress-step">2</div>
          <div className="progress-line"></div>
          <div className="progress-step">3</div>
          <div className="progress-line"></div>
          <div className="progress-step">4</div>
        </div>
        
        <h2 data-aos="fade-up">Let's get started with your business</h2>
        <p data-aos="fade-up">Basic information to create your account</p>
        
        <form data-aos="fade-up">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Business Name (optional)</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your business name"
            />
          </div>
          
          <div className="form-group">
            <label>Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            >
              <option value="">Select business type</option>
              <option value="small">Small Business</option>
              <option value="medium">Medium Business</option>
              <option value="large">Large Business</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="08012345678"
            />
          </div>
          
          <button 
            type="button" 
            className="btn-primary" 
            onClick={nextStep}
            data-aos="fade-up"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  // Step 2: Business Details (updated with Other category input)
  if (step === 2) {
    return (
      <div className="onboarding-container" data-aos="zoom-in">
        <div className="progress-bar" data-aos="fade-up">
          <div className="progress-step completed">1</div>
          <div className="progress-line completed"></div>
          <div className="progress-step active">2</div>
          <div className="progress-line"></div>
          <div className="progress-step">3</div>
          <div className="progress-line"></div>
          <div className="progress-step">4</div>
        </div>
        
        <h2 data-aos="fade-up">Tell us about your business</h2>
        <p data-aos="fade-up">This helps us customize HussleWise for you</p>
        
        <form data-aos="fade-up">
          <div className="form-group">
            <label>What category does your business fall under? *</label>
            <select
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="retail">Retail (Shop/Supermarket)</option>
              <option value="food">Food & Restaurant</option>
              <option value="services">Services (Salon, Repairs, etc.)</option>
              <option value="fashion">Fashion & Clothing</option>
              <option value="agriculture">Agriculture</option>
              <option value="other">Other (Please specify)</option>
            </select>
          </div>
          
          {formData.businessCategory === 'other' && (
            <div className="form-group" data-aos="fade-up">
              <label>Please specify your business category *</label>
              <input
                type="text"
                name="otherCategory"
                value={formData.otherCategory}
                onChange={handleChange}
                placeholder="Describe your business category"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>What's your average daily sales? (₦) *</label>
            <select
              name="dailySales"
              value={formData.dailySales}
              onChange={handleChange}
              required
            >
              <option value="">Select range</option>
              <option value="0-5000">₦0 - ₦5,000</option>
              <option value="5001-20000">₦5,001 - ₦20,000</option>
              <option value="20001-50000">₦20,001 - ₦50,000</option>
              <option value="50001-100000">₦50,001 - ₦100,000</option>
              <option value="100000+">Above ₦100,000</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Where is your business located? *</label>
            <input
              type="text"
              name="businessLocation"
              value={formData.businessLocation}
              onChange={handleChange}
              placeholder="E.g., Ojota Market, Lagos"
              required
            />
          </div>
          
          <div className="button-group" data-aos="fade-up">
            <button type="button" className="btn-secondary" onClick={prevStep}>
              Back
            </button>
            <button type="button" className="btn-primary" onClick={nextStep}>
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 3: Business Registration
  if (step === 3) {
    return (
      <div className="onboarding-container" data-aos="zoom-in">
        <div className="progress-bar" data-aos="fade-up">
          <div className="progress-step completed">1</div>
          <div className="progress-line completed"></div>
          <div className="progress-step completed">2</div>
          <div className="progress-line completed"></div>
          <div className="progress-step active">3</div>
          <div className="progress-line"></div>
          <div className="progress-step">4</div>
        </div>
        
        <h2 data-aos="fade-up">Business Registration</h2>
        <p data-aos="fade-up">Get your business registered with CAC for more opportunities</p>
        
        <div className="registration-options" data-aos="fade-up">
          <div className="option-card">
            <h3>Is your business registered with CAC?</h3>
            
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="cacRegistration"
                  value="yes"
                  checked={formData.cacRegistration === 'yes'}
                  onChange={handleChange}
                />
                <span>Yes, my business is registered</span>
              </label>
              
              <label>
                <input
                  type="radio"
                  name="cacRegistration"
                  value="no"
                  checked={formData.cacRegistration === 'no'}
                  onChange={handleChange}
                />
                <span>No, but I want to register</span>
              </label>
              
              <label>
                <input
                  type="radio"
                  name="cacRegistration"
                  value="undecided"
                  checked={formData.cacRegistration === 'undecided'}
                  onChange={handleChange}
                />
                <span>Not now, maybe later</span>
              </label>
            </div>
            
            {formData.cacRegistration === 'yes' && (
              <div className="form-group" data-aos="fade-up">
                <label>CAC Registration Number</label>
                <input
                  type="text"
                  name="cacNumber"
                  value={formData.cacNumber}
                  onChange={handleChange}
                  placeholder="Enter your CAC number"
                />
              </div>
            )}
          </div>
          
          {formData.cacRegistration === 'no' && (
            <div className="benefits-card" data-aos="fade-up">
              <h4>Benefits of registering your business:</h4>
              <ul>
                <li>✓ Access to loans and grants</li>
                <li>✓ Verified badge on HussleWise marketplace</li>
                <li>✓ Legal protection for your business</li>
                <li>✓ Easier to open business bank accounts</li>
              </ul>
              <p>We can help you register in just 7 days for ₦15,000</p>
            </div>
          )}
        </div>
        
        <div className="button-group" data-aos="fade-up">
          <button type="button" className="btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button type="button" className="btn-primary" onClick={nextStep}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Getting Started
  if (step === 4) {
    return (
      <div className="onboarding-container" data-aos="zoom-in">
        <div className="progress-bar" data-aos="fade-up">
          <div className="progress-step completed">1</div>
          <div className="progress-line completed"></div>
          <div className="progress-step completed">2</div>
          <div className="progress-line completed"></div>
          <div className="progress-step completed">3</div>
          <div className="progress-line completed"></div>
          <div className="progress-step active">4</div>
        </div>
        
        <div className="welcome-section">
          <h2 data-aos="fade-up">Welcome to HussleWise, {formData.fullName.split(' ')[0]}!</h2>
          <p data-aos="fade-up">Your business {formData.businessName || 'unnamed business'} is all set up</p>
          
          <div className="quick-start-card" data-aos="fade-up">
            <h3>Quick Start Guide</h3>
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Record your first sale</strong>
                <p>Tap "Add Sale" to log money coming in</p>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Track expenses</strong>
                <p>Record all money going out to see your profit</p>
              </div>
            </div>
            
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Check your dashboard</strong>
                <p>See your daily balance and business trends</p>
              </div>
            </div>
            
            {formData.cacRegistration === 'no' && (
              <div className="guide-step highlight">
                <div className="step-number">!</div>
                <div className="step-content">
                  <strong>Register your business</strong>
                  <p>Complete your CAC registration to unlock more benefits</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="permission-request" data-aos="fade-up">
            <h4>Help us serve you better</h4>
            <p>Allow notifications to get:</p>
            <ul>
              <li>✓ Daily business summaries</li>
              <li>✓ Payment reminders</li>
              <li>✓ Growth tips</li>
            </ul>
            <button className="btn-notification">Enable Notifications</button>
          </div>
        </div>
        
        <button 
          type="button" 
          className="btn-primary" 
          onClick={handleSubmit}
          data-aos="fade-up"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return null;
};

export default Onboarding;