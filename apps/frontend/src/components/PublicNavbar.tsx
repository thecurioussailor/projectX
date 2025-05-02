import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userImage from "../assets/images/profileprojectx.png";
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import logo from "../assets/images/tinywalletLogo.png";
const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="flex justify-between items-center px-8 py-6 shadow-sm bg-[#FBF9FE]">
      <div className="flex items-center gap-4">
        <Link to="/">
          <img src={logo} alt="TinyWallet" className="w-48" />
        </Link>
      </div>
      <div>
        {isAuthenticated ? <ProfileBar /> : <Link 
          to="/signin" 
          className="px-4 py-2 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-[#7F37D8] hover:bg-[#6c2eb9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F37D8]"
        >
          Sign In
        </Link>}
      </div>
    </nav>
  );
};

export default PublicNavbar; 

const ProfileBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="relative" ref={dropdownRef}>
      <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#fbf9fe] text-[#7F37D8]"
        >
          <img src={userImage} width={120} className="rounded-full w-24 lg:w-28"></img>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg z-10 rounded-xl overflow-clip">
            <div className="">
              <div className="flex flex-col gap-1 justify-center items-center text-gray-700 border-b bg-[#7F37D8] px-4 py-2">
                <p className="font-medium text-white text-xl">{user?.username || 'User'}</p>
                <p className="text-xs text-white">{user?.role || 'Teacher'}</p>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};