import { useAdminSidebar } from "../context/AdminSidebarContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";      

const AdminAuthLayout = () => {
    const { isSidebarOpen } = useAdminSidebar(); 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-grow overflow-hidden">
        <AdminSidebar />
        <div 
          className="flex-grow p-12 overflow-auto h-[calc(100vh-92px)]"
          style={{ 
            marginLeft: isSidebarOpen ? '0' : '-8px', // Slight overlap when closed for smoother UX
            paddingLeft: isSidebarOpen ? '48px' : '32px',
            transition: 'all 0.3s ease-in-out' 
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminAuthLayout