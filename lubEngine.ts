import { BidRecord, BidStatus } from '../types/auction';

export interface BidFrequency {
  amount: number;
  count: number;
  bidders: string[];
  isUnique: boolean;
  isWinning: boolean;
}

export interface LUBAnalysis {
  winningBidRecord: BidRecord | null;
  winningAmount: number | null;
  uniqueBids: BidRecord[];
  duplicatedBids: BidRecord[];
  frequencies: BidFrequency[];
  totalBids: number;
  uniqueRatio: number;
}

export function analyzeLUB(bids: BidRecord[]): LUBAnalysis {
  if (!bids || bids.length === 0) {
    return {
      winningBidRecord: null,
      winningAmount: null,
      uniqueBids: [],
      duplicatedBids: [],
      frequencies: [],
      totalBids: 0,
      uniqueRatio: 0,
    };
  }

  const grouped = new Map<number, BidRecord[]>();
  for (const bid of bids) {
    const amt = Number(bid.amount.toFixed(2));
    const list = grouped.get(amt) || [];
    list.push(bid);
    grouped.set(amt, list);
  }

  const sortedAmounts = Array.from(grouped.keys()).sort((a, b) => a - b);
  let winningAmount: number | null = null;
  let winningBidRecord: BidRecord | null = null;

  for (const amt of sortedAmounts) {
    const list = grouped.get(amt)!;
    if (list.length === 1) {
      winningAmount = amt;
      winningBidRecord = list[0];
      break;
    }
  }

  const frequencies: BidFrequency[] = sortedAmounts.map((amt) => {
    const list = grouped.get(amt)!;
    return {
      amount: amt,
      count: list.length,
      bidders: list.map((b) => b.userName),
      isUnique: list.length === 1,
      isWinning: amt === winningAmount,
    };
  });

  const uniqueBids: BidRecord[] = [];
  const duplicatedBids: BidRecord[] = [];

  for (const bid of bids) {
    const amt = Number(bid.amount.toFixed(2));
    const count = grouped.get(amt)?.length || 0;
    if (count === 1) {
      uniqueBids.push(bid);
    } else {
      duplicatedBids.push(bid);
    }
  }

  const uniqueRatio = bids.length > 0 ? (uniqueBids.length / bids.length) * 100 : 0;

  return {
    winningBidRecord,
    winningAmount,
    uniqueBids,
    duplicatedBids,
    frequencies,
    totalBids: bids.length,
    uniqueRatio,
  };
}

export function getBidStatus(bidAmount: number, allBids: BidRecord[]): BidStatus {
  const rounded = Number(bidAmount.toFixed(2));
  const matchingBids = allBids.filter((b) => Number(b.amount.toFixed(2)) === rounded);

  if (matchingBids.length > 1) {
    return 'duplicated';
  }

  const analysis = analyzeLUB(allBids);
  if (analysis.winningAmount === rounded) {
    return 'unique_lowest';
  }

  return 'unique_higher';
}

export function formatETB(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('ETB', 'ETB ');
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTimeRemaining(ms: number): {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
} {
  if (ms <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', isExpired: true };
  }

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    isExpired: false,
  };
}

export const SAMPLE_BIDDER_NAMES = [
  'Abebe B.',
  'Tigist K.',
  'Yonas T.',
  'Selamawit G.',
  'Dawit M.',
  'Bethlehem A.',
  'Kaleb S.',
  'Helina Z.',
  'Eyob R.',
  'Rahel D.',
  'Robel F.',
  'Marta T.',
  'Natnael H.',
  'Genet W.',
  'Binyam E.',
];

export function generateInitialBids(targetCount: number, maxPrice: number = 30): BidRecord[] {
  const bids: BidRecord[] = [];
  const now = Date.now();
  const commonTiers = [0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5];

  commonTiers.forEach((tier, i) => {
    const dupCount = (i % 3) + 2;
    for (let c = 0; c < dupCount; c++) {
      bids.push({
        id: `bid-dup-${tier}-${c}`,
        userId: `usr-dup-${tier}-${c}`,
        userName: SAMPLE_BIDDER_NAMES[(i * 3 + c) % SAMPLE_BIDDER_NAMES.length],
        amount: tier,
        timestamp: now - (bids.length + 1) * 60000,
      });
    }
  });

  while (bids.length < targetCount) {
    const randomAmount = Number((Math.random() * maxPrice + 0.1).toFixed(2));
    const randomUser = SAMPLE_BIDDER_NAMES[Math.floor(Math.random() * SAMPLE_BIDDER_NAMES.length)];
    bids.push({
      id: `bid-scat-${bids.length}`,
      userId: `usr-${bids.length}`,
      userName: randomUser,
      amount: randomAmount,
      timestamp: now - bids.length * 45000,
    });
  }

  return bids;
}