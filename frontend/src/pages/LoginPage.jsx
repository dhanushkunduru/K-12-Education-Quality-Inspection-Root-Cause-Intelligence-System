import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('evelyn.vance@k12quality.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('Manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password, role: selectedRole });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid login credentials. Please check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const selectRolePreset = (role, defaultEmail) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Left Visual Storytelling Banner */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-brand-950 to-purple-950 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-600/30">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">K-12 Quality AI</span>
              <span className="block text-xs font-semibold text-purple-300 uppercase tracking-widest">Enterprise Platform</span>
            </div>
          </div>

          <div className="mt-16 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-100 tracking-tight leading-tight">
              Digitize Inspections. Detect Defects. Predict Root Causes.
            </h1>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Transform K-12 operational quality across school groups with Google Gemini decision support. Reconcile attendance gaps, prevent timetable conflicts, automate CAPAs, and monitor academic excellence.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Human-in-the-Loop Governance: Humans retain decision control over material CAPA actions.</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Empirical Root-Cause Analysis: Gemini AI predicts defect recurrence factors & severity.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-xs text-slate-400">
          © 2026 K-12 Quality Intelligence Systems Group Inc. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Sign in to Enterprise Workspace</h2>
            <p className="text-xs text-slate-400 mt-1">Enter credentials or select a role preset to explore full application.</p>
          </div>

          {/* Quick Demo Role Switcher Presets */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Demo Role Account:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectRolePreset('Manager', 'evelyn.vance@k12quality.edu')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedRole === 'Manager'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Quality Manager</div>
                <div className="text-[10px] text-slate-400">Dr. Evelyn Vance</div>
              </button>
              <button
                type="button"
                onClick={() => selectRolePreset('Quality Engineer', 'marcus.sterling@k12quality.edu')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedRole === 'Quality Engineer'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Quality Engineer</div>
                <div className="text-[10px] text-slate-400">Marcus Sterling</div>
              </button>
              <button
                type="button"
                onClick={() => selectRolePreset('Inspector', 'sophia.chen@k12quality.edu')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedRole === 'Inspector'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Field Inspector</div>
                <div className="text-[10px] text-slate-400">Sophia Chen</div>
              </button>
              <button
                type="button"
                onClick={() => selectRolePreset('Auditor', 'arthur.p@k12quality.edu')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  selectedRole === 'Auditor'
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">Quality Auditor</div>
                <div className="text-[10px] text-slate-400">Arthur Pendelton</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center mt-2 shadow-lg shadow-brand-600/30"
              icon={ArrowRight}
            >
              Sign In to Quality Platform
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
