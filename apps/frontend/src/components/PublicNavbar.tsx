import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useRef } from 'react';
import { useState } from 'react';
const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="flex justify-between items-center px-8 py-6 shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-3xl font-bold">projectX</Link>
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
      <div className="flex items-center gap-2 w-96">
        <div className="text-[#7F37D8]">
          <CiSearch size={20}/>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-5 pr-3 text-gray-600 bg-transparent border-0 border-l border-purple-100 focus:outline-none focus:ring-0 placeholder-purple-200"
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full bg-[#fbf9fe] p-2 text-[#7F37D8]"
        >
          <FaUser size={20}/>
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