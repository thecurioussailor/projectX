import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../context/SidebarContext';
import { useEffect, useState } from 'react';
import MobileNav from '../components/MobileNav';
const AuthLayout = () => {
  const { isSidebarOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        {isMobile ? <MobileNav /> : <Sidebar />}
        <div 
          className="flex-grow p-12 overflow-auto h-[calc(100vh-92px)]"
          style={{ 
            marginLeft: isSidebarOpen ? '0' : '-8px', // Slight overlap when closed for smoother UX
            paddingLeft: isSidebarOpen ? '48px' : '44px',
            transition: 'all 0.3s ease-in-out' 
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 