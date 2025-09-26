import { TrendingUp, DollarSign, BarChart3, Star, Gauge, Target, BookOpen, Radio, Megaphone } from "lucide-react";
import { MarketIndex, WatchlistStock, MostBoughtStock, InvestmentProduct, InvestingTool, ResearchItem, MarketUpdate } from "@/types/dashboard";

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
    symbol: "OLAELEC",
    exchange: "NSE",
    price: null,
    change: null,
    changePercent: null,
  },
  {
    symbol: "ENTERO",
    exchange: "NSE",
    price: "876.00",
    change: "-207.20",
    changePercent: "(-19.13%)",
    isPositive: false,
  },
  {
    symbol: "COSMOFIRST",
    exchange: "NSE",
    price: "859.00",
    change: "+9.35",
    changePercent: "(+1.10%)",
    isPositive: true,
  },
  {
    symbol: "EIHAHOTELS",
    exchange: "NSE",
    price: "374.00",
    change: "-0.15",
    changePercent: "(-0.04%)",
    isPositive: false,
  },
  {
    symbol: "ZOMATO",
    exchange: "NSE",
    price: "320.00",
    change: "-1.00",
    changePercent: "(-0.31%)",
    isPositive: false,
  },
  {
    symbol: "KIRLOSBROS",
    exchange: "NSE",
    price: "1973.70",
    change: "+19.50",
    changePercent: "(+1.00%)",
    isPositive: true,
  },
  {
    symbol: "NCC",
    exchange: "NSE",
    price: "218.00",
    change: "+15.49",
    changePercent: "(+7.65%)",
    isPositive: true,
  },
  {
    symbol: "SENSEX",
    exchange: "BSE",
    price: "80119.03",
    change: "-307.43",
    changePercent: "(-0.38%)",
    isPositive: false,
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