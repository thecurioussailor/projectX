import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for authentication with additional utility functions
 */
export const useAuth = (autoRedirect = false) => {
  const navigate = useNavigate();
  const { 
    user, 
    token,
    isAuthenticated, 
    isLoading, 
    error, 
    signin, 
    signup, 
    logout,
    updatePassword
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
  const handleSignin = async (username: string, password: string, loginMethod: 'email' | 'phone') => {
    const success = await signin(username, password, loginMethod);
    if (success) {
      const returnTo = localStorage.getItem('returnTo');
      if (returnTo) {
        localStorage.removeItem('returnTo');
        navigate(returnTo);
      } else {
        navigate('/dashboard');
      }
    }
    return success;
  };

  // Handle signup with navigation
  const handleSignup = async (email: string, fullName: string, phone: string, password: string) => {
    const success = await signup(email, fullName, phone, password);
    if (success) {
      const returnTo = localStorage.getItem('returnTo');
      if (returnTo) {
        localStorage.removeItem('returnTo');
        navigate(returnTo);
      } else {
        navigate('/dashboard');
      }
    }
    return success;
  };

  // Handle logout with navigation
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const enhancedUpdatePassword = useCallback(
    async (oldPassword: string, newPassword: string, confirmPassword: string) => {
      if (!token) {
        throw new Error("You must be logged in to update your password");
      };
      try {
        const success = await updatePassword(oldPassword, newPassword, confirmPassword);
        return success;
      } catch {
        return false;
      }
    },
    [updatePassword, token]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signin: handleSignin,
    signup: handleSignup,
    logout: handleLogout,
    updatePassword: enhancedUpdatePassword
  };
}; 