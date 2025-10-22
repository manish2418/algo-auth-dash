import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketHeader } from "@/components/dashboard/MarketHeader";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import { MainContent } from "@/components/dashboard/MainContent";
import { OrderOverlay } from "@/components/dashboard/OrderOverlay";
import { HelpButton } from "@/components/dashboard/HelpButton";
import {
  KotakNeoProvider,
  useKotakNeoContext,
} from "@/contexts/KotakNeoContext";
import { marketIndices, watchlistStocks } from "@/data/dashboardData";
import { WatchlistStock } from "@/types/dashboard";
import apiService from "@/lib/api";
import KotakNeoHslibTest from "@/components/KotakNeoHslibTest";
import AddStockToWatchlist from "@/components/dashboard/AddStockToWatchList";

/**
 * Main Dashboard Component with Kotak Neo Integration
 *
 * This component orchestrates the entire trading dashboard interface.
 * It manages the overall layout and state for:
 * - Market header with indices
 * - Watchlist sidebar with real-time data
 * - Main content area with portfolio overview
 * - Order overlay with live order placement
 * - Help button
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useKotakNeoContext();

  useEffect(() => {
    const restartSocket = async () => {
      if (!isConnected) {
        const config = localStorage.getItem("LoginTradeToken");
        await connect(JSON.parse(config));
      }
    };
    if (!isConnected) {
      restartSocket();
    }
  }, [isConnected]);

  // State management
  const [funds, setFunds] = useState("0");
  const [selectedStock, setSelectedStock] = useState<WatchlistStock | null>(
    null
  );
  const [todayChange] = useState(2.15);
  const [todayPnL] = useState(2650.25);
  const [activePositions] = useState(3);
  const [isAddToWatchlistModalOpen, setIsAddToWatchlistModalOpen] =
    useState(false);
  const [addStock, setAddStock] = useState({});
  const addStockHandler = (item) => {
    setAddStock(item);
    setIsAddToWatchlistModalOpen(true);
  };

  // Event handlers
  const handleLogout = () => {
    navigate("/");
  };

  const handleBuyClick = (stock) => {
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
        const funds = String(checkFunds.data.avlCash - checkFunds.data.mrgnUsd);
        setFunds(funds);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };

    fetchFunds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Market Header with Indices and Navigation */}
      <MarketHeader marketIndices={marketIndices} onLogout={handleLogout} />
      {/* Main Layout Container */}
      {/* <KotakNeoHslibTest /> */}
      <div className="flex h-screen">
        {/* Left Sidebar - Watchlist with Real-time Data */}
        <WatchlistSidebar
          watchlistStocks={watchlistStocks}
          onBuyClick={handleBuyClick}
          addStockHandler={addStockHandler}
        />

        {/* Main Content Area with Portfolio Overview */}
        <MainContent
          funds={funds}
          todayPnL={todayPnL}
          todayChange={todayChange}
          activePositions={activePositions}
        />

        {/* Order Overlay with Live Order Placement */}
        <OrderOverlay
          selectedStock={selectedStock}
          onClose={handleCloseOrder}
        />
      </div>
      <AddStockToWatchlist
        isAddToWatchlistModalOpen={isAddToWatchlistModalOpen}
        setIsAddToWatchlistModalOpen={setIsAddToWatchlistModalOpen}
        stock={addStock}
      />
      {/* Help Button (fixed position) */}
      <HelpButton />
    </div>
  );
};

export default Dashboard;
