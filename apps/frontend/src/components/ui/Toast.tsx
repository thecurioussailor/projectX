import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Types
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// Toast Item Component
const ToastItem: React.FC<Toast> = ({ message, type }) => {
  const getToastStyles = () => {
    const baseStyles = "px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out w-80 max-w-sm break-words";
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      warning: "bg-yellow-500 text-white",
    };
    return `${baseStyles} ${typeStyles[type]}`;
  };

  return (
    <div
      className={getToastStyles()}
      role="alert"
      aria-live="assertive"
    >
      <div className="text-sm leading-relaxed">
        {message}
      </div>
    </div>
  );
};

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};