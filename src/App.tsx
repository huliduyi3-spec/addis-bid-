import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Clock,
  Flame,
  ArrowRight,
  Lock,
  KeyRound,
  Smartphone,
  X,
  Share2,
  Shield,
  User,
  Wallet,
  HelpCircle,
  Trash2
} from 'lucide-react';

export type AuctionCategory = 'all' | 'vehicles' | 'smartphones' | 'electronics' | 'luxury';

export interface AuctionItem {
  id: string;
  title: string;
  subtitle: string;
  category: AuctionCategory;
  retailValueETB: number;
  entryFeeETB: number;
  maxAllowedBidETB: number;
  endTime: number;
  image: string;
  status: 'active' | 'completed';
  totalBidsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalanceETB: number;
  totalBidsPlaced: number;
}

export interface DepositRequest {
  id: string;
  userName: string;
  userPhone: string;
  amountETB: number;
  method: string;
  txCode: string;
  status: 'pending' | 'approved';
}

const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-landcruiser',
    title: 'Toyota Land Cruiser VXR 2024',
    subtitle: 'Twin-Turbo V6, Zero Km, Full Option Executive',
    category: 'vehicles',
    retailValueETB: 28500000,
    entryFeeETB: 250,
    maxAllowedBidETB: 2500,
    endTime: Date.now() + 1000 * 60 * 60 * 72,
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 1420,
  },
  {
    id: 'auc-iphone16',
    title: 'iPhone 16 Pro Max 512GB',
    subtitle: 'Desert Titanium, Apple Warranty, Brand New',
    category: 'smartphones',
    retailValueETB: 185000,
    entryFeeETB: 50,
    maxAllowedBidETB: 800,
    endTime: Date.now() + 1000 * 60 * 4 + 1000 * 45,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 890,
  },
  {
    id: 'auc-macbook-m3',
    title: 'MacBook Pro 16" M3 Max',
    subtitle: '36GB RAM, 1TB SSD, Space Black, Factory Sealed',
    category: 'electronics',
    retailValueETB: 290000,
    entryFeeETB: 60,
    maxAllowedBidETB: 1200,
    endTime: Date.now() + 1000 * 60 * 60 * 18,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 654,
  },
  {
    id: 'auc-s25-ultra',
    title: 'Samsung Galaxy S25 Ultra 512GB',
    subtitle: 'Titanium Silver, 200MP Camera, S-Pen',
    category: 'smartphones',
    retailValueETB: 175000,
    entryFeeETB: 40,
    maxAllowedBidETB: 750,
    endTime: Date.now() + 1000 * 60 * 60 * 24,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 412,
  },
  {
    id: 'auc-ps5-pro',
    title: 'Sony PlayStation 5 Pro 2TB',
    subtitle: 'Enhanced 4K/120fps Ray Tracing + Extra Controller',
    category: 'electronics',
    retailValueETB: 98000,
    entryFeeETB: 35,
    maxAllowedBidETB: 500,
    endTime: Date.now() + 1000 * 60 * 60 * 36,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 520,
  },
  {
    id: 'auc-rolex-sub',
    title: 'Rolex Submariner Date 41mm',
    subtitle: 'Oystersteel, Cerachrom Ceramic Bezel, Box & Papers',
    category: 'luxury',
    retailValueETB: 1850000,
    entryFeeETB: 150,
    maxAllowedBidETB: 2000,
    endTime: Date.now() + 1000 * 60 * 60 * 48,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 780,
  },
];

const formatETB = (val: number) => val.toLocaleString('en-US') + ' ETB';

const formatTimeLeft = (endTime: number) => {
  const diff = Math.max(0, endTime - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h ${minutes}m`;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const s = localStorage.getItem('addisbid_user_cached');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.email?.toLowerCase() === 'mameboss98@gmail.com';

  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const s = localStorage.getItem('addisbid_auctions_catalog');
      return s ? JSON.parse(s) : INITIAL_AUCTIONS;
    } catch {
      return INITIAL_AUCTIONS;
    }
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    try {
      const s = localStorage.getItem('addisbid_deposits_list');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  /* Modals */
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  /* Auth form */
  const [authId, setAuthId] = useState(() => localStorage.getItem('addisbid_last_id') || '');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // ሰው ገጹን እንደነካ ሎጊን ፊትለፊት እንዲመጣ!
  useEffect(() => {
    if (user) return;
    const hasPrompted = sessionStorage.getItem('addisbid_welcome_prompted');
    if (!hasPrompted) {
      const t = setTimeout(() => {
        if (!user) {
          setAuthMode('login');
          setIsAuthOpen(true);
          sessionStorage.setItem('addisbid_welcome_prompted', 'true');
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [user]);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) localStorage.setItem('addisbid_user_cached', JSON.stringify(u));
    else localStorage.removeItem('addisbid_user_cached');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authId.trim() || !authPass) {
      setAuthError('እባክዎ ስልክ/ኢሜይል እና የይለፍ ቃልዎን ያስገቡ።');
      return;
    }
    const raw = authId.trim().toLowerCase();

    // Admin login
    if (raw === 'mameboss98@gmail.com') {
      saveUser({
        id: 'admin_mameboss',
        name: 'Mame Boss (Admin)',
        email: 'mameboss98@gmail.com',
        phone: '+251 911 000 000',
        walletBalanceETB: 0,
        totalBidsPlaced: 0,
      });
      localStorage.setItem('addisbid_last_id', authId.trim());
      setIsAuthOpen(false);
      return;
    }

    // Normal user login
    saveUser({
      id: `usr_${Date.now()}`,
      name: raw.includes('@') ? raw.split('@')[0] : `Bidder ${raw.slice(-4)}`,
      email: raw.includes('@') ? raw : `${raw}@addisbid.et`,
      phone: raw.startsWith('09') || raw.startsWith('07') ? raw : '+251 900 000 000',
      walletBalanceETB: 0,
      totalBidsPlaced: 0,
    });
    localStorage.setItem('addisbid_last_id', authId.trim());
    setIsAuthOpen(false);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authId.trim() || !authPass) {
      setAuthError('እባክዎ ሙሉ ስም፣ ስልክ/ኢሜይል እና የይለፍ ቃል ያስገቡ።');
      return;
    }
    if (authPass.length < 6) {
      setAuthError('የይለፍ ቃል ቢያንስ 6 ፊደል ወይም ቁጥር መሆን አለበት።');
      return;
    }

    const raw = authId.trim().toLowerCase();
    saveUser({
      id: `usr_${Date.now()}`,
      name: authName.trim(),
      email: raw.includes('@') ? raw : `${raw}@addisbid.et`,
      phone: raw.startsWith('09') || raw.startsWith('07') ? raw : '+251 900 000 000',
      walletBalanceETB: 0,
      totalBidsPlaced: 0,
    });
    localStorage.setItem('addisbid_last_id', authId.trim());
    setIsAuthOpen(false);
  };

  const handlePlaceBid = (aucId: string) => {
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    const target = auctions.find((a) => a.id === aucId);
    if (!target) return;

    if (user.walletBalanceETB < target.entryFeeETB) {
      setIsWalletOpen(true);
      return;
    }

    saveUser({
      ...user,
      walletBalanceETB: user.walletBalanceETB - target.entryFeeETB,
      totalBidsPlaced: user.totalBidsPlaced + 1,
    });

    const updated = auctions.map((a) => (a.id === aucId ? { ...a, totalBidsCount: a.totalBidsCount + 1 } : a));
    setAuctions(updated);
    localStorage.setItem('addisbid_auctions_catalog', JSON.stringify(updated));
    alert('ምስጢር ጨረታዎ በተሳካ ሁኔታ ገብቷል!');
    setSelectedAuction(null);
  };

  const filtered = auctions.filter((auc) => {
    const matchCat = categoryFilter === 'all' || auc.category === categoryFilter;
    const matchSearch = auc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                ADDIS<span className="text-amber-400">BID</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase block">የኢትዮጵያ የመስመር ላይ ጨረታ</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg shadow-sm animate-pulse"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!user) { setAuthMode('login'); setIsAuthOpen(true); }
                else setIsWalletOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">{formatETB(user?.walletBalanceETB || 0)}</span>
              <span className="text-[10px] bg-slate-950/20 px-1 py-0.5 rounded hidden sm:inline">+ ዲፖዚት</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="text-xs text-slate-200 font-medium hidden sm:inline">{user.name}</span>
                <button
                  onClick={() => saveUser(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 text-xs font-medium"
                >
                  ውጣ
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-400/50 rounded-lg"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>ግባ / ተመዝገብ</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-gradient-to-b from-slate-900/60 to-slate-950 border-b border-slate-800/80 py-10 px-4 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>ዝቅተኛው እና ብቸኛው ዋጋ (Lowest Unique Bid) ያሸንፋል!</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          በቴሌብር ይጫረቱ፣ <span className="text-amber-400">ትላልቅ እቃዎችን</span> በትንሽ ሳንቲም ያሸንፉ!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ቶዮታ ላንድ ክሩዘር፣ አይፎን 16 ፕሮ ማክስ፣ ማክቡክ እና ሌሎችም እቃዎች በቀጥታ ጨረታ ላይ ናቸው። በቴሌብር ዲፖዚት በማድረግ ይሳተፉ።
        </p>
      </section>

      {/* AUCTION SECTION */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="እቃዎችን ፈልግ (Search auctions)..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'vehicles', 'smartphones', 'electronics', 'luxury'] as AuctionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                  categoryFilter === cat ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'ሁሉም (All)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((auc) => {
            const isFinalFive = auc.endTime - Date.now() <= 1000 * 60 * 5 && auc.endTime - Date.now() > 0;
            return (
              <div
                key={auc.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col shadow-xl ${
                  isFinalFive ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-800'
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img src={auc.image} alt={auc.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold uppercase text-amber-300">
                      {auc.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-slate-950/90 font-mono text-xs text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formatTimeLeft(auc.endTime)}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{auc.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{auc.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">ዋጋ:</span>
                      <span className="font-mono font-bold text-slate-200">{formatETB(auc.retailValueETB)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">የመጫረቻ ክፍያ:</span>
                      <span className="font-mono font-bold text-amber-400">{formatETB(auc.entryFeeETB)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAuction(auc)}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>ምስጢር ጨረታ አስገባ (Place Bid)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* AUTH MODAL - ንጹህ ሆነ! ያ ጽሁፍ ተሰርዟል! */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {authMode === 'login' ? 'ወደ አዲስ ቢድ ይግቡ' : 'አዲስ አካውንት ይክፈቱ'}
                </h3>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' ? 'በስልክ ቁጥር ወይም በኢሜይል ይግቡ' : 'በስልክ ቁጥር (ቴሌብር) ወይም በኢሜይል ይመዝገቡ'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold mb-4">
              <button
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`py-2 rounded-lg ${authMode === 'login' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'}`}
              >
                ግባ (Log In)
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                className={`py-2 rounded-lg ${authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'}`}
              >
                ተመዝገብ (Sign Up)
              </button>
            </div>

            {authError && <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">{authError}</div>}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ስልክ ቁጥር ወይም ኢሜይል</label>
                  <input
                    type="text"
                    required
                    value={authId}
                    onChange={(e) => setAuthId(e.target.value)}
                    placeholder="0911223344 ወይም user@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">የይለፍ ቃል / ኮድ</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-md">
                  ግባ (Log In)
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ሙሉ ስም</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="ለምሳሌ፡ ዮናስ በቀለ"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ስልክ ቁጥር ወይም ኢሜይል</label>
                  <input
                    type="text"
                    required
                    value={authId}
                    onChange={(e) => setAuthId(e.target.value)}
                    placeholder="0911223344 ወይም name@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">የይለፍ ቃል (min 6)</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="ቢያንስ 6 ፊደላት ወይም ቁጥሮች"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-md">
                  አካውንት ፍጠርና ግባ (Sign Up Now)
                </button>
              </form>
            )}

            {/* ንጹህ ፉተር - ያ ጽሁፍ ተሰርዟል! */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ደህንነቱ የተጠበቀ ይፋዊ የጨረታ መድረክ፤ በቴሌብር እና በኢትዮጵያ ንግድ ባንክ ፈጣን ክፍያ ይደገፋል።</span>
            </div>
          </div>
        </div>
      )}

      {/* BID MODAL */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative space-y-4">
            <button onClick={() => setSelectedAuction(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <img src={selectedAuction.image} alt={selectedAuction.title} className="w-full aspect-video object-cover rounded-xl" />
            <div>
              <h3 className="text-xl font-bold text-white">{selectedAuction.title}</h3>
              <p className="text-xs text-slate-400">{selectedAuction.subtitle}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
              <span>ዋጋ: <strong className="text-white">{formatETB(selectedAuction.retailValueETB)}</strong></span>
              <span>የመጫረቻ ክፍያ: <strong className="text-amber-400">{formatETB(selectedAuction.entryFeeETB)}</strong></span>
            </div>
            <button
              onClick={() => handlePlaceBid(selectedAuction.id)}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md"
            >
              ሚስጥር ጨረታ አስገባ (Place Bid)
            </button>
          </div>
        </div>
      )}

      {/* WALLET MODAL */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative space-y-4">
            <button onClick={() => setIsWalletOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <Wallet className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">የኪስ ቦርሳ (Wallet)</h3>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">ቀሪ ሂሳብ፦</span>
              <span className="text-2xl font-mono font-bold text-amber-400">{formatETB(user?.walletBalanceETB || 0)}</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between"><span>📱 Telebirr:</span><strong className="text-amber-400">0911 00 00 00</strong></div>
              <div className="flex justify-between"><span>🏦 CBE Bank:</span><strong className="text-sky-400">1000 1234 5678 9</strong></div>
            </div>
            <p className="text-[11px] text-slate-400">በቴሌብር ወይም በሲቢኢ ገንዘብ ካስገቡ በኋላ አድሚኑ ወዲያውኑ ሒሳብዎ ላይ ይሞላልዎታል።</p>
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
      {isAdminOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">አድሚን ፓነል (Admin Panel)</h3>
            </div>
            <p className="text-xs text-amber-400 font-mono">mameboss98@gmail.com — ሙሉ የጨረታዎች መቆጣጠሪያ</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {auctions.map((auc) => (
                <div key={auc.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{auc.title}</span>
                    <span className="text-slate-400 text-[10px]">ቀሪ: {formatTimeLeft(auc.endTime)}</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = auctions.map((a) => (a.id === auc.id ? { ...a, endTime: a.endTime + 1000 * 60 * 60 * 24 } : a));
                      setAuctions(updated);
                      localStorage.setItem('addisbid_auctions_catalog', JSON.stringify(updated));
                    }}
                    className="px-2 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
                  >
                    +1 ቀን ጨምር
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 ADDIS BID — የኢትዮጵያ የመስመር ላይ ጨረታ።</p>
      </footer>
    </div>
  );
}
