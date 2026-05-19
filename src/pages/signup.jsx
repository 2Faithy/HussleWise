import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiBriefcase } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineApple } from "react-icons/ai";
import AOS from "aos";
import "aos/dist/aos.css";
import "./signup.css";

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
      businessHealth: 68,
    },
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
      businessHealth: 78,
    },
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
      businessHealth: 85,
    },
  },
];

const FEATURES = [
  "Simple Money In / Money Out tracking",
  "Official CAC business registration",
  "WhatsApp receipts and customer follow-ups",
  "Works offline with SMS sync",
];

export default function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "small",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-quad" });
  }, []);

  useEffect(() => {
    setIsLogin(location.hash === "#login");
    AOS.refresh();
  }, [location.hash]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    await new Promise((r) => setTimeout(r, 900));

    if (isLogin) {
      const user = mockUsers.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (user) {
        setSuccess(`Welcome back, ${user.name}!`);
        localStorage.setItem("hussleWiseUser", JSON.stringify(user));
        setTimeout(() => navigate("/dashboard"), 1400);
      } else {
        setError("Invalid email or password.");
      }
    } else {
      if (mockUsers.some((u) => u.email === form.email)) {
        setError("This email is already registered.");
      } else {
        const metrics = {
          small: {
            todaySales: 45000,
            todayExpenses: 18000,
            balance: 27000,
            businessHealth: 68,
          },
          medium: {
            todaySales: 185000,
            todayExpenses: 75000,
            balance: 110000,
            businessHealth: 78,
          },
          large: {
            todaySales: 450000,
            todayExpenses: 220000,
            balance: 230000,
            businessHealth: 85,
          },
        };
        const newUser = {
          id: mockUsers.length + 1,
          name: form.name,
          email: form.email,
          password: form.password,
          business: form.businessName || `${form.name}'s Business`,
          type: form.businessType,
          metrics: metrics[form.businessType],
        };
        mockUsers.push(newUser);
        setSuccess(`Account created! Welcome, ${newUser.name}.`);
        localStorage.setItem("hussleWiseUser", JSON.stringify(newUser));
        setTimeout(() => navigate("/onboarding"), 1400);
      }
    }
    setIsLoading(false);
  };

  const toggle = () => {
    const next = !isLogin;
    setIsLogin(next);
    setError("");
    setSuccess("");
    navigate(next ? "#login" : "#", { replace: true });
  };

  return (
    <div className="su-page">
      <div className="su-card">
        {/* ── LEFT PANEL ── */}
        <div className="su-left">
          {/* Overlay sits on top of the bg image */}
          <div className="su-left__overlay" />

          <div className="su-left__content">
            <div className="su-left__logo" data-aos="fade-down">
              HW
            </div>

            <h2
              className="su-left__heading"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Your business companion for Nigeria's informal sector.
            </h2>
            <p className="su-left__sub" data-aos="fade-up" data-aos-delay="180">
              Simple tools to track money, manage customers, and grow your
              hustle.
            </p>

            <ul className="su-left__list">
              {FEATURES.map((f, i) => (
                <li
                  key={i}
                  className="su-left__item"
                  data-aos="fade-up"
                  data-aos-delay={260 + i * 80}
                >
                  <span className="su-left__check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="su-right">
          <p className="su-eyebrow" data-aos="fade-up">
            {isLogin ? "Welcome back" : "Get started"}
          </p>
          <h1
            className="su-right__heading"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            {isLogin ? "Sign in to your account" : "Create your free account"}
          </h1>

          {/* Social buttons */}
          <div className="su-socials" data-aos="fade-up" data-aos-delay="140">
            <button className="su-social-btn">
              <FcGoogle size={18} /> Continue with Google
            </button>
            <button className="su-social-btn">
              <AiOutlineApple size={18} /> Continue with Apple
            </button>
          </div>

          <div className="su-divider" data-aos="fade-up" data-aos-delay="180">
            <span>or</span>
          </div>

          {/* Alert */}
          {(success || error) && (
            <div
              className={`su-alert ${
                success ? "su-alert--success" : "su-alert--error"
              }`}
              data-aos="fade-up"
            >
              {success || error}
            </div>
          )}

          {/* Form */}
          <form className="su-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div
                  className="su-field"
                  data-aos="fade-up"
                  data-aos-delay="220"
                >
                  <label htmlFor="name">Full Name</label>
                  <div className="su-input-wrap">
                    <FiUser className="su-input-icon" size={15} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Amina Ibrahim"
                      required
                    />
                  </div>
                </div>
                <div
                  className="su-field"
                  data-aos="fade-up"
                  data-aos-delay="280"
                >
                  <label htmlFor="businessName">
                    Business Name{" "}
                    <span className="su-optional">(optional)</span>
                  </label>
                  <div className="su-input-wrap">
                    <FiBriefcase className="su-input-icon" size={15} />
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Amina Hair Studio"
                    />
                  </div>
                </div>
                <div
                  className="su-field"
                  data-aos="fade-up"
                  data-aos-delay="340"
                >
                  <label htmlFor="businessType">Business Size</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                  >
                    <option value="small">Small Business</option>
                    <option value="medium">Medium Business</option>
                    <option value="large">Large Business</option>
                  </select>
                </div>
              </>
            )}

            <div
              className="su-field"
              data-aos="fade-up"
              data-aos-delay={isLogin ? "220" : "400"}
            >
              <label htmlFor="email">Email Address</label>
              <div className="su-input-wrap">
                <FiMail className="su-input-icon" size={15} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="amina@email.com"
                  required
                />
              </div>
            </div>

            <div
              className="su-field"
              data-aos="fade-up"
              data-aos-delay={isLogin ? "280" : "460"}
            >
              <label htmlFor="password">Password</label>
              <div className="su-input-wrap">
                <FiLock className="su-input-icon" size={15} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay={isLogin ? "340" : "520"}>
              <button type="submit" className="su-submit" disabled={isLoading}>
                {isLoading
                  ? "Please wait…"
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </div>
          </form>

          {/* Toggle */}
          <div
            className="su-toggle"
            data-aos="fade-up"
            data-aos-delay={isLogin ? "400" : "580"}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={toggle}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <p
            className="su-terms"
            data-aos="fade-up"
            data-aos-delay={isLogin ? "440" : "620"}
          >
            By continuing, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
