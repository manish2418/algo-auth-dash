import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Star,
  Gauge,
  Target,
  BookOpen,
  Radio,
  Megaphone,
  Wallet,
  Activity,
} from "lucide-react";
import {
  MostBoughtStock,
  InvestmentProduct,
  InvestingTool,
  ResearchItem,
  MarketUpdate,
} from "@/types/dashboard";

interface MainContentProps {
  funds?: number;
  todayPnL?: number;
  todayChange?: number;
  activePositions?: number;
}

/**
 * Main Content Component
 *
 * Contains the main dashboard content with:
 * - Portfolio overview cards (Funds, P&L, Active Positions)
 * - Main tabs (Stocks, F&O, Mutual funds)
 * - Various sections for each tab
 */
export const MainContent = ({
  funds = 0,
  todayPnL = 2650.25,
  todayChange = 2.15,
  activePositions = 3,
}: MainContentProps) => {
  // Data arrays (these would come from props or API calls in real app)
  const mostBoughtStocks: MostBoughtStock[] = [
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

  const investmentProducts: InvestmentProduct[] = [
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

  const investingTools: InvestingTool[] = [
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

  const researchItems: ResearchItem[] = [
    {
      title: "Investment ideas",
      icon: BookOpen,
    },
  ];

  const marketUpdates: MarketUpdate[] = [
    {
      title: "Live news",
      icon: Radio,
    },
  ];

  return (
    <div className="flex-1 bg-gray-900 p-6 relative">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Funds Card */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Funds
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{Number(funds).toFixed(2)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Available for trading</p>
          </CardContent>
        </Card>

        {/* Today's P&L Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Today's P&L
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ₹{todayPnL.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              +{todayChange}% from yesterday
            </p>
          </CardContent>
        </Card>

        {/* Active Positions Card */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active Positions
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activePositions}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Across {activePositions} securities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-800">
          <TabsTrigger
            value="stocks"
            className="data-[state=active]:bg-blue-600"
          >
            Stocks
          </TabsTrigger>
          <TabsTrigger value="fno" className="data-[state=active]:bg-blue-600">
            F&O
          </TabsTrigger>
          <TabsTrigger
            value="mutual-funds"
            className="data-[state=active]:bg-blue-600"
          >
            Mutual funds
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stocks" className="space-y-6">
          {/* Most bought on Kotak */}
          <MostBoughtSection stocks={mostBoughtStocks} />

          {/* Investment products */}
          <InvestmentProductsSection products={investmentProducts} />

          {/* Investing tools */}
          <InvestingToolsSection tools={investingTools} />

          {/* Research */}
          {/* <ResearchSection items={researchItems} /> */}

          {/* Market updates */}
          {/* <MarketUpdatesSection updates={marketUpdates} /> */}
        </TabsContent>

        <TabsContent value="fno">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">F&O Trading</h3>
            <p className="text-gray-400">
              Futures & Options content coming soon
            </p>
          </div>
        </TabsContent>

        <TabsContent value="mutual-funds">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Mutual Funds</h3>
            <p className="text-gray-400">Mutual funds content coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Individual section components
const MostBoughtSection = ({ stocks }: { stocks: MostBoughtStock[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">
      Most bought on Kotak
    </h3>
    <div className="grid grid-cols-4 gap-4">
      {stocks.map((stock, index) => (
        <Card
          key={index}
          className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {stock.symbol.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-white">{stock.symbol}</span>
            </div>
            <div className="text-lg font-bold text-white">{stock.price}</div>
            <div
              className={`text-sm flex items-center gap-1 ${
                stock.isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {stock.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{stock.change}</span>
              <span>{stock.changePercent}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const InvestmentProductsSection = ({
  products,
}: {
  products: InvestmentProduct[];
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">
      Investment products
    </h3>
    <div className="grid grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Card
          key={index}
          className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <product.icon className="h-6 w-6 text-blue-400" />
              <span className="font-medium text-white">{product.title}</span>
              {product.badge && (
                <Badge className="bg-red-600 text-white text-xs">
                  {product.badge}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const InvestingToolsSection = ({ tools }: { tools: InvestingTool[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">Investing tools</h3>
    <div className="grid grid-cols-4 gap-4">
      {tools.map((tool, index) => (
        <Card
          key={index}
          className="bg-gray-800 border-gray-700 relative hover:bg-gray-750 transition-colors"
        >
          {tool.badge && (
            <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
              {tool.badge}
            </Badge>
          )}
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <tool.icon className="h-6 w-6 text-blue-400" />
              <span className="font-medium text-white">{tool.title}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ResearchSection = ({ items }: { items: ResearchItem[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">Research</h3>
    <div className="grid grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Card
          key={index}
          className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <item.icon className="h-6 w-6 text-blue-400" />
              <span className="font-medium text-white">{item.title}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const MarketUpdatesSection = ({ updates }: { updates: MarketUpdate[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white">Market updates</h3>
    <div className="grid grid-cols-4 gap-4">
      {updates.map((update, index) => (
        <Card
          key={index}
          className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <update.icon className="h-6 w-6 text-blue-400" />
              <span className="font-medium text-white">{update.title}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
