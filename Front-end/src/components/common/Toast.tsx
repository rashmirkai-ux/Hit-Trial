import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-500 shrink-0" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md border border-slate-700/50 dark:border-slate-200 select-none max-w-md"
    >
      {getIcon()}
      <span className="truncate">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 text-slate-400 hover:text-white dark:hover:text-slate-900 p-0.5 rounded cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
