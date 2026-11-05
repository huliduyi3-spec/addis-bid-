import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import './index.css';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Trophy,
  Filter,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Shield,
  User,
  Wallet,
  Clock,
  Flame,
  ArrowRight,
  Lock,
  KeyRound,
  Check,
  Smartphone,
  X,
  Share2,
  Send,
  HelpCircle,
  Award,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  ExternalLink,
  Copy,
  Sliders,
  DollarSign,
  TrendingDown
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
  timestamp: number;
}

const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-1',
    title: 'iPhone 16 Pro Max (256GB Desert Titanium)',
    subtitle: 'Brand new sealed box with Apple warranty',
    category: 'smartphones',
    retailValueETB: 185000,
    entryFeeETB: 50,
    maxAllowedBidETB: 50,
    endTime: Date.now() + 1000 * 60 * 60 * 18,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 142
  },
  {
    id: 'auc-2',
    title: 'Toyota Hilux Double Cab 2024 (Brand New)',
    subtitle: 'Zero mileage, 4WD Automatic Transmission',
    category: 'vehicles',
    retailValueETB: 8500000,
    entryFeeETB: 200,
    maxAllowedBidETB: 200,
    endTime: Date.now() + 1000 * 60 * 60 * 48,
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 389
  },
  {
    id: 'auc-3',
    title: 'MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
    subtitle: 'Ultimate performance for creators and engineers',
    category: 'electronics',
    retailValueETB: 340000,
    entryFeeETB: 100,
    maxAllowedBidETB: 100,
    endTime: Date.now() + 1000 * 60 * 60 * 12,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 94
  },
  {
    id: 'auc-4',
    title: 'Sony PlayStation 5 Pro Console',
    subtitle: '2TB SSD + 2 DualSense Wireless Controllers',
    category: 'electronics',
    retailValueETB: 120000,
    entryFeeETB: 40,
    maxAllowedBidETB: 40,
    endTime: Date.now() + 1000 * 60 * 60 * 6,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 215
  },
  {
    id: 'auc-5',
    title: 'Samsung Galaxy S25 Ultra 5G',
    subtitle: 'Snapdragon 8 Elite, 200MP Camera, S-Pen',
    category: 'smartphones',
    retailValueETB: 165000,
    entryFeeETB: 50,
    maxAllowedBidETB: 50,
    endTime: Date.now() + 1000 * 60 * 60 * 24,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 168
  },
  {
    id: 'auc-6',
    title: '100,000 ETB Cash Prize',
    subtitle: 'Direct transfer to Telebirr or CBE Bank Account',
    category: 'luxury',
    retailValueETB: 100000,
    entryFeeETB: 30,
    maxAllowedBidETB: 30,
    endTime: Date.now() + 1000 * 60 * 60 * 8,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    totalBidsCount: 310
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('addisbid_user_cached');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const saved = localStorage.getItem('addisbid_auctions_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_AUCTIONS;
  });

  const [pendingDeposits, setPendingDeposits] = useState<DepositRequest[]>(() => {
    try {
      const saved = localStorage.getItem('addisbid_deposits_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'dep-1',
        userName: 'Abebe Bikila',
        userPhone: '0911223344',
        amountETB: 500,
        method: 'Telebirr',
        txCode: 'TB892736412',
        status: 'pending',
        timestamp: Date.now() - 1000 * 60 * 20
      }
    ];
  });

  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const [biddingAuction, setBiddingAuction] = useState<AuctionItem | null>(null);
  const [secretBidAmount, setSecretBidAmount] = useState('');
  const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState('');

  const [depositAmount, setDepositAmount] = useState('200');
  const [depositMethod, setDepositMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [depositTxCode, setDepositTxCode] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  const [newLotTitle, setNewLotTitle] = useState('');
  const [newLotSubtitle, setNewLotSubtitle] = useState('');
  const [newLotCategory, setNewLotCategory] = useState<AuctionCategory>('smartphones');
  const [newLotRetail, setNewLotRetail] = useState('50000');
  const [newLotFee, setNewLotFee] = useState('50');
  const [newLotHours, setNewLotHours] = useState('24');
  const [newLotImage, setNewLotImage] = useState('');

  const isAdmin = currentUser?.email?.toLowerCase().trim() === 'mameboss98@gmail.com';

  // 1. Auto-show login modal on entrance within 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const existingUser = localStorage.getItem('addisbid_user_cached');
      if (!existingUser) {
        setIsAuthModalOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('addisbid_auctions_v2', JSON.stringify(auctions));
    } catch (e) {}
  }, [auctions]);

  useEffect(() => {
    try {
      localStorage.setItem('addisbid_deposits_v2', JSON.stringify(pendingDeposits));
    } catch (e) {}
  }, [pendingDeposits]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('addisbid_user_cached', JSON.stringify(currentUser));
      } catch (e) {}
    } else {
      localStorage.removeItem('addisbid_user_cached');
    }
  }, [currentUser]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const idVal = authIdentifier.trim();
    if (!idVal) {
      setAuthError('Please enter your phone number or email');
      return;
    }
    if (authPassword.length < 4) {
      setAuthError('Password must be at least 4 characters');
      return;
    }

    const isEmail = idVal.includes('@');
    const userEmail = isEmail ? idVal.toLowerCase() : `${idVal.replace(/\D/g, '')}@ethiobid.et`;
    const userPhone = !isEmail ? idVal : '0911000000';
    const userName = authMode === 'signup' && authFullName ? authFullName : idVal.split('@')[0];

    const profile: UserProfile = {
      id: 'usr-' + Date.now(),
      name: userName,
      email: userEmail,
      phone: userPhone,
      walletBalanceETB: currentUser ? currentUser.walletBalanceETB : 100,
      totalBidsPlaced: currentUser ? currentUser.totalBidsPlaced : 0
    };

    setCurrentUser(profile);
    setIsAuthModalOpen(false);
    setAuthIdentifier('');
    setAuthPassword('');
    setAuthFullName('');
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsAdminPanelOpen(false);
  };

  const handlePlaceSecretBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingAuction) return;

    if (!currentUser) {
      setBiddingAuction(null);
      setIsAuthModalOpen(true);
      return;
    }

    const bidVal = parseFloat(secretBidAmount);
    if (isNaN(bidVal) || bidVal <= 0) {
      alert('Please enter a valid bid amount!');
      return;
    }

    if (bidVal > biddingAuction.maxAllowedBidETB) {
      alert(`Maximum bid allowed for this item is ${biddingAuction.maxAllowedBidETB} ETB!`);
      return;
    }

    if (currentUser.walletBalanceETB < biddingAuction.entryFeeETB) {
      alert(`Insufficient balance. Entry fee is ${biddingAuction.entryFeeETB} ETB. Please deposit funds!`);
      setBiddingAuction(null);
      setIsWalletModalOpen(true);
      return;
    }

    const updatedUser = {
      ...currentUser,
      walletBalanceETB: currentUser.walletBalanceETB - biddingAuction.entryFeeETB,
      totalBidsPlaced: currentUser.totalBidsPlaced + 1
    };
    setCurrentUser(updatedUser);

    setAuctions(prev =>
      prev.map(a =>
        a.id === biddingAuction.id ? { ...a, totalBidsCount: a.totalBidsCount + 1 } : a
      )
    );

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}

    setBidSuccessMessage(`Your secret bid of ${bidVal.toFixed(2)} ETB has been recorded!`);
    setTimeout(() => {
      setBidSuccessMessage(null);
      setBiddingAuction(null);
      setSecretBidAmount('');
    }, 2200);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsWalletModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 20) {
      alert('Minimum deposit amount is 20 ETB!');
      return;
    }

    if (!depositTxCode.trim()) {
      alert('Please enter the payment Transaction ID!');
      return;
    }

    const req: DepositRequest = {
      id: 'dep-' + Date.now(),
      userName: currentUser.name,
      userPhone: currentUser.phone,
      amountETB: amt,
      method: depositMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr',
      txCode: depositTxCode.trim(),
      status: 'pending',
      timestamp: Date.now()
    };

    setPendingDeposits(prev => [req, ...prev]);
    setDepositSuccessMsg(`Deposit request of ${amt} ETB submitted! Will be credited upon verification.`);
    setDepositTxCode('');
    setTimeout(() => {
      setDepositSuccessMsg(null);
      setIsWalletModalOpen(false);
    }, 2500);
  };

  const handleApproveDeposit = (depositId: string) => {
    const dep = pendingDeposits.find(d => d.id === depositId);
    if (!dep) return;

    setPendingDeposits(prev =>
      prev.map(d => (d.id === depositId ? { ...d, status: 'approved' } : d))
    );

    if (currentUser && currentUser.phone === dep.userPhone) {
      setCurrentUser(prev =>
        prev ? { ...prev, walletBalanceETB: prev.walletBalanceETB + dep.amountETB } : null
      );
    }
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotTitle.trim()) return;

    const newLot: AuctionItem = {
      id: 'auc-' + Date.now(),
      title: newLotTitle.trim(),
      subtitle: newLotSubtitle.trim() || 'New Auction Lot',
      category: newLotCategory,
      retailValueETB: parseFloat(newLotRetail) || 10000,
      entryFeeETB: parseFloat(newLotFee) || 50,
      maxAllowedBidETB: parseFloat(newLotFee) || 50,
      endTime: Date.now() + 1000 * 60 * 60 * (parseFloat(newLotHours) || 24),
      image:
        newLotImage.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      status: 'active',
      totalBidsCount: 0
    };

    setAuctions(prev => [newLot, ...prev]);
    setNewLotTitle('');
    setNewLotSubtitle('');
    setNewLotImage('');
    alert('New auction lot published successfully!');
  };

  const handleDeleteLot = (id: string) => {
    if (confirm('Are you sure you want to delete this auction item?')) {
      setAuctions(prev => prev.filter(a => a.id !== id));
    }
  };

  const filteredAuctions = auctions.filter(auc => {
    const matchesCat = categoryFilter === 'all' || auc.category === categoryFilter;
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Addis Bid</span>
                <span className="text-[10px] uppercase font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/20">
                  Ethiopia
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Premier Ethiopian Online Auction</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              How It Works
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all"
                >
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>{currentUser.walletBalanceETB.toLocaleString()} ETB</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md">
                    + Deposit
                  </span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-400/20 transition-all"
                  >
                    <Sliders className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                )}

                <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Log Out"
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-400/20 transition-all"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            Lowest Unique Bid Wins in Ethiopia
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Win Smartphones, Cars & Cash with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Pennies</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Deposit easily via Telebirr or CBE Birr. Place your secret price — the lowest unmatched bid takes the prize!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsWalletModalOpen(true);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-xl shadow-amber-400/20 flex items-center gap-2 transition-all"
            >
              Start Bidding Now <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search auctions (iPhone, Toyota, MacBook)..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'vehicles', 'smartphones', 'electronics', 'luxury'] as AuctionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                  categoryFilter === cat
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Auction Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAuctions.map((auc) => (
            <div
              key={auc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-all hover:border-slate-700 shadow-xl"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={auc.image}
                  alt={auc.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Live Auction
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  Value: {auc.retailValueETB.toLocaleString()} ETB
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">{auc.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{auc.subtitle}</p>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Entry Fee</span>
                    <span className="font-bold text-amber-400">{auc.entryFeeETB} ETB</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Total Bids</span>
                    <span className="font-semibold text-white">{auc.totalBidsCount} placed</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBiddingAuction(auc);
                    setSecretBidAmount('');
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/10 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Place Secret Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= MODAL: AUTHENTICATION (LOGIN / SIGNUP) ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sign In to Addis Bid</h3>
                <p className="text-xs text-slate-400">Place bids & manage your wallet</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-1.5 rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-1.5 rounded-lg transition-colors ${
                  authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number or Email</label>
                <input
                  type="text"
                  required
                  value={authIdentifier}
                  onChange={(e) => setAuthIdentifier(e.target.value)}
                  placeholder="09... / 07... or name@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password / PIN</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                {authMode === 'login' ? 'Log In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Ethiopian Online Auction Platform</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SECRET BID ================= */}
      {biddingAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-5 relative space-y-4">
            <button
              onClick={() => setBiddingAuction(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" /> Secret Lowest Unique Bid
              </div>
              <h3 className="font-bold text-white text-sm line-clamp-1">{biddingAuction.title}</h3>
              <p className="text-[11px] text-slate-400">Entry fee: {biddingAuction.entryFeeETB} ETB</p>
            </div>

            {bidSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
                <p className="font-bold">{bidSuccessMessage}</p>
                <p className="text-[10px] text-slate-400">Winner will be announced when auction concludes!</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceSecretBid} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Your Secret Bid Amount (Between 0.01 and {biddingAuction.maxAllowedBidETB} ETB)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={biddingAuction.maxAllowedBidETB}
                      required
                      value={secretBidAmount}
                      onChange={(e) => setSecretBidAmount(e.target.value)}
                      placeholder="e.g. 0.35 or 2.15"
                      className="w-full pl-3 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      ETB
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    The lowest unmatched price placed by a single user wins the prize!
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Place Bid ({biddingAuction.entryFeeETB} ETB fee)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: WALLET & DEPOSIT ================= */}
      {isWalletModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsWalletModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">My Wallet</h3>
                <p className="text-xs text-slate-400">Available Balance: {currentUser.walletBalanceETB} ETB</p>
              </div>
            </div>

            {depositSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                <p className="font-bold">{depositSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDepositMethod('telebirr')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        depositMethod === 'telebirr'
                          ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      Telebirr
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositMethod('cbe')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        depositMethod === 'cbe'
                          ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      CBE Birr
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300">
                  <p className="font-bold text-amber-400">Payment Account Details:</p>
                  {depositMethod === 'telebirr' ? (
                    <div>
                      <p>Telebirr Merchant: <strong className="text-white">0911223344</strong> (Addis Bid)</p>
                      <p className="text-slate-400">Transfer funds and enter your transaction receipt code below.</p>
                    </div>
                  ) : (
                    <div>
                      <p>CBE Bank Account: <strong className="text-white">1000123456789</strong> (Addis Bid)</p>
                      <p className="text-slate-400">Deposit funds and enter your CBE reference number below.</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (ETB)</label>
                  <input
                    type="number"
                    min="20"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Transaction Reference (ID)</label>
                  <input
                    type="text"
                    required
                    value={depositTxCode}
                    onChange={(e) => setDepositTxCode(e.target.value)}
                    placeholder="e.g. TB928172938 or CBE182746"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit Deposit for Verification
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIN PANEL ================= */}
      {isAdminPanelOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-400/30 rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Administrator Control Panel</h3>
                <p className="text-xs text-amber-400 font-mono">Authenticated as {currentUser?.email}</p>
              </div>
            </div>

            {/* Pending Deposits Verification */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Pending Deposit Requests ({pendingDeposits.filter(d => d.status === 'pending').length} new)
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pendingDeposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{dep.userName}</span>
                        <span className="text-slate-400">({dep.userPhone})</span>
                        <span className="text-amber-400 font-semibold uppercase text-[10px]">{dep.method}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">TX: {dep.txCode} | {dep.amountETB} ETB</p>
                    </div>
                    {dep.status === 'pending' ? (
                      <button
                        onClick={() => handleApproveDeposit(dep.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Approve Deposit
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs">Approved ✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Auction Lot */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Publish New Auction Lot</h4>
              <form onSubmit={handleCreateLot} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    value={newLotTitle}
                    onChange={(e) => setNewLotTitle(e.target.value)}
                    placeholder="e.g. iPhone 16 Pro Max"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Subtitle / Description</label>
                  <input
                    type="text"
                    value={newLotSubtitle}
                    onChange={(e) => setNewLotSubtitle(e.target.value)}
                    placeholder="e.g. 256GB Desert Titanium"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Entry Fee (ETB)</label>
                  <input
                    type="number"
                    value={newLotFee}
                    onChange={(e) => setNewLotFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={newLotHours}
                    onChange={(e) => setNewLotHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newLotImage}
                    onChange={(e) => setNewLotImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    + Add Auction Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOW IT WORKS ================= */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setIsHowItWorksOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">How Bidding Works</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">1. Lowest Unique Bid</strong>
                Submit any price (e.g. 0.05 ETB or 3.20 ETB) as a sealed secret bid.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">2. Duplicates Cancel Out</strong>
                If two or more bidders submit the exact same price, both are eliminated.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">3. The Lowest Unmatched Wins</strong>
                When the timer expires, the person with the lowest unique price wins the item!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 ADDIS BID — Ethiopian Online Auction Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Auto-mount if running directly as entry point (main.tsx)
if (typeof document !== 'undefined') {
  const container = document.getElementById('root');
  if (container && !container.hasChildNodes()) {
    createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
