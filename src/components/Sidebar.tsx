import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Receipt, HandCoins, FileText, Landmark,
  TrendingUp, Store, Building2, Settings as SettingsIcon, Package,
  Users, CircleDollarSign, Sparkles, LogOut, Menu, X
} from 'lucide-react';
import logo from '../assets/images/logo.png';
import { useBusinessData } from '../context/BusinessDataContext';
import { ROLE_PAGE_ACCESS } from '../types';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/app/sales', label: 'Sales & Expenses', icon: Receipt },
  { to: '/app/debts', label: 'Who Owes Me', icon: HandCoins },
  { to: '/app/inventory', label: 'Inventory', icon: Package },
  { to: '/app/storefront', label: 'My Storefront', icon: Store },
  { to: '/app/receipts', label: 'Receipts', icon: FileText },
  { to: '/app/get-paid', label: 'Get Paid', icon: Landmark },
  { to: '/app/growth', label: 'Growth Tools', icon: TrendingUp },
  // { to: '/app/marketplace', label: 'Marketplace', icon: Store },
  { to: '/app/registration', label: 'Business Registration', icon: Building2 },
  // { to: '/app/offline-sync', label: 'Offline Sync', icon: MessageSquare },
  { to: '/app/loans', label: 'Funding', icon: CircleDollarSign },
  { to: '/app/staff', label: 'Staff', icon: Users },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, currentUserRole } = useBusinessData();

  const visibleNavItems =
    currentUserRole && currentUserRole !== 'owner'
      ? navItems.filter((item) => ROLE_PAGE_ACCESS[currentUserRole].includes(item.to))
      : navItems;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Log out of Husslewise?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-primary flex items-center justify-between px-4 z-40">
        <img src={logo} alt="Husslewise" className="h-6" />
        <button onClick={() => setMobileOpen(true)} className="text-brand-bg">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 h-screen bg-brand-primary text-brand-bg flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <img src={logo} alt="Husslewise" className="h-9" />
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-brand-bg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {visibleNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 font-body text-sm transition-colors ${
                  isActive ? 'bg-brand-accent text-brand-ink font-bold' : 'hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg font-body text-sm text-brand-bg/80 hover:bg-white/10 hover:text-brand-bg transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}