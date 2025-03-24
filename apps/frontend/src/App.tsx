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
import Settings from './pages/Settings'
import { SidebarProvider } from './context/SidebarContext'
import Audience from './pages/Audience'
import Profile from './pages/Profile'
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
          </Route>

          {/* Protected Routes with AuthLayout */}
          <Route
            element={
                <SidebarProvider>
                  
                    <AuthLayout />
                 
                </SidebarProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/audience" element={<Audience />} />
            <Route path="/purchased" element={<Purchased />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/telegram" element={<Telegram />} />
            <Route path="/link-short" element={<LinkShort />} />
            <Route path="/digital-product" element={<DigitalProduct />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
