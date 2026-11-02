import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import {
  Wallet, Bell, Award, HelpCircle, Sparkles, Sliders, ArrowDown, Play,
  ShieldCheck, Zap, Coins, Clock, Trophy, CheckCircle2, X, ChevronRight,
  Search, Smartphone, Building, CreditCard, Truck, MapPin, RotateCcw,
  ArrowDownRight, ArrowUpRight, AlertTriangle, AlertOctagon, ArrowRight
} from 'lucide-react';
import './index.css';

// --- TYPES ---
export type AuctionCategory = 'all' | 'vehicles' | 'smartphones' | 'laptops' | 'gaming';
export type BidStatus = 'unique_lowest' | 'unique_higher' | 'duplicated';
export type PaymentMethod = 'telebirr' | 'cbe_birr' | 'chapa' | 'card';

export interface BidRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
  isUser?: boolean;
}

export interface AuctionItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'vehicles' | 'smartphones' | 'laptops' | 'gaming';
  retailValueETB: number;
  retailValueUSD: number;
  entryFeeETB: number;
  image: string;
  specs: string[];
  description: string;
  condition: string;
  warranty: string;
  totalBidsCount: number;
  maxBidLimitETB: number;
  endTime: number;
  status: 'live' | 'ending_soon' | 'completed';
  bids: BidRecord[];
  winningBid?: {
    amount: number;
    userId: string;
    userName: string;
    retailSavingsPercent: number;
    timestamp: number;
  };
  fairCommitHash: string;
  featured?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  walletBalanceETB: number;
  bidCredits: number;
  totalBidsPlaced: number;
  winsCount: number;
}

// --- UTILS & LUB ENGINE ---
export function formatETB(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('ETB', 'ETB ');
}

export function formatTimeRemaining(ms: number) {
  if (ms <= 0) return { hours: '00', minutes: '00', seconds: '00', isExpired: true };
  const s = Math.floor(ms / 1000);
  const hours = Math.floor(s / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const seconds = (s % 60).toString().padStart(2, '0');
  return { hours, minutes, seconds, isExpired: false };
}

export const SAMPLE_BIDDER_NAMES = [
  'Abebe B.', 'Tigist K.', 'Yonas T.', 'Selamawit G.', 'Dawit M.',
  'Bethlehem A.', 'Kaleb S.', 'Helina Z.', 'Eyob R.', 'Rahel D.', 'Robel F.'
];

export function analyzeLUB(bids: BidRecord[]) {
  if (!bids || bids.length === 0) {
    return { winningBidRecord: null, winningAmount: null, uniqueBids: [], duplicatedBids: [], frequencies: [], totalBids: 0 };
  }
  const grouped = new Map<number, BidRecord[]>();
  for (const b of bids) {
    const amt = Number(b.amount.toFixed(2));
    const list = grouped.get(amt) || [];
    list.push(b);
    grouped.set(amt, list);
  }
  const sorted = Array.from(grouped.keys()).sort((a, b) => a - b);
  let winningAmount: number | null = null;
  let winningBidRecord: BidRecord | null = null;
  for (const a of sorted) {
    const list = grouped.get(a)!;
    if (list.length === 1) {
      winningAmount = a;
      winningBidRecord = list[0];
      break;
    }
  }
  const frequencies = sorted.map((amt) => {
    const list = grouped.get(amt)!;
    return {
      amount: amt,
      count: list.length,
      bidders: list.map((x) => x.userName),
      isUnique: list.length === 1,
      isWinning: amt === winningAmount,
    };
  });
  const uniqueBids = bids.filter((b) => grouped.get(Number(b.amount.toFixed(2)))?.length === 1);
  const duplicatedBids = bids.filter((b) => (grouped.get(Number(b.amount.toFixed(2)))?.length || 0) > 1);
  return { winningBidRecord, winningAmount, uniqueBids, duplicatedBids, frequencies, totalBids: bids.length };
}

export function getBidStatus(bidAmount: number, allBids: BidRecord[]): BidStatus {
  const rounded = Number(bidAmount.toFixed(2));
  const matches = allBids.filter((b) => Number(b.amount.toFixed(2)) === rounded);
  if (matches.length > 1) return 'duplicated';
  const { winningAmount } = analyzeLUB(allBids);
  if (winningAmount === rounded) return 'unique_lowest';
  return 'unique_higher';
}

export function generateInitialBids(targetCount: number, maxPrice: number = 30): BidRecord[] {
  const bids: BidRecord[] = [];
  const now = Date.now();
  const commonTiers = [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 1.5, 2.0];
  commonTiers.forEach((tier, i) => {
    const count = (i % 3) + 2;
    for (let c = 0; c < count; c++) {
      bids.push({
        id: `dup-${tier}-${c}`,
        userId: `usr-dup-${c}`,
        userName: SAMPLE_BIDDER_NAMES[(i * 2 + c) % SAMPLE_BIDDER_NAMES.length],
        amount: tier,
        timestamp: now - (c + 1) * 60000,
      });
    }
  });
  while (bids.length < targetCount) {
    bids.push({
      id: `rnd-${bids.length}`,
      userId: `usr-rnd-${bids.length}`,
      userName: SAMPLE_BIDDER_NAMES[bids.length % SAMPLE_BIDDER_NAMES.length],
      amount: Number((Math.random() * maxPrice + 0.1).toFixed(2)),
      timestamp: now - bids.length * 30000,
    });
  }
  return bids;
}

// --- INITIAL DATA ---
export const INITIAL_USER: UserProfile = {
  id: 'usr_me_addis',
  name: 'Mame Boss',
  phone: '+251 91 123 4567',
  email: 'mameboss98@gmail.com',
  walletBalanceETB: 3500.0,
  bidCredits: 12,
  totalBidsPlaced: 6,
  winsCount: 1,
};

export const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-suv-byd',
    title: 'BYD Song Plus EV Luxury Edition',
    subtitle: 'Zero Emission 2025 Crossover SUV with Panoramic Roof & Fast Charging',
    category: 'vehicles',
    retailValueETB: 5450000,
    retailValueUSD: 42000,
    entryFeeETB: 75,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    specs: ['605 km Range', 'Blade Battery', 'Rotating Screen', 'Ethiopian Import Clearance Included'],
    description: 'High-efficiency electric SUV engineered for Addis Ababa roads with rapid fast charging.',
    condition: 'Brand New (0 km)',
    warranty: '5 Years Manufacturer Warranty',
    totalBidsCount: 184,
    maxBidLimitETB: 350,
    endTime: Date.now() + 18 * 60 * 1000 + 45 * 1000,
    status: 'ending_soon',
    fairCommitHash: 'sha256-e9b42c8159a607dd293418d1844b6c31bfad77402619c968fbbd31e9c20a9a91',
    featured: true,
    bids: generateInitialBids(184, 85),
  },
  {
    id: 'auc-iphone-16-pro',
    title: 'Apple iPhone 16 Pro Max 1TB',
    subtitle: 'Natural Titanium Finish · Grade 5 Titanium Shield · A18 Pro Chip',
    category: 'smartphones',
    retailValueETB: 245000,
    retailValueUSD: 1699,
    entryFeeETB: 30,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    specs: ['6.9" Super Retina XDR', '48MP Fusion Triple Camera', '1TB Storage', 'Unlocked for Ethio Telecom & Safaricom'],
    description: 'Apple flagship titanium smartphone with camera control and 4K 120fps Dolby Vision.',
    condition: 'Brand New In Box',
    warranty: '1 Year Apple Warranty',
    totalBidsCount: 142,
    maxBidLimitETB: 150,
    endTime: Date.now() + 44 * 60 * 1000,
    status: 'live',
    fairCommitHash: 'sha256-7fa1c4856f6dd177ec7ad818b2f9103e051b439c299c1581e18ac149ba12f864',
    featured: true,
    bids: generateInitialBids(142, 45),
  },
  {
    id: 'auc-macbook-pro-16',
    title: 'MacBook Pro 16" M3 Max',
    subtitle: 'Space Black · 16-Core CPU · 40-Core GPU · 36GB RAM · 1TB SSD',
    category: 'laptops',
    retailValueETB: 460000,
    retailValueUSD: 3499,
    entryFeeETB: 50,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    specs: ['Liquid Retina XDR Display', 'M3 Max 40-Core GPU', '36GB Unified Memory', 'Up to 22h Battery'],
    description: 'Pro workstation for developers and creators in Ethiopia with incredible battery life.',
    condition: 'Brand New Sealed Box',
    warranty: '1 Year Apple Warranty',
    totalBidsCount: 96,
    maxBidLimitETB: 200,
    endTime: Date.now() + 195 * 60 * 1000,
    status: 'live',
    fairCommitHash: 'sha256-a36c8411d9d93eb42fa026c04f9547d25bb54988e0b68625e1df11a43a0f7961',
    bids: generateInitialBids(96, 60),
  },
  {
    id: 'auc-ps5-pro',
    title: 'Sony PlayStation 5 Pro & DualSense Edge',
    subtitle: '2TB Custom High-Speed SSD · Ray Tracing · PSSR AI Upscaling',
    category: 'gaming',
    retailValueETB: 135000,
    retailValueUSD: 899,
    entryFeeETB: 25,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    specs: ['PlayStation Spectral Resolution', '2TB SSD', '60fps & 120fps Modes', 'DualSense Edge Controller'],
    description: 'Next-generation console gaming with ultra-smooth 60fps fidelity and modular controller.',
    condition: 'Brand New Sealed',
    warranty: '1 Year Sony Warranty',
    totalBidsCount: 118,
    maxBidLimitETB: 120,
    endTime: Date.now() + 320 * 60 * 1000,
    status: 'live',
    fairCommitHash: 'sha256-c4d32095f9c0e393b4845a76985d2638848a6046e7b1660dfcb2694b91480f76',
    bids: generateInitialBids(118, 40),
  },
  {
    id: 'auc-completed-drone',
    title: 'DJI Mini 4 Pro Drone Combo',
    subtitle: 'Omnidirectional Obstacle Sensing · 4K/60fps HDR · 20km Transmission',
    category: 'gaming',
    retailValueETB: 175000,
    retailValueUSD: 1150,
    entryFeeETB: 35,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    specs: ['Under 249g Ultra-Light', 'True Vertical Shooting', '3x Flight Batteries', 'RC 2 Display Controller'],
    description: 'Winner clinched this retail 175,000 ETB kit for lowest unique bid of 4.17 ETB!',
    condition: 'Delivered to Winner in Bole, Addis Ababa',
    warranty: '1 Year DJI Care',
    totalBidsCount: 215,
    maxBidLimitETB: 100,
    endTime: Date.now() - 4800000,
    status: 'completed',
    winningBid: {
      amount: 4.17,
      userId: 'usr_winner_dawit',
      userName: 'Dawit M.',
      retailSavingsPercent: 99.99,
      timestamp: Date.now() - 4800000,
    },
    fairCommitHash: 'sha256-91b72e90c883ff10984a9ec0445d4701e847c1f05470ef24177d704ba411a762',
    bids: [
      { id: 'b-dup1', userId: 'u1', userName: 'Abebe B.', amount: 0.01, timestamp: 1 },
      { id: 'b-dup2', userId: 'u2', userName: 'Tigist K.', amount: 0.01, timestamp: 2 },
      { id: 'b-win', userId: 'usr_winner_dawit', userName: 'Dawit M.', amount: 4.17, timestamp: 12 },
    ],
  },
];

// --- APP COMPONENT ---
export default function App() {
  const [auctions, setAuctions] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [auditAuction, setAuditAuction] = useState<AuctionItem | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [bidAmountInput, setBidAmountInput] = useState('2.15');
  const [bidMessage, setBidMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuctionCategory>('all');

  const featured = auctions[0];

  const handlePlaceBid = (item: AuctionItem, amt: number) => {
    if (user.walletBalanceETB < item.entryFeeETB) {
      setIsWalletOpen(true);
      return;
    }
    const newBid: BidRecord = {
      id: `bid-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amount: amt,
      timestamp: Date.now(),
      isUser: true,
    };
    const updated = [...item.bids, newBid];
    setAuctions((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, bids: updated, totalBidsCount: updated.length } : a))
    );
    setUser((u) => ({
      ...u,
      walletBalanceETB: u.walletBalanceETB - item.entryFeeETB,
      totalBidsPlaced: u.totalBidsPlaced + 1,
    }));
    const status = getBidStatus(amt, updated);
    setBidMessage(
      status === 'unique_lowest'
        ? `🌟 Congratulations! Your bid of ${formatETB(amt)} is currently the LOWEST UNIQUE BID!`
        : status === 'duplicated'
        ? `⚠️ Duplicate collision! Another player bid ${formatETB(amt)}. Both bids cancelled out!`
        : `Your bid of ${formatETB(amt)} is unique, but higher than the lowest unique bid.`
    );
  };

  const filteredAuctions = auctions.filter((a) => {
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                ADDIS<span className="text-amber-400">BID</span>
              </span>
              <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">አዲስ ቢድ · Lowest Unique Wins</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-900"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>
            <button
              onClick={() => setIsSandboxOpen(true)}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-900"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Strategy Lab</span>
            </button>
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold font-mono"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{formatETB(user.walletBalanceETB)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-800/80 bg-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="text-xs text-amber-400 font-semibold mb-2">ADDIS ABABA REVERSE AUCTIONS</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              The Lowest <span className="text-amber-400">Unique Price</span> Wins.
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Place your secret price. If no one else bids your exact amount, the absolute lowest unique bid takes the item at that price!
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalog" className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg">
                Explore Live Lots
              </a>
              <button
                onClick={() => setIsSandboxOpen(true)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-700 text-white font-medium text-xs rounded-lg flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                Practice Simulator
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <img src={featured.image} alt={featured.title} className="w-full h-48 object-cover rounded-lg mb-3" />
            <h3 className="font-bold text-white text-base">{featured.title}</h3>
            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-800">
              <span className="text-slate-400">Market Value: {formatETB(featured.retailValueETB)}</span>
              <button
                onClick={() => setSelectedAuction(featured)}
                className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Place Secret Bid
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Active Auction Lots</h2>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto">
            {(['all', 'vehicles', 'smartphones', 'laptops', 'gaming'] as AuctionCategory[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1 text-xs rounded font-medium capitalize ${
                  categoryFilter === c ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-[11px] text-amber-400 uppercase font-semibold">{item.category}</div>
                <h3 className="font-bold text-white text-sm mt-1">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.subtitle}</p>
                <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-500">Retail Value</div>
                    <div className="font-bold text-white font-mono">{formatETB(item.retailValueETB)}</div>
                  </div>
                  {item.status === 'completed' ? (
                    <button
                      onClick={() => setAuditAuction(item)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                    >
                      View Winner
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedAuction(item)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                    >
                      Place Bid ({formatETB(item.entryFeeETB)})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Addis Bid Technologies PLC. Addis Ababa, Ethiopia.
      </footer>

      {/* BID MODAL */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => { setSelectedAuction(null); setBidMessage(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-white mb-1">{selectedAuction.title}</h3>
            <p className="text-xs text-slate-400 mb-4">Entry fee: {formatETB(selectedAuction.entryFeeETB)}</p>

            {bidMessage && (
              <div className="p-3 mb-4 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs">
                {bidMessage}
              </div>
            )}

            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Secret Bid (ETB)</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={selectedAuction.maxBidLimitETB}
                value={bidAmountInput}
                onChange={(e) => setBidAmountInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold"
              />
              <button
                onClick={() => handlePlaceBid(selectedAuction, parseFloat(bidAmountInput) || 1)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg"
              >
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WALLET MODAL */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsWalletOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-white mb-2">Addis Wallet</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4">
              <div className="text-xs text-slate-400">Balance</div>
              <div className="text-2xl font-bold font-mono text-white mt-1">{formatETB(user.walletBalanceETB)}</div>
            </div>
            <button
              onClick={() => {
                setUser((u) => ({ ...u, walletBalanceETB: u.walletBalanceETB + 500 }));
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg"
            >
              + Deposit 500 ETB (telebirr Demo)
            </button>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsHowItWorksOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-white mb-3">How Addis Bid Works</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-amber-400">1. Secret Bids:</strong> All prices submitted are completely sealed.
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-rose-400">2. Duplicates Cancel:</strong> If two or more users bid the same price, both cancel out!
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <strong className="text-emerald-400">3. Lowest Unique Wins:</strong> The lowest remaining bid takes the prize!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Auto mount if root exists
if (typeof document !== 'undefined' && document.getElementById('root')) {
  createRoot(document.getElementById('root')!).render(<App />);
}
