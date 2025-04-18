import { createContext, useContext, ReactNode } from 'react';
import { useAdmin } from '../hooks/useAdmin';

// Define the Admin user type
interface AdminUser {
  id: number;
  username: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    token, 
    isAuthenticated,
    isLoading,
    error,
    signin,
    logout,
  } = useAdmin();

  const login = async (username: string, password: string) => {
    return await signin(username, password);
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated,
        isLoading,
        error,
        login, 
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 