import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrendingUp, FiPieChart, FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './dashboard.css';
import Sidebar from '../components/Sidebar';

// Import mock data
import { users } from '../mock/users';
import { smallBusinessData } from '../mock/smallBusiness';
import { mediumBusinessData } from '../mock/mediumBusiness';
import { largeBusinessData } from '../mock/largeBusiness';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    const loadUserData = () => {
      // Get logged in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem('hussleWiseUser'));
      
      if (!loggedInUser) {
        navigate('/signup#login');
        return;
      }

      // Find user in our mock database
      const user = users.find(u => u.email === loggedInUser.email);
      
      if (!user) {
        navigate('/signup#login');
        return;
      }

      // Load business data based on user type
      let businessData;
      switch(user.type) {
        case 'small':
          businessData = smallBusinessData;
          break;
        case 'medium':
          businessData = mediumBusinessData;
          break;
        case 'large':
          businessData = largeBusinessData;
          break;
        default:
          businessData = smallBusinessData;
      }

      setUserData(user);
      setBusinessData(businessData);
      setIsLoading(false);
    };

    loadUserData();
    AOS.refresh();
  }, [navigate]);

  // Handle sidebar state changes
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!userData || !businessData) {
    return <div>No user data found. Please login again.</div>;
  }

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar 
        userData={userData} 
        onToggle={handleSidebarToggle}
      />

      {/* Dashboard Content */}
      <div className={`dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header */}
        <header className="dashboard-header" data-aos="fade-down">
          <h1 data-aos="fade-right" data-aos-delay="100">
            Hello, {userData.name}! <span className="business-name">{userData.business}</span>
          </h1>
          <div className="quick-actions" data-aos="fade-left" data-aos-delay="200">
            <Link to="/add-sale">
            <button className="action-btn">
              <FiDollarSign /> Add Sale
            </button>
            </Link>
            <Link to="/add-expense">
            <button className="action-btn">
              <FiShoppingCart /> Add Expense
            </button>
            </Link>
            <Link to="/send-receipt">
            <button className="action-btn whatsapp-btn">
              <BsWhatsapp /> Send Receipt
            </button>
            </Link>
          </div>
        </header>

        {/* Key Metrics */}
        <section className="metrics-grid">
          <div className="metric-card today-summary" data-aos="fade-up" data-aos-delay="100">
            <h3>Today's Summary</h3>
            <div className="metric-values">
              <div data-aos="fade-right" data-aos-delay="150">
                <span className="metric-label">Money In</span>
                <span className="money-in">₦{businessData.metrics.todaySales.toLocaleString()}</span>
              </div>
              <div data-aos="fade-right" data-aos-delay="200">
                <span className="metric-label">Money Out</span>
                <span className="money-out">₦{businessData.metrics.todayExpenses.toLocaleString()}</span>
              </div>
              <div data-aos="fade-right" data-aos-delay="250">
                <span className="metric-label">Balance</span>
                <span className="balance">₦{businessData.metrics.balance.toLocaleString()}</span>
              </div>
            </div>
            <p className="profit-message" data-aos="fade-up" data-aos-delay="300">
              Net Profit: ₦{businessData.metrics.balance.toLocaleString()}
            </p>
          </div>

          {/* Business Health Card */}
          <div className="metric-card health-card" data-aos="fade-up" data-aos-delay="150">
            <h3>Business Health</h3>
            <div className="health-score">
              <div style={{ width: 120, height: 120 }} data-aos="zoom-in" data-aos-delay="200">
                <CircularProgressbar 
                  value={businessData.metrics.businessHealth} 
                  text={`${businessData.metrics.businessHealth}`}
                  styles={{
                    path: {
                      stroke: `#1C5B56`,
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                    },
                    text: {
                      fill: '#0E1B1A',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    },
                    trail: {
                      stroke: '#e5e7eb',
                    }
                  }}
                />
              </div>
              <div className="health-tips" data-aos="fade-left" data-aos-delay="250">
                {businessData.metrics.businessHealth > 75 ? (
                  <p>Excellent! Your business is thriving!</p>
                ) : businessData.metrics.businessHealth > 50 ? (
                  <p>Good! Keep tracking to improve further.</p>
                ) : (
                  <p>Needs attention. Track more transactions.</p>
                )}
                <button className="upgrade-btn">View Insights →</button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="metric-card transactions-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Recent Activity</h3>
            <div className="transactions-list">
              {businessData.transactions.map((txn, index) => (
                <div 
                  key={txn.id} 
                  className="transaction-item"
                  data-aos="fade-up"
                  data-aos-delay={300 + (index * 50)}
                >
                  <div className="txn-icon">
                    {txn.type === "Money In" ? (
                      <RiMoneyDollarCircleLine className="money-in-icon" />
                    ) : (
                      <FiShoppingCart className="money-out-icon" />
                    )}
                  </div>
                  <div className="txn-details">
                    <p className="txn-description">{txn.description}</p>
                    <p className="txn-date">{txn.date}</p>
                  </div>
                  <div className={`txn-amount ${txn.type === "Money In" ? 'money-in' : 'money-out'}`}>
                    {txn.type === "Money In" ? '+' : '-'}₦{txn.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" data-aos="fade-up" data-aos-delay="450">
              View All Transactions
            </button>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="chart-card" data-aos="fade-right" data-aos-delay="100">
            <h3>Weekly Trend</h3>
            <div className="chart-placeholder">
              <p>Last 7 days sales:</p>
              <ul className="weekly-data">
                {businessData.metrics.weeklyTrend.map((amount, index) => (
                  <li key={index} data-aos="fade-right" data-aos-delay={150 + (index * 50)}>
                    Day {index + 1}: ₦{amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chart-card" data-aos="fade-left" data-aos-delay="150">
            <h3>Top Products</h3>
            <div className="chart-placeholder">
              <p>Best selling items:</p>
              <ul>
                {businessData.metrics.topProducts.map((product, index) => (
                  <li key={index} data-aos="fade-left" data-aos-delay={200 + (index * 50)}>
                    {product.name}: ₦{product.sales.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="chart-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Expense Breakdown</h3>
            <div className="chart-placeholder">
              <p>Where your money goes:</p>
              <ul>
                {businessData.metrics.expenseCategories.map((cat, index) => (
                  <li key={index} data-aos="fade-up" data-aos-delay={250 + (index * 50)}>
                    {cat.name}: {cat.value}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;