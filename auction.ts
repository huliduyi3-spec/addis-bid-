export type AuctionCategory = 'all' | 'vehicles' | 'smartphones' | 'laptops' | 'gaming';

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
  fallbackImage?: string;
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

export type BidStatus = 'unique_lowest' | 'unique_higher' | 'duplicated';

export interface UserBid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  amount: number;
  feePaidETB: number;
  placedAt: number;
  status: BidStatus;
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

export type PaymentMethod = 'telebirr' | 'cbe_birr' | 'chapa' | 'card';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'bid_fee' | 'auction_win_claim' | 'bonus';
  method?: PaymentMethod;
  amountETB: number;
  description: string;
  timestamp: number;
  referenceId: string;
  status: 'completed' | 'pending';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'duplicate_alert' | 'unique_alert' | 'win' | 'deposit' | 'system';
  auctionId?: string;
}