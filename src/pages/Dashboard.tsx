import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Eye,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Wallet,
  Star,
  Bell,
} from "lucide-react";
import apiService from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [funds, setFunds] = useState(0);
  const [todayChange] = useState(2.15);
  const [todayPnL] = useState(2650.25);

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const checkFunds = await apiService.getFunds();
        setFunds(checkFunds.data.avlCash);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };

    fetchFunds();
  }, []);

  const watchlistStocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.25,
      change: 2.15,
      changePercent: 1.22,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 242.18,
      change: -5.32,
      changePercent: -2.15,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 134.85,
      change: 1.75,
      changePercent: 1.31,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 378.42,
      change: 4.28,
      changePercent: 1.14,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 721.33,
      change: 12.85,
      changePercent: 1.81,
    },
  ];

  const positions = [
    {
      symbol: "AAPL",
      shares: 100,
      avgPrice: 165.5,
      currentPrice: 178.25,
      pnl: 1275.0,
    },
    {
      symbol: "MSFT",
      shares: 50,
      avgPrice: 350.0,
      currentPrice: 378.42,
      pnl: 1421.0,
    },
    {
      symbol: "TSLA",
      shares: 25,
      avgPrice: 280.0,
      currentPrice: 242.18,
      pnl: -945.5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TradePro
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funds</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Number(funds).toFixed(2)}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                ₹{Math.abs(todayPnL).toLocaleString()} ({todayChange}%) today
              </p> */}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ₹{todayPnL.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{todayChange}% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Positions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{positions.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(positions.map((p) => p.symbol)).size} securities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Current Positions
                </CardTitle>
                <CardDescription>Your active trading positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div
                      key={position.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {position.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{position.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {position.shares} shares @ ${position.avgPrice}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${position.currentPrice}
                        </div>
                        <div
                          className={`text-sm flex items-center gap-1 ${
                            position.pnl >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {position.pnl >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          ${Math.abs(position.pnl).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Market Watchlist
                </CardTitle>
                <CardDescription>Track your favorite stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchlistStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {stock.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{stock.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stock.price}</div>
                        <div
                          className={`text-sm flex items-center gap-1 ${
                            stock.change >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change} ({stock.changePercent}%)
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Return
                      </span>
                      <Badge variant="secondary" className="text-success">
                        +18.5%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Day</span>
                      <span className="font-medium text-success">₹4,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Worst Day</span>
                      <span className="font-medium text-danger">-$1,890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-medium">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Trading Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Trades
                      </span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Avg Trade Size
                      </span>
                      <span className="font-medium">$2,150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Max Drawdown
                      </span>
                      <span className="font-medium text-danger">-8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Sharpe Ratio
                      </span>
                      <span className="font-medium">1.85</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
