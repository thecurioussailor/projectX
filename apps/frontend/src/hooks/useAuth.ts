import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for authentication with additional utility functions
 */
export const useAuth = (autoRedirect = false) => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    signin, 
    signup, 
    logout 
  } = useAuthStore();

  // Redirect based on authentication status
  useEffect(() => {
    if (autoRedirect) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else if (!isLoading && !isAuthenticated) {
        navigate('/signin');
      }
    }
  }, [isAuthenticated, isLoading, navigate, autoRedirect]);

  // Handle signin with navigation
  const handleSignin = async (username: string, password: string) => {
    const success = await signin(username, password);
    if (success) {
      navigate('/dashboard');
    }
    return success;
  };

  // Handle signup with navigation
  const handleSignup = async (username: string, password: string) => {
    const success = await signup(username, password);
    if (success) {
      navigate('/dashboard');
    }
    return success;
  };

  // Handle logout with navigation
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signin: handleSignin,
    signup: handleSignup,
    logout: handleLogout
  };
}; 