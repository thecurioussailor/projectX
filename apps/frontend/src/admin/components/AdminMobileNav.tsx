import { useState, useRef, useEffect    } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const AdminMobileNav = () => {
    const sidebarItems = [
        { name: 'Dashboard', icon: <IoHomeOutline size={20}/>, path: '/admin/dashboard' },
        { name: 'Payouts', icon: <CiMoneyCheck1 size={20}/>, path: '/admin/payout-management' },
        { name: 'KYC', icon: <CiMoneyCheck1 size={20}/>, path: '/admin/kyc-documents' }, 
      ];    

    const menuItems = [
        { name: 'Plans', icon: <IoSettingsOutline size={20}/>, path: '/admin/plan-management' },
        { name: 'Users', icon: <FaRegUser size={20}/>, path: '/admin/user-management' },
        { name: 'Settings', icon: <IoSettingsOutline size={20}/>, path: '/admin/settings' }
    ]

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsMenuOpen(false);
          }
        };
    
        if (isMenuOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isMenuOpen]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex justify-between items-center p-4 px-8">
            {sidebarItems.map((item) => (
                <Link to={item.path} key={item.name}>
                    <div className="flex flex-col items-center text-gray-500 p-2 rounded-full hover:bg-gray-100">
                        {item.icon}
                    </div>
                </Link>
            ))}
            <div ref={menuRef} className="relative flex items-center justify-center">
                <button 
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    <BsThreeDots />
                </button>
                {isMenuOpen && (
                    <div className="absolute bottom-full -left-44 bg-white shadow-md w-48 rounded-lg p-4 flex flex-col gap-4">
                        {menuItems.map((item) => (
                            <button onClick={() => {navigate(item.path); setIsMenuOpen(false)}} key={item.name} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                                {item.icon}
                                <span className="text-sm">{item.name}</span>
                            </button> 
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default AdminMobileNav