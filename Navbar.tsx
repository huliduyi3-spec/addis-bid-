import React from 'react';
import { Wallet, Bell, Award, HelpCircle, Sparkles, Sliders } from 'lucide-react';
import { UserProfile, AppNotification } from '../types/auction';
import { formatETB, formatUSD } from '../utils/lubEngine';

interface NavbarProps {
  user: UserProfile;
  currency: 'ETB' | 'USD';
  onToggleCurrency: () => void;
  notifications: AppNotification[];
  onOpenWallet: () => void;
  onOpenMyBids: () => void;
  onOpenHowItWorks: () => void;
  onOpenSandbox: () => void;
  onOpenWinners: () => void;
  onOpenNotifications: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currency,
  onToggleCurrency,
  notifications,
  onOpenWallet,
  onOpenMyBids,
  onOpenHowItWorks,
  onOpenSandbox,
  onOpenWinners,
  onOpenNotifications,
  activeNavTab,
  setActiveNavTab,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveNavTab('auctions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-95"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-white leading-none whitespace-nowrap">
                ADDIS<span className="text-amber-400">BID</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider leading-none mt-0.5">
                አዲስ ቢድ · Lowest Unique Wins
              </span>
            </div>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveNavTab('auctions');
              const el = document.getElementById('auctions-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeNavTab === 'auctions' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Live Auctions
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>How It Works</span>
          </button>
          <button
            onClick={onOpenSandbox}
            className="whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-amber-400/90" />
            <span>Strategy Sandbox</span>
          </button>
          <button
            onClick={onOpenWinners}
            className="whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-slate-400" />
            <span>Winners Ledger</span>
          </button>
          <button
            onClick={onOpenMyBids}
            className="whitespace-nowrap transition-colors hover:text-white relative"
          >
            My Bids
            {user.totalBidsPlaced > 0 && (
              <span className="ml-1.5 text-[11px] font-mono text-amber-300">
                ({user.totalBidsPlaced})
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleCurrency}
            className="hidden sm:inline-flex px-2 py-1 text-xs font-mono font-medium text-slate-400 hover:text-slate-200 border border-slate-800 rounded bg-slate-900/60 transition-colors whitespace-nowrap"
          >
            {currency}
          </button>
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm shadow-amber-400/20 active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">
              {currency === 'ETB' ? formatETB(user.walletBalanceETB) : formatUSD(user.walletBalanceETB / 130)}
            </span>
            <span className="text-[11px] bg-slate-950/15 px-1.5 py-0.5 rounded font-normal hidden sm:inline">
              + Top Up
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};