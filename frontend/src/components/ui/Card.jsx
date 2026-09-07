import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  icon: Icon,
  className = '',
  hoverEffect = true
}) => {
  return (
    <div className={`glass-panel rounded-xl p-5 border border-slate-800 ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}>
      {(title || subtitle || headerAction || Icon) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
