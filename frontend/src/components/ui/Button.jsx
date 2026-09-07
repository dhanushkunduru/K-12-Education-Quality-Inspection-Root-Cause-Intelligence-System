import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ai, ghost
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 focus:ring-brand-500',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    outline: 'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 hover:text-white focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-500',
    ai: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 focus:ring-purple-500 ai-card-glow',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 focus:ring-slate-500'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
