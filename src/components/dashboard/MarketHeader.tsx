import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Home,
  ShoppingCart,
  PieChart,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { MarketIndex } from "@/types/dashboard";

interface MarketHeaderProps {
  marketIndices: MarketIndex[];
  onLogout: () => void;
}

/**
 * Market Header Component
 *
 * Displays market indices (NIFTY, SENSEX) and main navigation
 * at the top of the dashboard.
 */
export const MarketHeader = ({
  marketIndices,
  onLogout,
}: MarketHeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Market Indices */}
          <div className="flex items-center gap-6">
            {marketIndices.map((index) => (
              <div key={index.name} className="flex items-center gap-2">
                <span className="text-sm font-medium">{index.name}</span>
                <span className="text-lg font-bold">{index.value}</span>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm ${
                      index.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {index.change}
                  </span>
                  <span
                    className={`text-sm ${
                      index.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {index.changePercent}
                  </span>
                  {!index.isPositive && (
                    <ChevronDown className="h-3 w-3 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Invest
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Funds
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
              onClick={onLogout}
            >
              KC
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
