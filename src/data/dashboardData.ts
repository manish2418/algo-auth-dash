import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Star,
  Gauge,
  Target,
  BookOpen,
  Radio,
  Megaphone,
} from "lucide-react";
import {
  MarketIndex,
  WatchlistStock,
  MostBoughtStock,
  InvestmentProduct,
  InvestingTool,
  ResearchItem,
  MarketUpdate,
} from "@/types/dashboard";

// Market indices data
export const marketIndices: MarketIndex[] = [
  {
    name: "NIFTY",
    value: "25043.75",
    change: "+389.05",
    changePercent: "(+1.58%)",
    isPositive: true,
  },
  {
    name: "SENSEX",
    value: "80119.03",
    change: "-307.43",
    changePercent: "(-0.38%)",
    isPositive: false,
  },
];

// Watchlist stocks data
export const watchlistStocks: WatchlistStock[] = [
  {
    symbol: "TATASTEEL-EQ",
    name: "TATASTEEL",
    price: "172.8",
    change: "2.15",
    changePercent: "1.22",
    tok: "3499",
    exSeg: "nse_cm",
  },
  {
    symbol: "RVNL-EQ",
    name: "RVNL",
    price: "346.8",
    change: "-8.32",
    changePercent: "-2.15",
    tok: "9552",
    exSeg: "nse_cm",
  },
];

// Most bought stocks data
export const mostBoughtStocks: MostBoughtStock[] = [
  {
    symbol: "TCS",
    price: "3009.40",
    change: "+110.30",
    changePercent: "(+3.80%)",
    isPositive: true,
  },
  {
    symbol: "TATAINVEST",
    price: "9710.50",
    change: "+1044.50",
    changePercent: "(+12.05%)",
    isPositive: true,
  },
  {
    symbol: "LT",
    price: "3669.80",
    change: "-59.70",
    changePercent: "(-1.60%)",
    isPositive: false,
  },
  {
    symbol: "INFY",
    price: "1593.45",
    change: "+144.85",
    changePercent: "(+10.00%)",
    isPositive: true,
  },
];

// Investment products data
export const investmentProducts: InvestmentProduct[] = [
  {
    title: "Mutual funds",
    icon: DollarSign,
    badge: "2 LIVE NFOs",
  },
  {
    title: "IPO",
    icon: TrendingUp,
  },
  {
    title: "Stockcase",
    icon: Megaphone,
    badge: "23 Live",
  },
  {
    title: "Sipit",
    icon: Target,
  },
];

// Investing tools data
export const investingTools: InvestingTool[] = [
  {
    title: "Screeners",
    icon: Gauge,
  },
  {
    title: "Results",
    icon: BarChart3,
  },
  {
    title: "Superstar investors",
    icon: Star,
  },
  {
    title: "Trade from charts",
    icon: BarChart3,
    badge: "NEW",
  },
];

// Research items data
export const researchItems: ResearchItem[] = [
  {
    title: "Investment ideas",
    icon: BookOpen,
  },
];

// Market updates data
export const marketUpdates: MarketUpdate[] = [
  {
    title: "Live news",
    icon: Radio,
  },
];
