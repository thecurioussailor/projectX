import { useCallback, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

// Renamed from UseAdminOptions to AdminHookOptions to avoid naming conflicts
interface AdminHookOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

// Export the hook with the desired name
export function useAdmin(options: AdminHookOptions = {}) {
  const { redirectTo, redirectIfFound } = options;
  const navigate = useNavigate();

  const { isAuthenticated, user, token, error, isLoading, signin, logout, updatePassword } = useAdminStore();

  // Handle redirects based on authentication status
  useEffect(() => {
    if (redirectTo && !redirectIfFound && !isAuthenticated) {
      navigate(redirectTo);
    } else if (redirectTo && redirectIfFound && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectIfFound, redirectTo]);

  // Enhanced signin with navigation
  const enhancedSignin = useCallback(
    async (username: string, password: string) => {
      try {
        const success = await signin(username, password);
        if (success && redirectTo && redirectIfFound) {
          navigate(redirectTo);
        }
        return success;
      } catch {
        return false;
      }
    },
    [signin, navigate, redirectTo, redirectIfFound]
  );

  // Enhanced logout with navigation
  const enhancedLogout = useCallback(() => {
    logout();
    if (redirectTo && !redirectIfFound) {
      navigate(redirectTo);
    }
  }, [logout, navigate, redirectTo, redirectIfFound]);

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
    isAuthenticated,
    isLoading,
    error,
    user,
    token,
    signin: enhancedSignin,
    logout: enhancedLogout,
    updatePassword: enhancedUpdatePassword,
  };
}
