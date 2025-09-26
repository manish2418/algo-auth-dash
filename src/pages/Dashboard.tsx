import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketHeader } from "@/components/dashboard/MarketHeader";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import { MainContent } from "@/components/dashboard/MainContent";
import { OrderOverlay } from "@/components/dashboard/OrderOverlay";
import { HelpButton } from "@/components/dashboard/HelpButton";
import { marketIndices, watchlistStocks } from "@/data/dashboardData";
import { WatchlistStock } from "@/types/dashboard";
import apiService from "@/lib/api";

/**
 * Main Dashboard Component
 * 
 * This component orchestrates the entire trading dashboard interface.
 * It manages the overall layout and state for:
 * - Market header with indices
 * - Watchlist sidebar
 * - Main content area with portfolio overview
 * - Order overlay
 * - Help button
 */
const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [funds, setFunds] = useState(0);
  const [selectedStock, setSelectedStock] = useState<WatchlistStock | null>(null);
  const [todayChange] = useState(2.15);
  const [todayPnL] = useState(2650.25);
  const [activePositions] = useState(3);

  // Event handlers
  const handleLogout = () => {
    navigate("/");
  };

  const handleBuyClick = (stock: WatchlistStock) => {
    setSelectedStock(stock);
  };

  const handleCloseOrder = () => {
    setSelectedStock(null);
  };

  // Fetch user funds on component mount
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Market Header with Indices and Navigation */}
      <MarketHeader 
        marketIndices={marketIndices} 
        onLogout={handleLogout} 
      />

      {/* Main Layout Container */}
      <div className="flex h-screen">
        {/* Left Sidebar - Watchlist */}
        <WatchlistSidebar 
          watchlistStocks={watchlistStocks}
          onBuyClick={handleBuyClick}
        />

        {/* Main Content Area with Portfolio Overview */}
        <MainContent 
          funds={funds}
          todayPnL={todayPnL}
          todayChange={todayChange}
          activePositions={activePositions}
        />

        {/* Order Overlay (appears when stock is selected) */}
        <OrderOverlay 
          selectedStock={selectedStock}
          onClose={handleCloseOrder}
        />
      </div>

      {/* Help Button (fixed position) */}
      <HelpButton />
    </div>
  );
};

export default Dashboard;
