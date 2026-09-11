import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { BusinessDataProvider } from './context/BusinessDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';

// Public pages
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Storefront from './pages/Storefront';
import NotFound from './pages/NotFound';
import StaffInvite from './pages/StaffInvite';

// App pages
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Debts from './pages/Debts';
import Inventory from './pages/Inventory';
import Receipts from './pages/Receipts';
import CustomReceipt from './pages/CustomReceipt';
import GetPaid from './pages/GetPaid';
import GrowthTools from './pages/GrowthTools';
import Marketplace from './pages/Marketplace';
import BusinessRegistration from './pages/BusinessRegistration';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import StorefrontManager from './pages/StorefrontManager';
import OfflineSync from './pages/OfflineSync';
import Staff from './pages/Staff';
import Microloans from './pages/Microloans';
import Assistant from './pages/Assistant';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BusinessDataProvider>
      <ScrollToTop />
      <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store/:businessSlug" element={<Storefront />} />
      </Route>

      {/* Auth pages — no navbar/footer */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/staff-invite" element={<StaffInvite />} />

    {/* App (dashboard) */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RequireRole />}>
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="sales" element={<Sales />} />
        <Route path="debts" element={<Debts />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="receipts/custom" element={<CustomReceipt />} />
        <Route path="get-paid" element={<GetPaid />} />
        <Route path="growth" element={<GrowthTools />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="registration" element={<BusinessRegistration />} />
        <Route path="storefront" element={<StorefrontManager />} />
        <Route path="offline-sync" element={<OfflineSync />} />
        <Route path="staff" element={<Staff />} />
        <Route path="settings" element={<Settings />} />
        <Route path="loans" element={<Microloans />} />
        <Route path="assistant" element={<Assistant />} />
      </Route>
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
      </Routes>
    </BusinessDataProvider>
  );
}

export default App;