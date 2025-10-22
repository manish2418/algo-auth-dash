// Dashboard types and interfaces
export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export interface WatchlistStock {
  name: string;
  symbol: string;
  price: string | null;
  change: string | null;
  changePercent: string | null;
  isPositive?: boolean;
  tok?: string;
  exSeg?: string;
}

export interface MostBoughtStock {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export interface InvestmentProduct {
  title: string;
  icon: any;
  badge?: string;
}

export interface InvestingTool {
  title: string;
  icon: any;
  badge?: string;
}

export interface ResearchItem {
  title: string;
  icon: any;
}

export interface MarketUpdate {
  title: string;
  icon: any;
}
