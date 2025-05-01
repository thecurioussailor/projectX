import { useAdminSidebar } from "../context/AdminSidebarContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";      
import { useState, useEffect } from "react";
import AdminMobileNav from "../components/AdminMobileNav";

const AdminAuthLayout = () => {
    const { isSidebarOpen } = useAdminSidebar(); 
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
      <AdminNavbar isMobile={isMobile}/>
      <div className="flex flex-grow overflow-hidden">
        {isMobile ? <AdminMobileNav /> : <AdminSidebar />}
        {isMobile ? (
          <div 
          className="flex-grow p-4 overflow-auto h-[calc(100vh-92px)]"
        >
          <Outlet />
        </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default AdminAuthLayout