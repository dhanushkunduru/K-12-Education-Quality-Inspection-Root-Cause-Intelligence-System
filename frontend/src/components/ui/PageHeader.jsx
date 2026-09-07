import React from 'react';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
      <div>
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-brand-400 font-semibold' : ''}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
