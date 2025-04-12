import { FaChartLine, FaLink, FaProductHunt, FaTelegram } from "react-icons/fa";
import { IoHomeOutline, IoPeopleOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();
  
  const sidebarItems = [
    { name: 'Dashboard', icon: <IoHomeOutline size={20}/>, path: '/dashboard' },
    { name: 'Sales', icon: <FaChartLine size={20}/>, path: '/sales' },
    { name: 'Payments', icon: <MdOutlinePayment size={20}/>, path: '/payments' },
    { name: 'Purchased', icon: <IoPeopleOutline size={20}/>, path: '/purchased' },
    { name: 'Links', icon: <FaLink size={20}/>, path: '/link-short' },
    { name: 'Telegram', icon: <FaTelegram size={20}/>, path: '/telegram' },
    { name: 'Products', icon: <FaProductHunt size={20}/>, path: '/digital-products' },
    { name: 'Settings', icon: <IoSettingsOutline size={20}/>, path: '/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;
  if(isSidebarOpen){
  return (
    <div className="bg-white w-24 shadow-md flex flex-col h-[calc(100vh-92px)] transition-all duration-300 ease-in-out">
      <div 
        className="flex flex-col flex-grow overflow-y-auto scrollbar scrollbar-thin" 
        style={{ 
          scrollbarWidth: 'none', 
          scrollbarColor: '#7e37d8 transparent'
        }}
      >
        {sidebarItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className={`flex flex-col font-medium text-sm items-center justify-center p-4 min-h-[80px] ${
              isActive(item.path) 
                ? 'bg-[#7e37d8] text-white' 
                : 'text-gray-600 hover:bg-[#ece2f9] hover:text-[#7e37d8]'
            }`}
          >
            {item.icon}
            <span className="mt-1 text-center">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );}
};

export default Sidebar;

    