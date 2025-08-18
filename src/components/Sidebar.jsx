import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiTrendingUp, 
  FiDollarSign,
  FiCreditCard,
  FiUsers, 
  FiSettings, 
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiFileText,
  FiBarChart,
  FiShoppingBag,
  FiAward,
  FiWifi,
  FiWifiOff,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { MdBusinessCenter, MdQrCodeScanner } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ userData, isOnline = true, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true' || false
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Detect mobile/desktop and handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      
      // Close mobile sidebar when resizing to desktop
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  const quickActions = [
    { 
      id: 'add-sale', 
      label: 'Add Sale', 
      icon: FiPlus, 
      action: () => navigate('/add-sale'),
      color: 'success'
    },
    { 
      id: 'add-expense', 
      label: 'Add Expense', 
      icon: FiCreditCard, 
      action: () => navigate('/add-expense'),
      color: 'warning'
    },
    { 
      id: 'send-receipt', 
      label: 'Send Receipt', 
      icon: BsWhatsapp, 
      action: () => navigate('/send-receipt'),
      color: 'whatsapp'
    }
  ];

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: FiHome, 
      path: '/dashboard',
      description: 'Business overview & insights'
    },
    { 
      id: 'money-in-out', 
      label: 'Money In/Out', 
      icon: FiDollarSign, 
      path: '/cashflow',
      description: 'Track sales & expenses',
      badge: userData?.todayTransactions || null
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: FiUsers, 
      path: '/customers',
      description: 'Contact & purchase history'
    },
    { 
      id: 'receipts', 
      label: 'Receipts & Promos', 
      icon: BsWhatsapp, 
      path: '/receipts',
      description: 'WhatsApp receipts & templates'
    },
    { 
      id: 'reports', 
      label: 'Reports & Analytics', 
      icon: FiBarChart, 
      path: '/reports',
      description: 'Profit, trends & AI insights'
    },
    { 
      id: 'payments', 
      label: 'Payments & Wallet', 
      icon: MdQrCodeScanner, 
      path: '/payments',
      description: 'QR codes & wallet balance'
    },
  ];

  const businessItems = [
    { 
      id: 'cac-registration', 
      label: 'Register Business', 
      icon: MdBusinessCenter, 
      path: '/cac-registration',
      description: 'CAC registration & verification',
      highlight: !userData?.isRegistered
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: FiShoppingBag, 
      path: '/marketplace',
      description: 'Your business listing',
      premium: userData?.plan === 'Free'
    },
    { 
      id: 'growth-coach', 
      label: 'AI Business Coach', 
      icon: FiAward, 
      path: '/growth-coach',
      description: 'Tips & health score',
      premium: userData?.plan === 'Free'
    },
  ];

  const bottomMenuItems = [
    { 
      id: 'help', 
      label: 'Help & Support', 
      icon: FiHelpCircle, 
      path: '/support',
      description: 'Get assistance'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: FiSettings, 
      path: '/settings',
      description: 'Account & preferences'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleQuickAction = (action) => {
    action();
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hussleWiseUser');
    navigate('/signup#login');
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState);
    
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
    // On mobile, always show expanded view when opened
    if (!isMobileOpen) {
      setIsCollapsed(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // On mobile, we never want collapsed state when sidebar is open
  const shouldShowCollapsed = isCollapsed && !(isMobile && isMobileOpen);

  return (
    <>
      {/* Mobile Menu Toggle - Only shown on mobile when sidebar is closed */}
      {isMobile && !isMobileOpen && (
        <button 
          className="hw-mobile-menu-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
      )}

      {/* Mobile Overlay - Only shown on mobile when sidebar is open */}
      {isMobile && isMobileOpen && (
        <div 
          className="hw-mobile-overlay"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`hw-sidebar ${shouldShowCollapsed ? 'collapsed' : ''} ${isMobile && isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Scrollable Content Area */}
        <div className="hw-sidebar-scrollable">
          {/* Sidebar Header */}
          <div className="hw-sidebar-header">
            <div className="hw-logo">
              <h2 className={`hw-logo-text ${shouldShowCollapsed ? 'hidden' : ''}`}>
                Hussle<span>Wise</span>
              </h2>
              {shouldShowCollapsed && <div className="hw-logo-mini">HW</div>}
            </div>
            
            {/* Connection Status */}
            <div className={`hw-connection-status ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? <FiWifi /> : <FiWifiOff />}
            </div>
            
            {/* Desktop Toggle - Only shown on desktop */}
            {!isMobile && (
              <button 
                className="hw-sidebar-toggle desktop-only"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              </button>
            )}

            {/* Mobile Close - Only shown on mobile */}
            {isMobile && isMobileOpen && (
              <button 
                className="hw-sidebar-close mobile-only"
                onClick={toggleMobileSidebar}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* User Info */}
          {userData && (
            <div className="hw-user-info">
              <div className="hw-user-avatar">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              {!shouldShowCollapsed && (
                <div className="hw-user-details">
                  <h3 className="hw-user-name">{userData.name}</h3>
                  <p className="hw-user-business">{userData.business}</p>
                  <div className="hw-user-stats">
                    <span className={`hw-user-plan plan-${userData.plan?.toLowerCase()}`}>
                      {userData.plan || 'Free'} Plan
                    </span>
                    {userData?.businessHealthScore && (
                      <span className="hw-health-score">
                        Health: {userData.businessHealthScore}/100
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {!shouldShowCollapsed && (
            <div className="hw-quick-actions">
              <h4 className="hw-section-title">Quick Actions</h4>
              <div className="hw-action-buttons">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      className={`hw-action-btn hw-${action.color}`}
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <Icon className="hw-action-icon" />
                      <span className="hw-action-label">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="hw-sidebar-nav">
            {/* Main Menu Items */}
            <ul className="hw-nav-list">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="hw-nav-item">
                    <button
                      className={`hw-nav-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => handleNavigation(item.path)}
                      title={shouldShowCollapsed ? item.label : ''}
                    >
                      <Icon className="hw-nav-icon" />
                      {!shouldShowCollapsed && (
                        <div className="hw-nav-content">
                          <span className="hw-nav-label">{item.label}</span>
                          <span className="hw-nav-description">{item.description}</span>
                        </div>
                      )}
                      {item.badge && !shouldShowCollapsed && (
                        <span className="hw-nav-badge">{item.badge}</span>
                      )}
                      {item.highlight && <div className="hw-highlight-dot"></div>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Business Growth Section */}
            <div className="hw-nav-section">
              {!shouldShowCollapsed && <h4 className="hw-section-title">Business Growth</h4>}
              <ul className="hw-nav-list">
                {businessItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className="hw-nav-item">
                      <button
                        className={`hw-nav-link ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                        onClick={() => handleNavigation(item.path)}
                        title={shouldShowCollapsed ? item.label : ''}
                      >
                        <Icon className="hw-nav-icon" />
                        {!shouldShowCollapsed && (
                          <div className="hw-nav-content">
                            <span className="hw-nav-label">
                              {item.label}
                              {item.premium && <span className="hw-pro-tag">PRO</span>}
                            </span>
                            <span className="hw-nav-description">{item.description}</span>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Today's Summary */}
            {userData?.todaySummary && !shouldShowCollapsed && (
              <div className="hw-today-summary">
                <h4>Today's Summary</h4>
                <div className="hw-summary-stats">
                  <div className="hw-stat">
                    <span className="hw-stat-label">Sales</span>
                    <span className="hw-stat-value hw-positive">₦{userData.todaySummary.sales?.toLocaleString()}</span>
                  </div>
                  <div className="hw-stat">
                    <span className="hw-stat-label">Net Profit</span>
                    <span className={`hw-stat-value ${userData.todaySummary.profit >= 0 ? 'hw-positive' : 'hw-negative'}`}>
                      ₦{userData.todaySummary.profit?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Banner */}
            {userData?.plan === 'Free' && !shouldShowCollapsed && (
              <div className="hw-upgrade-banner">
                <div className="hw-upgrade-content">
                  <h4>Upgrade to Premium</h4>
                  <p>Unlock AI insights, unlimited receipts & marketplace priority</p>
                  <button 
                    className="hw-upgrade-btn"
                    onClick={() => handleNavigation('/pricing')}
                  >
                    Upgrade for ₦1,000/month
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Menu - Fixed outside scrollable area */}
        <div className="hw-sidebar-bottom">
          <ul className="hw-nav-list">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="hw-nav-item">
                  <button
                    className={`hw-nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.path)}
                    title={shouldShowCollapsed ? item.label : ''}
                  >
                    <Icon className="hw-nav-icon" />
                    {!shouldShowCollapsed && (
                      <div className="hw-nav-content">
                        <span className="hw-nav-label">{item.label}</span>
                        <span className="hw-nav-description">{item.description}</span>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Logout */}
          <button
            className="hw-nav-link hw-logout-btn"
            onClick={handleLogout}
            title={shouldShowCollapsed ? 'Logout' : ''}
          >
            <FiLogOut className="hw-nav-icon" />
            {!shouldShowCollapsed && (
              <div className="hw-nav-content">
                <span className="hw-nav-label">Logout</span>
                <span className="hw-nav-description">Sign out of account</span>
              </div>
            )}
          </button>
        </div>

        {/* Collapse Toggle for Mobile - Only shown when collapsed on mobile */}
        {shouldShowCollapsed && isMobile && (
          <button 
            className="hw-mobile-expand-toggle"
            onClick={toggleMobileSidebar}
            aria-label="Expand menu"
          >
            <FiChevronRight />
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;