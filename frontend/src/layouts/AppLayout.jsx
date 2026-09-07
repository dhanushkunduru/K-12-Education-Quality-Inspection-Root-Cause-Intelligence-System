import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertTriangle,
  GitMerge,
  ShieldCheck,
  Sparkles,
  Activity,
  FileText,
  Bell,
  Users,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  GraduationCap,
  ChevronDown,
  UserCheck,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CommandPalette } from '../components/ui/CommandPalette';

export const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const { notifications, selectedSchoolFilter, setSelectedSchoolFilter, schools } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inspections', path: '/inspections', icon: ClipboardCheck },
    { label: 'Defects', path: '/defects', icon: AlertTriangle },
    { label: 'Root Cause', path: '/root-cause', icon: GitMerge },
    { label: 'CAPA', path: '/capa', icon: ShieldCheck },
    { label: 'AI Workspace', path: '/ai-workspace', icon: Sparkles, badge: 'AI' },
    { label: 'Model Monitoring', path: '/model-monitoring', icon: Activity },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Notifications', path: '/notifications', icon: Bell, count: unreadNotifCount },
    { label: 'Users & Roles', path: '/users', icon: Users },
    { label: 'Audit Logs', path: '/audit-logs', icon: FileSpreadsheet },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* Command Palette Search Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* LEFT SIDEBAR */}
      <aside
        className={`bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Top Brand Logo */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm tracking-tight text-slate-100 truncate">K-12 Quality AI</span>
                  <span className="text-[10px] text-brand-400 font-medium tracking-wider uppercase truncate">Root-Cause Intelligence</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* School Workspace Filter Selector */}
          {!sidebarCollapsed && (
            <div className="p-3 border-b border-slate-800/80">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Active Campus Group
              </label>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Campuses (School Group)</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}

                  {item.badge && !sidebarCollapsed && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}

                  {item.count > 0 && !sidebarCollapsed && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Role Switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-brand-500/40 object-cover shrink-0"
                />
                {!sidebarCollapsed && (
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Dr. Evelyn Vance'}</div>
                    <div className="text-[10px] text-brand-400 font-medium flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> {user?.role || 'Manager'}
                    </div>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Quick Role Switcher Dropdown */}
            {roleDropdownOpen && (
              <div className="absolute bottom-12 left-0 w-full bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-40 animate-scale-in">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                  Switch Active Role Preset
                </div>
                {['Manager', 'Quality Engineer', 'Inspector', 'Auditor'].map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium hover:bg-slate-800 transition-colors flex items-center justify-between ${
                      user?.role === r ? 'text-brand-400 font-bold bg-slate-800/60' : 'text-slate-300'
                    }`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                  </button>
                ))}
                <div className="pt-2 mt-1 border-t border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 px-6 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Global Search Bar Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs w-48 md:w-72 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search system...</span>
              <kbd className="ml-auto font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                Cmd+K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Current Role Indicator Badge */}
            <div className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Role: {user?.role}</span>
            </div>
          </div>
        </header>

        {/* MAIN PAGE VIEW CONTAINER */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
