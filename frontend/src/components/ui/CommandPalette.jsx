import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardCheck, AlertTriangle, ShieldCheck, FileText, School, ArrowRight, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { inspections, defects, capas, schools } = useData();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If parent gave toggle callback or we listen to key event
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = [];

  if (query.trim()) {
    const q = query.toLowerCase();

    inspections.filter(i => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)).forEach(i => {
      results.push({ type: 'Inspection', title: i.title, subtitle: `${i.id} • ${i.schoolName}`, route: '/inspections', icon: ClipboardCheck });
    });

    defects.filter(d => d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)).forEach(d => {
      results.push({ type: 'Defect', title: d.title, subtitle: `${d.id} • ${d.category}`, route: '/defects', icon: AlertTriangle });
    });

    capas.filter(c => c.defectTitle.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).forEach(c => {
      results.push({ type: 'CAPA', title: c.defectTitle, subtitle: `${c.id} • ${c.ownerName}`, route: '/capa', icon: ShieldCheck });
    });

    schools.filter(s => s.name.toLowerCase().includes(q)).forEach(s => {
      results.push({ type: 'School', title: s.name, subtitle: `${s.code} • ${s.campus}`, route: '/dashboard', icon: School });
    });
  }

  const handleSelect = (route) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-brand-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search inspections, defects, CAPAs, schools... (Type to search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-6 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-400">Quick Command Palette Search</p>
              <p className="mt-1">Try typing <span className="text-brand-400">"Attendance"</span>, <span className="text-brand-400">"Oakridge"</span>, or <span className="text-brand-400">"INS-2026"</span></p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching entity records found for "{query}"
            </div>
          ) : (
            results.map((res, idx) => {
              const Icon = res.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(res.route)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-brand-400 border border-slate-700/60 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-2">
                        <span>{res.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{res.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{res.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
