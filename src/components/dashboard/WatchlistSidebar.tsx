import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Edit, TrendingUp, TrendingDown, BarChart, List, MoreVertical } from "lucide-react";
import { WatchlistStock } from "@/types/dashboard";

interface WatchlistSidebarProps {
  watchlistStocks: WatchlistStock[];
  onBuyClick: (stock: WatchlistStock) => void;
}

export const WatchlistSidebar = ({ watchlistStocks, onBuyClick }: WatchlistSidebarProps) => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
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
          placeholder="Search & add"
          className="pl-10 pr-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
            <Filter className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Watchlist */}
      <div className="space-y-2">
        {watchlistStocks.map((stock, index) => (
          <WatchlistItem
            key={index}
            stock={stock}
            onBuyClick={onBuyClick}
          />
        ))}
      </div>
    </div>
  );
};

// Individual watchlist item component
const WatchlistItem = ({ stock, onBuyClick }: { stock: WatchlistStock; onBuyClick: (stock: WatchlistStock) => void }) => {
  return (
    <div className="group flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer relative">
      <div className="flex-1">
        <div className="font-medium text-sm">{stock.symbol}</div>
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