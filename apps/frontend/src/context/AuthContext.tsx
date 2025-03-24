import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore, User } from '../store/useAuthStore';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    setToken, 
    logout: zustandLogout 
  } = useAuthStore();

  const login = (userData: { user: User; token: string }) => {
    // Use the token setter from zustand
    setToken(userData.token);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated, 
        login, 
        logout: zustandLogout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Keep the useAuth interface compatible with existing code
// but redirect to our Zustand hook in the future
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 