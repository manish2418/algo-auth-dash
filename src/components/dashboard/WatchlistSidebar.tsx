import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Edit,
  TrendingUp,
  TrendingDown,
  BarChart,
  List,
  MoreVertical,
  Wifi,
  WifiOff,
} from "lucide-react";
import { WatchlistStock } from "@/types/dashboard";
import { useKotakNeoContext } from "@/contexts/KotakNeoContext";
import apiService from "@/lib/api";

interface WatchlistSidebarProps {
  watchlistStocks: WatchlistStock[];
  onBuyClick: (stock: WatchlistStock) => void;
}

/**
 * Watchlist Sidebar Component with Real-time Kotak Neo Integration
 *
 * Left sidebar containing:
 * - Watchlist tabs (1-5)
 * - Search functionality
 * - Stock watchlist with real-time data
 * - Connection status indicator
 */
export const WatchlistSidebar = ({
  watchlistStocks,
  onBuyClick,
  addStockHandler,
}: WatchlistSidebarProps) => {
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [watchlistStock, setWatchListStock] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const {
    isConnected,
    isConnecting,
    error,
    subscribeToSymbols,
    unsubscribeFromSymbols,
    updateWatchlistData,
    marketData,
  } = useKotakNeoContext();

  const [dataList, setDataList] = useState([]);
  const fetchStockData = async (search: string) => {
    if (!search) return;
    try {
      const res = await apiService.getStockData(search);
      if (res?.success && Array.isArray(res?.data?.data)) {
        // Filter & map clean data
        const cleanData = res.data.data.map((item) => ({
          name: item?.pSymbolName?.trim(),
          tok: String(item?.pSymbol),
          exSeg: item?.pExchSeg,
          group: item?.pGroup,
          symbol: item?.pTrdSymbol,
          key: item?.pScripRefKey,
        }));
        setDataList(cleanData.slice(0, 10)); // limit to 10 results
      } else {
        setDataList([]);
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setDataList([]);
    }
  };

  // Filter data according to search term
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(searchStock);
      if (searchStock.length >= 2) {
        fetchStockData(searchStock);
      } else {
        setDataList([]);
      }
    }, 400); // debounce: wait 400ms after typing

    return () => clearTimeout(timer);
  }, [searchStock]);

  const handleSelect = (value: string) => {
    setSearchStock(value);
  };

  useEffect(() => {
    const getWatchListStock = async () => {
      const data = await apiService.getUserWatchList(
        "user_001",
        `watchlist_00${activeTab}`
      );
      if (data.data?.stocks) setWatchListStock(data.data?.stocks);
      else setWatchListStock([]);
    };
    getWatchListStock();
  }, [activeTab]);

  // Get symbols from watchlist
  const symbols = watchlistStock
    .map((stock) => `${stock.exSeg}|${stock.tok}`)
    .join("&");
  // Subscribe to real-time data when connected
  useEffect(() => {
    if (isConnected && symbols.length > 0) {
      subscribeToSymbols([symbols]);
    }

    return () => {
      if (symbols.length > 0) {
        unsubscribeFromSymbols([symbols]);
      }
    };
  }, [
    isConnected,
    symbols,
    watchlistStock,
    subscribeToSymbols,
    unsubscribeFromSymbols,
  ]);

  const realTimeStocks = watchlistStock.map((stock) => {
    const realTimeData = marketData.get(String(stock.tok));
    if (realTimeData?.ltp > 0) {
      return {
        ...stock,
        price: realTimeData.ltp.toString(),
        change:
          realTimeData.change > 0
            ? `+${realTimeData.change.toFixed(2)}`
            : realTimeData.change.toFixed(2),
        changePercent:
          realTimeData.changePercent > 0
            ? `(+${realTimeData.changePercent.toFixed(2)}%)`
            : `(${realTimeData.changePercent.toFixed(2)}%)`,
        isPositive: realTimeData.change >= 0,
      };
    }
    return stock;
  });
  const filteredStocks = realTimeStocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
      {/* Connection Status */}
      <div className="mb-4 p-2 rounded-lg bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Live Data
                </span>
              </>
            ) : isConnecting ? (
              <>
                <div className="h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-yellow-400 text-sm font-medium">
                  Connecting...
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">
                  Offline
                </span>
              </>
            )}
          </div>
          {error && (
            <span className="text-red-400 text-xs" title={error}>
              Error
            </span>
          )}
        </div>
      </div>
      <div className="relative flex gap-2 mb-4 w-72">
        {" "}
        {/* smaller width */}
        <Input
          placeholder="Search Stock & Add"
          value={searchStock}
          onChange={(e) => handleSelect(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          className=" bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full"
        />
        {/* Dropdown */}
        {isFocused && dataList.length > 0 && (
          <ul className="absolute left-0 top-[105%] w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 max-h-56 overflow-auto">
            {dataList.map((item, i) => (
              <li
                key={i}
                onClick={() => addStockHandler(item)}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white"
              >
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-400 text-xs">
                  {item.symbol} • {item.exchange} • {item.group}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tab Numbers */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <Button
            key={num}
            variant={activeTab === num.toString() ? "default" : "ghost"}
            size="sm"
            className={`w-8 h-8 p-0 ${
              activeTab === num.toString()
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(num.toString())}
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search in Watchlist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400"
          >
            <Filter className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Watchlist */}
      <div className="space-y-2">
        {filteredStocks.map((stock, index) => (
          <WatchlistItem
            key={`${stock.tok}-${stock.price}`}
            stock={stock}
            onBuyClick={onBuyClick}
            isRealTime={isConnected}
          />
        ))}
      </div>
    </div>
  );
};

// Individual watchlist item component with real-time data
const WatchlistItem = ({
  stock,
  onBuyClick,
  isRealTime,
}: {
  stock: WatchlistStock;
  onBuyClick: (stock: WatchlistStock) => void;
  isRealTime: boolean;
}) => {
  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer relative">
      <div className="flex-1">
        <div className="font-medium text-sm flex items-center gap-2">
          {stock.name}
          {isRealTime && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-xs text-gray-400">{stock.exchange}</div>
      </div>

      {stock.price && (
        <div className="text-right">
          <div className="text-sm font-medium">{stock.price}</div>
          <div
            className={`text-xs flex items-center gap-1 ${
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
        </div>
      )}

      {/* Action buttons that appear on hover */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
        {/* Buy Button */}
        <Button
          size="sm"
          className="h-6 w-6 p-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          onClick={(e) => {
            e.stopPropagation();
            onBuyClick(stock);
          }}
        >
          B
        </Button>

        {/* Sell Button */}
        <Button
          size="sm"
          className="h-6 w-6 p-0 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Sell ${stock.symbol}`);
          }}
        >
          S
        </Button>

        {/* Chart Button */}
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Chart ${stock.symbol}`);
          }}
        >
          <BarChart className="h-3 w-3" />
        </Button>
      </div>

      {/* Additional action buttons below (visible on hover) */}
      <div className="absolute right-2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Bar chart ${stock.symbol}`);
          }}
        >
          <BarChart className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`List ${stock.symbol}`);
          }}
        >
          <List className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`More options ${stock.symbol}`);
          }}
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
