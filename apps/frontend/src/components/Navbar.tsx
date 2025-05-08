import { FiAlignCenter } from "react-icons/fi";
import { FaHeart, FaUser, FaProductHunt, FaTelegram } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import userImage from "../assets/images/profileprojectx.png";
import logo from "../assets/images/tinywalletLogo.png";
import { GoScreenFull, GoSignOut } from "react-icons/go";
const Navbar = ({isMobile}: {isMobile: boolean}) => {
  
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  return (
    <nav className="flex justify-between items-center px-8 py-6 shadow-sm">
      <div className="flex md:w-1/3 w-full items-center gap-4">
        <Link to="/">
          <img src={logo} alt="TinyWallet" className="w-48" />
        </Link>
        <button 
          onClick={toggleSidebar}
          className={`${isMobile ? 'hidden' : ''} rounded-full p-2 mt-2 transition-colors ${
            isSidebarOpen 
              ? 'bg-[#7F37D8] text-white' 
              : 'bg-[#fbf9fe] text-[#7F37D8]'
          }`}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <FiAlignCenter size={20}/>
        </button>
      </div>
      <div className="w-full md:w-2/3">
        <ProfileBar isMobile={isMobile}/>
      </div>
    </nav>
  );
};

export default Navbar; 

const ProfileBar = ({isMobile}: {isMobile: boolean}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleFavoritesClick = (event: MouseEvent) => {
      if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
        setIsFavoritesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleFavoritesClick);
    return () => {
      document.removeEventListener('mousedown', handleFavoritesClick);
    };
  }, []);

  return (
    <div className="flex justify-end md:justify-end md:items-center items-end gap-2">
      <div className={`items-center text-[#7F37D8] gap-10 px-10 ${isMobile ? 'hidden' : 'flex'}`}>
        <button 
          className="flex items-center gap-2"
          onClick={() => {
            if(!document.fullscreenElement){
              document.documentElement.requestFullscreen();
            }else{
              document.exitFullscreen();
            }
          }}
        >
          <GoScreenFull size={20}/>
        </button>
        <div ref={favoritesRef} className="relative">
          <button 
            className="flex items-center gap-2"
            onClick={() => {
              setIsFavoritesOpen(!isFavoritesOpen);
            }}
          >
            <FaHeart size={20} className="text-red-500"/>
          </button>
          {isFavoritesOpen && <FavoritesButton onClose={() => setIsFavoritesOpen(false)}/>}
        </div>
      </div>
      <div className="relative flex gap-8" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#fbf9fe] text-[#7F37D8]"
        >
          <img src={userImage} width={120} className="rounded-full w-24 lg:w-28"></img>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-12 mt-2 w-40 bg-white shadow-lg z-10 rounded-xl overflow-clip">
            <div className="">
              <div className="flex flex-col gap-1 justify-center items-center text-gray-700 border-b bg-[#7F37D8] px-4 py-2">
                <p className="font-medium text-white text-xl">{user?.username}</p>
                <p className="text-xs text-white">{user?.role}</p>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser />Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
               <GoSignOut /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FavoritesButton = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute -left-32 top-8 mt-2 w-64 bg-white shadow-lg z-10 rounded-xl overflow-clip">
            <div className="">
              <div className="flex flex-col gap-1 justify-center items-center text-gray-700 border-b bg-[#6428B0] px-4 py-6">
                <p className="font-medium text-white text-xl">Favorites</p>
              </div>
              <div className="grid grid-cols-3">
                <button
                  onClick={() => {
                    navigate('/link-short');
                    onClose();
                  }}
                  className="w-full flex flex-col justify-center gap-1 items-center text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-r border-gray-200"
                >
                  <FaUser />
                  <span className="text-xs font-semibold">Link</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/digital-products');
                    onClose();
                  }}
                  className="w-full flex flex-col justify-center text-center items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-r border-gray-200"
              >
                  <FaProductHunt/> 
                  <span className="text-xs font-semibold">Digital Product</span>
                </button>
                <button  
                  onClick={() => {
                    navigate('/telegram');
                    onClose();
                  }}
                  className="w-full flex flex-col justify-center text-center items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-r border-gray-200"
                >
                  <FaTelegram/>
                  <span className="text-xs font-semibold">Telegram</span>
                </button>
              </div>
            </div>
          </div>
  );
};
