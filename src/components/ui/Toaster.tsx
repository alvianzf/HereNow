import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <Check className="h-5 w-5 text-success" />;
    case 'error':
      return <X className="h-5 w-5 text-error" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary" />;
    default:
      return null;
  }
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-white';
    }
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 shadow-md ${getBgColor()}`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <ToastIcon type={toast.type} />
        </div>
        <div className="text-sm font-medium">{toast.message}</div>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export const Toaster = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col space-y-2 md:m-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300 ease-in-out"
        >
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

// Export a pre-connected component
export default function ToasterWithProvider() {
  return (
    <ToastProvider>
      <Toaster />
    </ToastProvider>
  );
}