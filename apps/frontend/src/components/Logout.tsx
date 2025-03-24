import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className = '' }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-red-600 hover:text-red-800 ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton; 