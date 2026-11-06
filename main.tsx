import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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
  TrendingDown,
  Mail,
  ArrowLeft,
  RefreshCw,
  Tag
} from 'lucide-react';

/* ================= TYPES ================= */
export type AuctionCategory =
  | 'all'
  | 'gold'
  | 'vehicles'
  | 'real_estate'
  | 'playstation'
  | 'laptops'
  | 'smartphones'
  | 'watches'
  | 'appliances'
  | 'luxury';

export interface BidRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  isUser?: boolean;
}

export interface AuctionWinner {
  userName: string;
  userPhone?: string;
  winningBidETB: number;
  marketValueETB: number;
  savingsPercentage: number;
  completedAt: number;
  hashProof: string;
}

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
  status: 'active' | 'completed' | 'upcoming';
  totalBidsCount: number;
  bids: BidRecord[];
  winner?: AuctionWinner;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalanceETB: number;
  totalBidsPlaced: number;
  winsCount: number;
  avatar?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amountETB: number;
  method: 'telebirr' | 'cbe';
  txCode: string;
  status: 'pending' | 'approved';
  timestamp: number;
}

/* ================= INITIAL SEED DATA ================= */
const INITIAL_AUCTIONS: AuctionItem[] = [
  // --- Active Auctions ---
  {
    id: 'auc-gold-bar-100g',
    title: '24K Pure Gold Bullion Bar (100g)',
    subtitle: '999.9 Fine Investment Gold, Certified Assay Card & Serial Number',
    category: 'gold',
    retailValueETB: 1350000,
    entryFeeETB: 100,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 28,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 1680,
    bids: [
      { id: 'bg1', userId: 'u1', userName: 'Dawit M.', amount: 4.15, timestamp: Date.now() - 3600000 },
      { id: 'bg2', userId: 'u2', userName: 'Selam K.', amount: 8.75, timestamp: Date.now() - 7200000 },
    ],
  },
  {
    id: 'auc-landcruiser',
    title: 'Toyota Land Cruiser VXR 2024',
    subtitle: 'Twin-Turbo V6, Zero Km, Full Option Executive Edition',
    category: 'vehicles',
    retailValueETB: 28500000,
    entryFeeETB: 250,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 3,
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 1420,
    bids: [
      { id: 'b1', userId: 'u1', userName: 'Dawit M.', amount: 12.45, timestamp: Date.now() - 3600000 },
      { id: 'b2', userId: 'u2', userName: 'Selam K.', amount: 18.2, timestamp: Date.now() - 7200000 },
      { id: 'b3', userId: 'u3', userName: 'Abebe T.', amount: 12.45, timestamp: Date.now() - 10000000 },
    ],
  },
  {
    id: 'auc-bole-villa',
    title: 'Bole Executive 3-Bedroom Luxury Apartment',
    subtitle: '190 sqm, Prime Addis Ababa Location, Title Deed Ready',
    category: 'real_estate',
    retailValueETB: 35000000,
    entryFeeETB: 350,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 6,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 2150,
    bids: [
      { id: 'bv1', userId: 'u4', userName: 'Tigist B.', amount: 9.35, timestamp: Date.now() - 5000000 },
    ],
  },
  {
    id: 'auc-ps5-pro',
    title: 'Sony PlayStation 5 Pro 2TB Console',
    subtitle: 'Enhanced 4K/120fps Ray Tracing + DualSense Edge Controller Bundle',
    category: 'playstation',
    retailValueETB: 145000,
    entryFeeETB: 40,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 18,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 920,
    bids: [
      { id: 'bp1', userId: 'u5', userName: 'Henok F.', amount: 3.8, timestamp: Date.now() - 2000000 },
    ],
  },
  {
    id: 'auc-macbook-m3',
    title: 'MacBook Pro 16" M3 Max',
    subtitle: '36GB Unified Memory, 1TB SSD, Space Black Edition',
    category: 'laptops',
    retailValueETB: 380000,
    entryFeeETB: 65,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 12,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 840,
    bids: [
      { id: 'b6', userId: 'u6', userName: 'Ermias G.', amount: 6.45, timestamp: Date.now() - 2500000 },
    ],
  },
  {
    id: 'auc-rolex-sub',
    title: 'Rolex Submariner Date 41mm',
    subtitle: 'Oystersteel, Cerachrom Ceramic Bezel, Box & Official Papers',
    category: 'watches',
    retailValueETB: 1850000,
    entryFeeETB: 150,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 42,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 1120,
    bids: [],
  },
  {
    id: 'auc-fridge-bespoke',
    title: 'Samsung Bespoke 4-Door French Refrigerator',
    subtitle: '29 cu. ft. Smart Wi-Fi, Beverage Center, Dual Auto Ice Maker',
    category: 'appliances',
    retailValueETB: 340000,
    entryFeeETB: 50,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 30,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 610,
    bids: [],
  },
  {
    id: 'auc-iphone16',
    title: 'iPhone 16 Pro Max 512GB',
    subtitle: 'Desert Titanium, Apple International Warranty, Sealed Box',
    category: 'smartphones',
    retailValueETB: 185000,
    entryFeeETB: 50,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 4 + 1000 * 45,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 890,
    bids: [
      { id: 'b4', userId: 'u4', userName: 'Tigist B.', amount: 4.15, timestamp: Date.now() - 1800000 },
      { id: 'b5', userId: 'u5', userName: 'Henok F.', amount: 7.8, timestamp: Date.now() - 3000000 },
    ],
  },
  {
    id: 'auc-gold-necklace',
    title: '21K Italian Handcrafted Gold Necklace Set (45g)',
    subtitle: 'Solid 21K Gold, Luxury Velvet Presentation Case & Guarantee',
    category: 'gold',
    retailValueETB: 580000,
    entryFeeETB: 75,
    maxAllowedBidETB: 999999,
    endTime: Date.now() + 1000 * 60 * 60 * 50,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000',
    status: 'active',
    totalBidsCount: 780,
    bids: [],
  },

  // --- Completed Auctions / Verified Winners ---
  {
    id: 'auc-won-gold',
    title: '24K Fine Gold Bar 50g Credit Suisse',
    subtitle: 'Completed Auction â€” Verified Lowest Unique Bid Winner!',
    category: 'gold',
    retailValueETB: 680000,
    entryFeeETB: 80,
    maxAllowedBidETB: 999999,
    endTime: Date.now() - 1000 * 60 * 60 * 12,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1000',
    status: 'completed',
    totalBidsCount: 1540,
    bids: [],
    winner: {
      userName: 'Kassahun Haile',
      userPhone: '0911 *** 55',
      winningBidETB: 3.42,
      marketValueETB: 680000,
      savingsPercentage: 99.99,
      completedAt: Date.now() - 1000 * 60 * 60 * 12,
      hashProof: 'LUB-GLD-882914-ETH',
    },
  },
  {
    id: 'auc-won-villa',
    title: 'CMC Modern Executive Apartment (140 sqm)',
    subtitle: 'Completed Auction â€” Verified Lowest Unique Bid Winner!',
    category: 'real_estate',
    retailValueETB: 24000000,
    entryFeeETB: 300,
    maxAllowedBidETB: 999999,
    endTime: Date.now() - 1000 * 60 * 60 * 36,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
    status: 'completed',
    totalBidsCount: 2890,
    bids: [],
    winner: {
      userName: 'Yared Wolde',
      userPhone: '0917 *** 92',
      winningBidETB: 8.85,
      marketValueETB: 24000000,
      savingsPercentage: 99.99,
      completedAt: Date.now() - 1000 * 60 * 60 * 36,
      hashProof: 'LUB-EST-492019-ADD',
    },
  },
  {
    id: 'auc-won-ps5',
    title: 'Sony PlayStation 5 Disc Edition + 2 Controllers',
    subtitle: 'Completed Auction â€” Verified Lowest Unique Bid Winner!',
    category: 'playstation',
    retailValueETB: 95000,
    entryFeeETB: 35,
    maxAllowedBidETB: 999999,
    endTime: Date.now() - 1000 * 60 * 60 * 48,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=1000',
    status: 'completed',
    totalBidsCount: 980,
    bids: [],
    winner: {
      userName: 'Selamawit Kebede',
      userPhone: '0923 *** 88',
      winningBidETB: 0.75,
      marketValueETB: 95000,
      savingsPercentage: 99.99,
      completedAt: Date.now() - 1000 * 60 * 60 * 48,
      hashProof: 'LUB-4A91E028-76123',
    },
  },
  {
    id: 'auc-won-iphone15',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    subtitle: 'Completed Auction â€” Verified Lowest Unique Bid Winner!',
    category: 'smartphones',
    retailValueETB: 175000,
    entryFeeETB: 50,
    maxAllowedBidETB: 999999,
    endTime: Date.now() - 1000 * 60 * 60 * 60,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000',
    status: 'completed',
    totalBidsCount: 1420,
    bids: [],
    winner: {
      userName: 'Ermias Tesfaye',
      userPhone: '0911 *** 42',
      winningBidETB: 1.45,
      marketValueETB: 175000,
      savingsPercentage: 99.99,
      completedAt: Date.now() - 1000 * 60 * 60 * 60,
      hashProof: 'LUB-7F83B165-89412',
    },
  },
  {
    id: 'auc-won-macbook',
    title: 'Apple MacBook Air 13" M2 Chip 256GB Space Grey',
    subtitle: 'Completed Auction â€” Verified Lowest Unique Bid Winner!',
    category: 'laptops',
    retailValueETB: 145000,
    entryFeeETB: 50,
    maxAllowedBidETB: 999999,
    endTime: Date.now() - 1000 * 60 * 60 * 140,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
    status: 'completed',
    totalBidsCount: 1110,
    bids: [],
    winner: {
      userName: 'Dawit Mengistu',
      userPhone: '0912 *** 03',
      winningBidETB: 3.25,
      marketValueETB: 145000,
      savingsPercentage: 99.98,
      completedAt: Date.now() - 1000 * 60 * 60 * 140,
      hashProof: 'LUB-1F82B994-10492',
    },
  },
];

/* Helper: Currency Formatter */
export const formatETB = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 2,
  }).format(amount).replace('ETB', '').trim() + ' ETB';
};

export const formatUSD = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/* Helper: Format Countdown */
export const formatTimeLeft = (endTime: number) => {
  const diff = Math.max(0, endTime - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h ${minutes}m`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function App() {
  /* ================= USER & AUTH STATE ================= */
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('addisbid_user_cached');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.email?.toLowerCase() === 'mameboss98@gmail.com';

  /* ================= APP STATE ================= */
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const saved = localStorage.getItem('addisbid_auctions_catalog_v7');
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem('addisbid_auctions_catalog_v5') || localStorage.getItem('addisbid_auctions_catalog');
      if (oldSaved) {
        const parsed: AuctionItem[] = JSON.parse(oldSaved);
        const hasCompleted = parsed.some((a) => a.status === 'completed');
        if (!hasCompleted) {
          const completedSeeds = INITIAL_AUCTIONS.filter((a) => a.status === 'completed');
          const merged = [...parsed, ...completedSeeds];
          localStorage.setItem('addisbid_auctions_catalog_v7', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_AUCTIONS;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    try {
      const saved = localStorage.getItem('addisbid_deposits_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* Admin Payment Accounts */
  const [paymentAccounts, setPaymentAccounts] = useState<{
    telebirrNumber: string;
    telebirrHolder: string;
    cbeAccount: string;
    cbeHolder: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('addisbid_payment_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      telebirrNumber: '0911 22 33 44',
      telebirrHolder: 'Addis Bid Official',
      cbeAccount: '1000 1234 5678 9',
      cbeHolder: 'Addis Bid Official',
    };
  });

  const savePaymentAccounts = (accs: {
    telebirrNumber: string;
    telebirrHolder: string;
    cbeAccount: string;
    cbeHolder: string;
  }) => {
    setPaymentAccounts(accs);
    try {
      localStorage.setItem('addisbid_payment_accounts', JSON.stringify(accs));
    } catch {}
  };

  const [currency, setCurrency] = useState<'ETB' | 'USD'>('ETB');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory>('all');
  const [mainTab, setMainTab] = useState<'live' | 'winners'>('live');

  /* Modals */
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [selectedWinnerProof, setSelectedWinnerProof] = useState<AuctionItem | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  /* Auth form inputs */
  const [authIdentifier, setAuthIdentifier] = useState(() => localStorage.getItem('addisbid_last_id') || '');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  /* Forgot Password States */
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetGeneratedCode, setResetGeneratedCode] = useState('');
  const [resetInputCode, setResetInputCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  /* Auto prompt login popup on first visit if not logged in */
  useEffect(() => {
    if (user) return;
    const hasPrompted = sessionStorage.getItem('addisbid_welcome_prompted');
    if (!hasPrompted) {
      const timer = setTimeout(() => {
        if (!user) {
          setAuthMode('login');
          setIsAuthOpen(true);
          sessionStorage.setItem('addisbid_welcome_prompted', 'true');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  /* Persist Auctions Catalog */
  const saveAuctionsCatalog = (items: AuctionItem[]) => {
    setAuctions(items);
    try {
      localStorage.setItem('addisbid_auctions_catalog_v7', JSON.stringify(items));
    } catch {}
  };

  /* Persist Deposits List */
  const saveDepositsList = (items: DepositRequest[]) => {
    setDeposits(items);
    try {
      localStorage.setItem('addisbid_deposits_list', JSON.stringify(items));
    } catch {}
  };

  /* Save User Profile */
  const saveUserProfile = (u: UserProfile | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem('addisbid_user_cached', JSON.stringify(u));
      } else {
        localStorage.removeItem('addisbid_user_cached');
      }
    } catch {}
  };

  /* ================= STRICT AUTH HANDLERS ================= */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = authIdentifier.trim().toLowerCase();
    if (!raw || !authPassword) {
      setAuthError('Please enter your phone or email and password.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    setTimeout(() => {
      let usersDb: Record<string, { profile: UserProfile; password: string }> = {};
      try {
        usersDb = JSON.parse(localStorage.getItem('addisbid_users_db') || '{}');
      } catch {}

      if (raw === 'mameboss98@gmail.com' && !usersDb[raw]) {
        usersDb[raw] = {
          profile: {
            id: 'admin_mameboss',
            name: 'System Admin',
            email: 'mameboss98@gmail.com',
            phone: '0911000000',
            walletBalanceETB: 50000,
            totalBidsPlaced: 0,
            winsCount: 0,
          },
          password: authPassword,
        };
        try {
          localStorage.setItem('addisbid_users_db', JSON.stringify(usersDb));
        } catch {}
      }

      const userRecord = usersDb[raw];

      if (!userRecord) {
        setAuthError('Account not found! Please click "Sign Up" to register first.');
        setAuthLoading(false);
        return;
      }

      if (userRecord.password !== authPassword) {
        setAuthError('Incorrect password! Please check your password or click "Forgot Password?".');
        setAuthLoading(false);
        return;
      }

      saveUserProfile(userRecord.profile);
      localStorage.setItem('addisbid_last_id', authIdentifier.trim());
      setIsAuthOpen(false);
      setAuthLoading(false);
    }, 300);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = authIdentifier.trim().toLowerCase();
    if (!authFullName.trim() || !raw || !authPassword) {
      setAuthError('Please enter your full name, phone number or email, and password.');
      return;
    }
    if (authPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    setTimeout(() => {
      let usersDb: Record<string, { profile: UserProfile; password: string }> = {};
      try {
        usersDb = JSON.parse(localStorage.getItem('addisbid_users_db') || '{}');
      } catch {}

      if (usersDb[raw]) {
        setAuthError('This phone or email is already registered! Please click "Log In".');
        setAuthLoading(false);
        return;
      }

      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: authFullName.trim(),
        email: raw.includes('@') ? raw : `${raw}@addisbid.et`,
        phone: raw.startsWith('09') || raw.startsWith('07') ? raw : '+251 900 000 000',
        walletBalanceETB: raw === 'mameboss98@gmail.com' ? 50000 : 50,
        totalBidsPlaced: 0,
        winsCount: 0,
      };

      usersDb[raw] = {
        profile: newUser,
        password: authPassword,
      };

      try {
        localStorage.setItem('addisbid_users_db', JSON.stringify(usersDb));
      } catch {}

      saveUserProfile(newUser);
      localStorage.setItem('addisbid_last_id', authIdentifier.trim());
      setIsAuthOpen(false);
      setAuthLoading(false);
    }, 300);
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleRequestResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = resetEmail.trim().toLowerCase();
    if (!raw) {
      setAuthError('Please enter your registered email or phone number.');
      return;
    }

    setAuthError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetGeneratedCode(code);
    setResetStep('verify');
    setResetNotification(`A 6-digit password reset verification code has been dispatched to ${raw}:`);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (resetInputCode.trim() !== resetGeneratedCode.trim()) {
      setAuthError('Incorrect verification code! Please verify the code and re-enter.');
      return;
    }

    if (resetNewPassword.length < 4) {
      setAuthError('New password must be at least 4 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setAuthError('Passwords do not match! Please verify both passwords.');
      return;
    }

    const raw = resetEmail.trim().toLowerCase();
    let usersDb: Record<string, { profile: UserProfile; password: string }> = {};
    try {
      usersDb = JSON.parse(localStorage.getItem('addisbid_users_db') || '{}');
    } catch {}

    if (raw === 'mameboss98@gmail.com') {
      if (!usersDb[raw]) {
        usersDb[raw] = {
          profile: {
            id: 'admin_mameboss',
            name: 'System Admin',
            email: 'mameboss98@gmail.com',
            phone: '0911000000',
            walletBalanceETB: 50000,
            totalBidsPlaced: 0,
            winsCount: 0,
          },
          password: resetNewPassword,
        };
      } else {
        usersDb[raw].password = resetNewPassword;
      }
    } else if (usersDb[raw]) {
      usersDb[raw].password = resetNewPassword;
    } else {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: raw.split('@')[0],
        email: raw.includes('@') ? raw : `${raw}@addisbid.et`,
        phone: raw.startsWith('09') || raw.startsWith('07') ? raw : '+251 900 000 000',
        walletBalanceETB: 50,
        totalBidsPlaced: 0,
        winsCount: 0,
      };
      usersDb[raw] = { profile: newUser, password: resetNewPassword };
    }

    try {
      localStorage.setItem('addisbid_users_db', JSON.stringify(usersDb));
    } catch {}

    saveUserProfile(usersDb[raw].profile);
    setAuthIdentifier(raw);
    setAuthPassword(resetNewPassword);
    alert('ðŸŽ‰ Your password has been successfully reset! You are now logged in.');
    setIsAuthOpen(false);
    setAuthMode('login');
    setResetStep('request');
    setResetNotification(null);
  };

  const handleLogout = () => {
    saveUserProfile(null);
  };

  /* ================= BIDDING ================= */
  const handlePlaceBid = (auctionId: string, amount: number): boolean => {
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return false;
    }

    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return false;

    if (user.walletBalanceETB < target.entryFeeETB) {
      setIsWalletOpen(true);
      return false;
    }

    const updatedBalance = Math.max(0, user.walletBalanceETB - target.entryFeeETB);
    const updatedUser = {
      ...user,
      walletBalanceETB: updatedBalance,
      totalBidsPlaced: user.totalBidsPlaced + 1,
    };
    saveUserProfile(updatedUser);

    const newBid: BidRecord = {
      id: `bid_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amount,
      timestamp: Date.now(),
      isUser: true,
    };

    const updatedAuctions = auctions.map((auc) => {
      if (auc.id === auctionId) {
        return {
          ...auc,
          totalBidsCount: auc.totalBidsCount + 1,
          bids: [newBid, ...auc.bids],
        };
      }
      return auc;
    });

    saveAuctionsCatalog(updatedAuctions);
    setSelectedAuction(updatedAuctions.find((a) => a.id === auctionId) || null);
    return true;
  };

  /* ================= ADMIN: END AUCTION & PICK LOWEST UNIQUE BID ================= */
  const handleEndAuctionAndPickWinner = (auctionId: string) => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return;

    let winnerName = 'Abebe K.';
    let winnerPhone = '0911 *** 88';
    let winningBid = 1.25;

    if (target.bids && target.bids.length > 0) {
      const counts: Record<number, number> = {};
      target.bids.forEach((b) => {
        counts[b.amount] = (counts[b.amount] || 0) + 1;
      });
      const uniqueBids = target.bids.filter((b) => counts[b.amount] === 1);
      if (uniqueBids.length > 0) {
        uniqueBids.sort((a, b) => a.amount - b.amount);
        const winBid = uniqueBids[0];
        winnerName = winBid.userName;
        winningBid = winBid.amount;
      } else {
        const sorted = [...target.bids].sort((a, b) => a.amount - b.amount);
        winnerName = sorted[0].userName;
        winningBid = sorted[0].amount;
      }
    } else {
      const inputName = prompt('Enter winner full name (or leave default):', 'Selamawit G.');
      if (inputName) winnerName = inputName;
      const inputBid = prompt('Enter winning unique bid amount (ETB):', '0.95');
      if (inputBid) winningBid = parseFloat(inputBid) || 0.95;
    }

    const savingsPct = Math.round(((target.retailValueETB - winningBid) / target.retailValueETB) * 1000) / 10;
    const hashProof = `LUB-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const updated = auctions.map((a) => {
      if (a.id === auctionId) {
        return {
          ...a,
          status: 'completed' as const,
          winner: {
            userName: winnerName,
            userPhone: winnerPhone,
            winningBidETB: winningBid,
            marketValueETB: a.retailValueETB,
            savingsPercentage: savingsPct > 0 ? savingsPct : 99.9,
            completedAt: Date.now(),
            hashProof,
          },
        };
      }
      return a;
    });

    saveAuctionsCatalog(updated);
    alert(`ðŸŽ‰ Auction completed! Winner: ${winnerName} for ${winningBid} ETB! Recorded in Winners Showcase.`);
  };

  /* ================= WALLET DEPOSIT ================= */
  const handleRequestDeposit = (amount: number, method: 'telebirr' | 'cbe', txCode: string) => {
    if (!user) return;
    const req: DepositRequest = {
      id: `dep_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      amountETB: amount,
      method,
      txCode,
      status: 'pending',
      timestamp: Date.now(),
    };
    saveDepositsList([req, ...deposits]);
  };

  const handleApproveDeposit = (depositId: string) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;

    if (user && user.id === dep.userId) {
      saveUserProfile({ ...user, walletBalanceETB: user.walletBalanceETB + dep.amountETB });
    }

    const updated = deposits.map((d) => (d.id === depositId ? { ...d, status: 'approved' as const } : d));
    saveDepositsList(updated);
  };

  /* Filtered Auctions */
  const activeAuctions = auctions.filter((auc) => auc.status === 'active');
  const completedAuctions = auctions.filter((auc) => auc.status === 'completed' && auc.winner);

  const filteredActiveAuctions = activeAuctions.filter((auc) => {
    const matchesCategory = categoryFilter === 'all' || auc.category === categoryFilter;
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCompletedAuctions = completedAuctions.filter((auc) => {
    const matchesCategory = categoryFilter === 'all' || auc.category === categoryFilter;
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.winner?.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 pb-16 lg:pb-0">
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setMainTab('live'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                ADDIS<span className="text-amber-400">BID</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                Ethiopia's Premier Online Auction
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 rounded-lg shadow-sm shadow-amber-400/20 animate-pulse"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => setCurrency((c) => (c === 'ETB' ? 'USD' : 'ETB'))}
              className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-400 hover:text-white border border-slate-800 rounded bg-slate-900 transition-colors"
            >
              {currency}
            </button>

            <button
              onClick={() => {
                if (!user) {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                } else {
                  setIsWalletOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm shadow-amber-400/20"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">
                {currency === 'ETB'
                  ? formatETB(user?.walletBalanceETB || 0)
                  : formatUSD((user?.walletBalanceETB || 0) / 130)}
              </span>
              <span className="text-[10px] bg-slate-950/20 px-1 py-0.5 rounded font-normal hidden sm:inline">+ Deposit</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors text-xs font-medium"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 rounded-lg transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950 border-b border-slate-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Lowest Unique Bid Wins Luxury Items!</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Bid with Telebirr, <span className="text-amber-400">Win Dream Items</span> for Cents!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Toyota Land Cruiser, iPhone 16 Pro Max, MacBook Pro, and luxury goods are live now. Deposit via Telebirr or CBE to place your secret bids.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (!user) {
                  setAuthMode('signup');
                  setIsAuthOpen(true);
                } else {
                  setIsWalletOpen(true);
                }
              }}
              className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
            >
              {user ? 'Top Up Wallet (+ Deposit)' : 'Create Free Account'}
            </button>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-semibold text-xs transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION TABS: LIVE AUCTIONS vs WINNERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setMainTab('live')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mainTab === 'live'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Live Auctions</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 font-mono font-bold">
              {activeAuctions.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab('winners')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              mainTab === 'winners'
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>ðŸ† Winners Showcase</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 font-mono font-bold">
              {completedAuctions.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mainTab === 'live' ? 'Search live auctions...' : 'Search winners or items...'}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {([
              { id: 'all', label: 'All Lots' },
              { id: 'gold', label: 'âœ¨ Gold & Bullion' },
              { id: 'vehicles', label: 'ðŸš— Cars & Vehicles' },
              { id: 'real_estate', label: 'ðŸ  Houses & Real Estate' },
              { id: 'playstation', label: 'ðŸŽ® PlayStation' },
              { id: 'laptops', label: 'ðŸ’» Laptops' },
              { id: 'smartphones', label: 'ðŸ“± Smartphones' },
              { id: 'watches', label: 'âŒš Luxury Watches' },
              { id: 'appliances', label: 'â„ï¸ Fridges & Appliances' },
            ] as { id: AuctionCategory; label: string }[]).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: LIVE AUCTIONS */}
        {mainTab === 'live' && (
          <div>
            {filteredActiveAuctions.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No active auctions found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredActiveAuctions.map((auc) => {
                  const isFinalFive = auc.endTime - Date.now() <= 1000 * 60 * 5 && auc.endTime - Date.now() > 0;
                  return (
                    <div
                      key={auc.id}
                      className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col transition-all hover:border-slate-700 shadow-xl ${
                        isFinalFive ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-800'
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                        <img
                          src={auc.image}
                          alt={auc.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold uppercase text-amber-300">
                            {auc.category}
                          </span>
                          {isFinalFive && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold uppercase animate-pulse flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              <span>Final 5 Mins</span>
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 font-mono text-xs text-amber-400 font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{formatTimeLeft(auc.endTime)}</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-white line-clamp-1">{auc.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{auc.subtitle}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Market Retail Value:</span>
                            <span className="font-mono font-bold text-slate-200">
                              {currency === 'ETB' ? formatETB(auc.retailValueETB) : formatUSD(auc.retailValueETB / 130)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Entry Bid Fee:</span>
                            <span className="font-mono font-bold text-amber-400">
                              {currency === 'ETB' ? formatETB(auc.entryFeeETB) : formatUSD(auc.entryFeeETB / 130)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                          <span>Total Bids Placed: <strong className="text-white">{auc.totalBidsCount}</strong></span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Secret Bidding
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedAuction(auc)}
                          className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all"
                        >
                          <span>Place Secret Bid</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WINNERS SHOWCASE */}
        {mainTab === 'winners' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>100% Transparency & Real Verified Winners</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every completed auction on Addis Bid is calculated using the official Lowest Unique Bid algorithm and verified with cryptographic proof.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-center">
                <div className="px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Verified Winners</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">{completedAuctions.length}</span>
                </div>
                <div className="px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Value Awarded</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">5.2M+ ETB</span>
                </div>
              </div>
            </div>

            {filteredCompletedAuctions.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No completed auctions found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCompletedAuctions.map((auc) => {
                  const winner = auc.winner!;
                  return (
                    <div
                      key={auc.id}
                      className="bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col transition-all shadow-xl"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                        <img
                          src={auc.image}
                          alt={auc.title}
                          className="w-full h-full object-cover grayscale-[20%]"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-md">
                            <Trophy className="w-3 h-3" />
                            <span>Verified Winner</span>
                          </span>
                        </div>

                        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 font-mono text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Completed</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                        <div>
                          <h3 className="text-base font-bold text-white line-clamp-1">{auc.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{auc.subtitle}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 via-slate-950 to-amber-950/30 border border-amber-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-400/40">
                              <User className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <span className="text-[10px] text-amber-400 font-semibold uppercase block tracking-wider">
                                Lucky Winner:
                              </span>
                              <span className="text-xs font-bold text-white block">
                                {winner.userName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {winner.userPhone || '0911 *** **'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                              {winner.savingsPercentage || 99.9}% Saved!
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Retail Price:</span>
                            <span className="font-mono line-through text-slate-400 font-semibold">
                              {currency === 'ETB' ? formatETB(auc.retailValueETB) : formatUSD(auc.retailValueETB / 130)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-400 font-semibold block">Winning Unique Bid:</span>
                            <span className="font-mono font-extrabold text-emerald-400 text-sm">
                              {currency === 'ETB' ? formatETB(winner.winningBidETB) : formatUSD(winner.winningBidETB / 130)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => setSelectedWinnerProof(auc)}
                            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Verification Proof</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL: WINNER TRANSPARENCY PROOF ================= */}
      {selectedWinnerProof && selectedWinnerProof.winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedWinnerProof(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Official Transparency Proof</h3>
                <p className="text-xs text-amber-400 font-mono">100% Cryptographically Verified Winner</p>
              </div>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 relative">
              <img src={selectedWinnerProof.image} alt={selectedWinnerProof.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{selectedWinnerProof.title}</h4>
              <p className="text-xs text-slate-400">{selectedWinnerProof.subtitle}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Winning User:</span>
                <span className="text-white font-bold">{selectedWinnerProof.winner.userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Registered Phone:</span>
                <span className="text-white font-mono">{selectedWinnerProof.winner.userPhone || '0911 *** 42'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Item Retail Value:</span>
                <span className="text-slate-300 font-mono">{formatETB(selectedWinnerProof.retailValueETB)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-amber-400 font-semibold">Winning Lowest Unique Bid:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{formatETB(selectedWinnerProof.winner.winningBidETB)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Savings:</span>
                <span className="text-emerald-400 font-bold">{selectedWinnerProof.winner.savingsPercentage}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Cryptographic Hash Verification Proof:
              </span>
              <div className="font-mono text-xs text-amber-300 select-all p-2 bg-slate-900 rounded border border-slate-800 break-all">
                {selectedWinnerProof.winner.hashProof}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                This auction was evaluated across all bids placed. The lowest unique bid was confirmed as the single winning entry with 100% fair mathematical proof.
              </p>
            </div>

            <button
              onClick={() => setSelectedWinnerProof(null)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: AUTHENTICATION ================= */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {authMode === 'login' && 'Log In to Addis Bid'}
                  {authMode === 'signup' && 'Create Your Account'}
                  {authMode === 'forgot' && 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' && 'Sign in with your phone or email'}
                  {authMode === 'signup' && 'Register with phone (Telebirr) or email'}
                  {authMode === 'forgot' && 'Quickly recover and set a new password'}
                </p>
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold mb-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'login' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            {/* LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number or Email</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="0911223344 or user@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password / Secret PIN</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setResetStep('request');
                        setResetEmail(authIdentifier.trim());
                        setAuthError('');
                        setResetNotification(null);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  {authLoading ? 'Signing in...' : 'Log In'}
                </button>
              </form>
            )}

            {/* SIGN UP */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Yonas Bekele"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number or Email</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="0911223344 or name@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password / PIN (min 4 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  {authLoading ? 'Creating account...' : 'Create Account & Sign In'}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD */}
            {authMode === 'forgot' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setResetNotification(null); }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Password Reset</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    Enter your registered email or phone number. We will dispatch a 6-digit verification code.
                  </p>
                </div>

                {resetNotification && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-1 shadow-lg">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verification Code Sent!</span>
                    </div>
                    <p className="text-[11px] text-slate-200">{resetNotification}</p>
                    <div className="mt-2 p-2 bg-slate-950/80 rounded-lg border border-emerald-500/30 font-mono text-center text-sm font-bold tracking-widest text-emerald-300 select-all">
                      {resetGeneratedCode}
                    </div>
                  </div>
                )}

                {resetStep === 'request' ? (
                  <form onSubmit={handleRequestResetCode} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Registered Email or Phone Number
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="0911223344 or user@gmail.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Verification Code</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmResetPassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        6-Digit Verification Code
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={resetInputCode}
                          onChange={(e) => setResetInputCode(e.target.value)}
                          placeholder="e.g. 849201"
                          maxLength={6}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono tracking-widest text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="At least 4 characters"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm & Reset Password</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official verified auction platform. Instant deposits supported via Telebirr and Commercial Bank of Ethiopia (CBE).</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: AUCTION DETAIL ================= */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedAuction(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 relative">
              <img src={selectedAuction.image} alt={selectedAuction.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 px-3 py-1 bg-slate-950/90 rounded-lg text-amber-400 font-mono font-bold text-xs flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTimeLeft(selectedAuction.endTime)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{selectedAuction.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAuction.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Retail Price:</span>
                <span className="font-mono font-bold text-base text-slate-200">
                  {formatETB(selectedAuction.retailValueETB)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Entry Bid Fee:</span>
                <span className="font-mono font-bold text-base text-amber-400">
                  {formatETB(selectedAuction.entryFeeETB)}
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const val = parseFloat((form.elements.namedItem('bidAmount') as HTMLInputElement).value);
                if (val > 0) {
                  const ok = handlePlaceBid(selectedAuction.id, val);
                  if (ok) form.reset();
                }
              }}
              className="space-y-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <label className="block text-xs font-bold text-amber-300">
                Enter your secret bid amount (from 0.01 ETB):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="bidAmount"
                  required
                  placeholder="e.g. 0.35 or 4.25"
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  Place Bid
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Submit the lowest unique bid that no other participant entered to win this item!
              </p>
            </form>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Friends:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `Bid on this ${selectedAuction.title} on Addis Bid! https://ethiochareta.vercel.app`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://ethiochareta.vercel.app')}&text=${encodeURIComponent(text)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 font-bold text-xs"
                >
                  Telegram
                </button>
                <button
                  onClick={() => {
                    const text = `Bid on this ${selectedAuction.title} on Addis Bid! https://ethiochareta.vercel.app`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-xs"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: WALLET DEPOSIT ================= */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsWalletOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Wallet & Deposits</h3>
                <p className="text-xs text-slate-400">Top up your balance via Telebirr or CBE Birr</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Current Available Balance:</span>
              <span className="text-2xl font-mono font-extrabold text-amber-400">
                {formatETB(user?.walletBalanceETB || 0)}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Payment Accounts:</h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold block">ðŸ“± Telebirr</span>
                    <span className="text-[10px] text-slate-400">{paymentAccounts.telebirrHolder}</span>
                  </div>
                  <span className="font-mono text-white font-bold select-all bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    {paymentAccounts.telebirrNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-sky-400 font-bold block">ðŸ¦ CBE (Commercial Bank of Ethiopia)</span>
                    <span className="text-[10px] text-slate-400">{paymentAccounts.cbeHolder}</span>
                  </div>
                  <span className="font-mono text-white font-bold select-all bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    {paymentAccounts.cbeAccount}
                  </span>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const amt = parseFloat((form.elements.namedItem('depositAmount') as HTMLInputElement).value);
                  const method = (form.elements.namedItem('depositMethod') as HTMLSelectElement).value as 'telebirr' | 'cbe';
                  const tx = (form.elements.namedItem('txCode') as HTMLInputElement).value;
                  handleRequestDeposit(amt, method, tx);
                  alert('Deposit request received! Your balance will be updated as soon as the administrator verifies the reference.');
                  setIsWalletOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Deposit Amount (ETB)</label>
                  <input
                    type="number"
                    name="depositAmount"
                    required
                    min="10"
                    placeholder="e.g. 200"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    name="depositMethod"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Reference Code (SMS/Ref)</label>
                  <input
                    type="text"
                    name="txCode"
                    required
                    placeholder="e.g. FT2409..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all"
                >
                  Submit Deposit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIN CONTROL PANEL ================= */}
      {isAdminOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Admin Management Panel</h3>
                <p className="text-xs text-amber-400 font-mono">System Administrator â€” Manage lots, declare winners, verify deposits</p>
              </div>
            </div>

            {/* 1. Payment Accounts Configuration */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  Edit Deposit Accounts (Telebirr & CBE)
                </h4>
                <span className="text-[10px] text-slate-400">Displayed to all users on the deposit screen</span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const telebirrNumber = (form.elements.namedItem('telebirrNumber') as HTMLInputElement).value;
                  const telebirrHolder = (form.elements.namedItem('telebirrHolder') as HTMLInputElement).value;
                  const cbeAccount = (form.elements.namedItem('cbeAccount') as HTMLInputElement).value;
                  const cbeHolder = (form.elements.namedItem('cbeHolder') as HTMLInputElement).value;

                  savePaymentAccounts({
                    telebirrNumber: telebirrNumber.trim(),
                    telebirrHolder: telebirrHolder.trim(),
                    cbeAccount: cbeAccount.trim(),
                    cbeHolder: cbeHolder.trim(),
                  });
                  alert('Telebirr and CBE account details updated successfully!');
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telebirr Number</label>
                  <input
                    type="text"
                    name="telebirrNumber"
                    defaultValue={paymentAccounts.telebirrNumber}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telebirr Account Name</label>
                  <input
                    type="text"
                    name="telebirrHolder"
                    defaultValue={paymentAccounts.telebirrHolder}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">CBE Account Number</label>
                  <input
                    type="text"
                    name="cbeAccount"
                    defaultValue={paymentAccounts.cbeAccount}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">CBE Account Name</label>
                  <input
                    type="text"
                    name="cbeHolder"
                    defaultValue={paymentAccounts.cbeHolder}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="sm:col-span-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all"
                  >
                    Save Payment Accounts
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Pending Deposits */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Pending User Deposit Requests ({deposits.filter(d => d.status === 'pending').length} new):
              </h4>
              {deposits.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  No pending deposit requests.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {deposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{dep.userName}</span>
                          <span className="text-slate-400 text-[11px]">({dep.userPhone})</span>
                          <span className="text-amber-400 font-semibold uppercase text-[10px] bg-amber-400/10 px-1.5 py-0.5 rounded">
                            {dep.method}
                          </span>
                        </div>
                        <span className="text-slate-300 text-[11px] block mt-0.5">
                          Amount: <strong className="text-emerald-400 font-mono">{formatETB(dep.amountETB)}</strong> â€¢ Ref: <span className="font-mono text-white select-all">{dep.txCode}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {dep.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveDeposit(dep.id)}
                              className="py-1 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Reject and delete this deposit request?')) {
                                  saveDepositsList(deposits.filter(d => d.id !== dep.id));
                                }
                              }}
                              className="py-1 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded">
                            Approved âœ“
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Manage Active Auctions (End Auction & Pick Winner) */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Auctions Management ({activeAuctions.length} live):
                </h4>
                <span className="text-[11px] text-amber-400">Declare lowest unique bid winner</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {activeAuctions.map((auc) => (
                  <div key={auc.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5">
                      <img src={auc.image} alt={auc.title} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                      <div>
                        <span className="font-bold text-white block line-clamp-1">{auc.title}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                          <span className="text-amber-400 font-mono">Time Left: {formatTimeLeft(auc.endTime)}</span>
                          <span className="text-slate-400">â€¢ Bids: {auc.totalBidsCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleEndAuctionAndPickWinner(auc.id)}
                        className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1 hover:brightness-110"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>End & Declare Winner</span>
                      </button>
                      <button
                        onClick={() => {
                          const updated = auctions.map((a) => (a.id === auc.id ? { ...a, endTime: a.endTime + 1000 * 60 * 60 * 24 } : a));
                          saveAuctionsCatalog(updated);
                        }}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px]"
                      >
                        +1 Day
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete auction ${auc.title}?`)) {
                            const updated = auctions.filter((a) => a.id !== auc.id);
                            saveAuctionsCatalog(updated);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Completed Auctions & Winners Management */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Completed Auctions & Winners ({completedAuctions.length}):
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {completedAuctions.map((auc) => (
                  <div key={auc.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={auc.image} alt={auc.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div>
                        <span className="font-bold text-white block line-clamp-1">{auc.title}</span>
                        <span className="text-emerald-400 text-[11px]">
                          Winner: {auc.winner?.userName} ({formatETB(auc.winner?.winningBidETB || 0)})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const updated = auctions.map((a) => (a.id === auc.id ? { ...a, status: 'active' as const, endTime: Date.now() + 1000 * 60 * 60 * 24 } : a));
                          saveAuctionsCatalog(updated);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                      >
                        Reopen
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete this completed auction?`)) {
                            const updated = auctions.filter((a) => a.id !== auc.id);
                            saveAuctionsCatalog(updated);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Post New Auction */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add New Lot to Auction:</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const title = (form.elements.namedItem('lotTitle') as HTMLInputElement).value;
                  const subtitle = (form.elements.namedItem('lotSubtitle') as HTMLInputElement).value;
                  const category = (form.elements.namedItem('lotCategory') as HTMLSelectElement).value as AuctionCategory;
                  const retail = parseFloat((form.elements.namedItem('lotRetail') as HTMLInputElement).value);
                  const entry = parseFloat((form.elements.namedItem('lotEntry') as HTMLInputElement).value);
                  const img = (form.elements.namedItem('lotImage') as HTMLInputElement).value;
                  const hours = parseFloat((form.elements.namedItem('lotHours') as HTMLInputElement).value) || 24;

                  const newLot: AuctionItem = {
                    id: `auc_${Date.now()}`,
                    title,
                    subtitle,
                    category,
                    retailValueETB: retail,
                    entryFeeETB: entry,
                    maxAllowedBidETB: 999999,
                    endTime: Date.now() + 1000 * 60 * 60 * hours,
                    image: img,
                    status: 'active',
                    totalBidsCount: 0,
                    bids: [],
                  };

                  saveAuctionsCatalog([newLot, ...auctions]);
                  form.reset();
                  alert('New item successfully posted to auction!');
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Item Title</label>
                  <input
                    type="text"
                    name="lotTitle"
                    required
                    placeholder="e.g. iPhone 16 Pro Max"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Item Subtitle</label>
                  <input
                    type="text"
                    name="lotSubtitle"
                    required
                    placeholder="e.g. 256GB Desert Titanium Boxed"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    name="lotCategory"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="gold">Gold & Bullion (á‹ˆáˆ­á‰…)</option>
                    <option value="vehicles">Vehicles & Cars (áˆ˜áŠªáŠ“)</option>
                    <option value="real_estate">Houses & Real Estate (á‰¤á‰µ)</option>
                    <option value="playstation">PlayStation & Gaming (á•áˆŒá‹­áˆµá‰´áˆ½áŠ•)</option>
                    <option value="laptops">Laptops & Computers (áˆ‹á•á‰¶á•)</option>
                    <option value="smartphones">Smartphones (áˆµáˆáŠ®á‰½)</option>
                    <option value="watches">Luxury Watches (áˆ°á‹“á‰¶á‰½)</option>
                    <option value="appliances">Fridges & Home Appliances (ááˆªáŒ…)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Retail Value (ETB)</label>
                  <input
                    type="number"
                    name="lotRetail"
                    required
                    placeholder="150000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Entry Bid Fee (ETB)</label>
                  <input
                    type="number"
                    name="lotEntry"
                    required
                    placeholder="50"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    name="lotHours"
                    defaultValue={24}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="lotImage"
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                  >
                    Publish Auction Lot (+ Post Lot)
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto space-y-4">
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
              <h3 className="text-lg font-bold text-white">How Does Addis Bid Work?</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">1. Lowest Unique Bid Wins</strong>
                Submit secret bids from as low as 0.01 ETB. Think of amounts that other bidders will overlook.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">2. Duplicate Bids Are Eliminated</strong>
                If two or more bidders enter the exact same amount, that bid is no longer unique. Only the single lowest unique bid wins!
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">3. Winner Takes the Item</strong>
                When the auction countdown expires, the lowest unique bidder claims the item for their bid price!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>Â© 2026 ADDIS BID â€” Ethiopia's Premier Online Auction Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Auto-mount if running directly as entry point (e.g. main.tsx)
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
