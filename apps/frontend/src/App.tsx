import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import PublicLayout from './layouts/PublicLayout'
import Sales from './pages/Sales'
import Purchased from './pages/Purchased'
import Payments from './pages/Payments'
import Telegram from './pages/Telegram'
import LinkShort from './pages/LinkShort'
import DigitalProduct from './pages/DigitalProduct'
import EditDigitalProduct from './pages/EditDigitalProduct'
import Settings from './pages/Settings'
import { SidebarProvider } from './context/SidebarContext'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import PublicChannelPage from './pages/PublicChannelPage'
import PublicDigitalProductPage from './pages/PublicDigitalProductPage'
import EditTelegramChannel from './pages/EditTelegramChannel'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import PaymentCallback from './pages/PaymentCallback'
import PurchasedDigitalProducts from './pages/PurchasedDigitalProducts'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminSignin from './admin/pages/AdminSignin'
import AdminAuthLayout from './admin/layouts/AdminAuthLayout'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import { AdminSidebarProvider } from './admin/context/AdminSidebarContext'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute'
import AdminSettings from './admin/pages/AdminSettings'
import AdminUserManagement from './admin/pages/AdminUserManagement'
import AdminPlanManagement from './admin/pages/AdminPlanManagement'
import AdminPayoutManagement from './admin/pages/AdminPayoutManagement'
import LandingPage2 from './pages/LandingPage2'
import UserDetails from './admin/pages/UserDetails'
import AdminEditPlatformPlan from './admin/pages/AdminEditPlatformPlan'
import AdminKyc from './admin/pages/AdminKyc'
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with PublicLayout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-page-2" element={<LandingPage2 />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route element={<PublicLayout />}>
            <Route path="/c/:slug" element={<PublicChannelPage />} />
            <Route path="/d/:slug" element={<PublicDigitalProductPage />} />
          </Route>

          {/* Protected Routes with AuthLayout */}
          <Route
            element={
              <SidebarProvider>
                <ProtectedRoute>
                  <AuthLayout />
                </ProtectedRoute>
              </SidebarProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchased" element={<Purchased />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/telegram" element={<Telegram />} />
            <Route path="/telegram/:id/edit" element={<EditTelegramChannel />} />
            <Route path="/link-short" element={<LinkShort />} />
            <Route path='/digital-products' element={<DigitalProduct />} />
            <Route path='/digital-products/:id/edit' element={<EditDigitalProduct />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/purchased-digital-products/:id" element={<PurchasedDigitalProducts />} />
          </Route>
          {/* Protected Routes with AuthLayout */}
          <Route path="/admin" element={
            <AdminAuthProvider>
              <AdminSidebarProvider>
                <AdminProtectedRoute>
                  <AdminAuthLayout />
                </AdminProtectedRoute>
              </AdminSidebarProvider>
            </AdminAuthProvider>
            }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<AdminUserManagement />} />
            <Route path="user-management/:id" element={<UserDetails />} />
            <Route path="plan-management" element={<AdminPlanManagement />} />
            <Route path="plan-management/:id" element={<AdminEditPlatformPlan />} />
            <Route path="payout-management" element={<AdminPayoutManagement />} />
            <Route path="kyc-documents" element={<AdminKyc />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
