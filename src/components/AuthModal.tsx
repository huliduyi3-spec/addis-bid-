import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, Lock, User, KeyRound, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { loginWithEmail, registerWithEmail } = useAuth();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(defaultMode);
  const [identifier, setIdentifier] = useState(() => localStorage.getItem('addisbid_last_identifier') || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAuthMode(defaultMode);
      setErrorMsg('');
      const last = localStorage.getItem('addisbid_last_identifier');
      if (last && !identifier) setIdentifier(last);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('እባክዎ ስልክ/ኢሜይል እና የይለፍ ቃልዎን ያስገቡ።');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      await loginWithEmail(identifier.trim(), password);
      onClose();
    } catch (err: any) {
      setErrorMsg('የተሳሳተ ስልክ/ኢሜይል ወይም የይለፍ ቃል አስገብተዋል። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !identifier.trim() || !password) {
      setErrorMsg('እባክዎ ሙሉ ስም፣ ስልክ ቁጥር ወይም ኢሜይል እና የይለፍ ቃል ያስገቡ።');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      await registerWithEmail(identifier.trim(), password, fullName.trim());
      onClose();
    } catch (err: any) {
      setAuthMode('login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative flex flex-col max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white leading-tight">
              {authMode === 'login' ? 'ወደ አዲስ ቢድ ይግቡ' : 'አዲስ አካውንት ይክፈቱ'}
            </h3>
            <p className="text-xs text-slate-400">
              {authMode === 'login' ? 'በስልክ ቁጥር ወይም በኢሜይል ይግቡ' : 'በስልክ ቁጥር (ቴሌብር) ወይም በኢሜይል ተመዝገቡ'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ግባ (Log In)</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            className={`py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ተመዝገብ (Sign Up)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ስልክ ቁጥር ወይም ኢሜይል</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="0911223344 ወይም user@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">የይለፍ ቃል / ኮድ</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <span>{loading ? 'እየገባ ነው...' : 'ግባ (Log In)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ሙሉ ስም (Full Name)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ለምሳሌ፡ ዮናስ በቀለ"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ስልክ ቁጥር ወይም ኢሜይል</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="0911223344 ወይም name@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">የይለፍ ቃል / ሚስጥር ኮድ (min 6)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ቢያንስ 6 ፊደላት ወይም ቁጥሮች"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] mt-2"
            >
              <span>{loading ? 'በመመዝገብ ላይ...' : 'አካውንት ፍጠርና ግባ (Sign Up Now)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer info - ንጹህ ሆነ! ያ ጽሁፍ ተሰርዟል! */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>ደህንነቱ የተጠበቀ ይፋዊ የሐራጅ መድረክ፤ በቴሌብር እና በኢትዮጵያ ንግድ ባንክ ፈጣን ክፍያ ይደገፋል።</span>
        </div>
      </div>
    </div>
  );
};
