import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, X, RefreshCw, ChevronDown } from "lucide-react";
import { WatchlistStock } from "@/types/dashboard";

interface OrderOverlayProps {
  selectedStock: WatchlistStock | null;
  onClose: () => void;
}

export const OrderOverlay = ({ selectedStock, onClose }: OrderOverlayProps) => {
  const [orderType, setOrderType] = useState("Limit");
  const [productType, setProductType] = useState("Cash");
  const [quantity, setQuantity] = useState("1");
  const [buyingPrice, setBuyingPrice] = useState(selectedStock?.price || "0");

  if (!selectedStock) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="w-96 bg-gray-800 h-full p-6 overflow-y-auto">
        {/* Order Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedStock.symbol}</h3>
              <div className="flex items-center gap-4 mt-1">
                <RadioGroup value="NSE" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NSE" id="nse" />
                    <Label htmlFor="nse" className="text-sm">NSE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BSE" id="bse" />
                    <Label htmlFor="bse" className="text-sm">BSE</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Price Info */}
        <div className="mb-6">
          <div className="text-2xl font-bold">{selectedStock.price}</div>
          <div className={`text-sm flex items-center gap-1 ${
            selectedStock.isPositive ? "text-green-400" : "text-red-400"
          }`}>
            {selectedStock.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{selectedStock.change}</span>
            <span>{selectedStock.changePercent}</span>
          </div>
        </div>

        {/* Order Tabs */}
        <Tabs defaultValue="invest" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="invest" className="data-[state=active]:bg-blue-600">
              Invest
            </TabsTrigger>
            <TabsTrigger value="intraday" className="data-[state=active]:bg-blue-600">
              Intraday
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Order Form */}
        <div className="space-y-4">
          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-sm text-gray-300">Quantity</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-1"
            />
          </div>

          {/* Buying Price */}
          <div>
            <Label htmlFor="price" className="text-sm text-gray-300">Buying price</Label>
            <div className="relative mt-1">
              <Input
                id="price"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-8"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">Order Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Limit", "Market", "SL-LMT", "SL-MKT"].map((type) => (
                <Button
                  key={type}
                  variant={orderType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType(type)}
                  className={orderType === type ? "bg-blue-600" : "border-gray-600 text-gray-300"}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Type */}
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">Product Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {["Cash", "NRML", "Pay later"].map((type) => (
                <Button
                  key={type}
                  variant={productType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProductType(type)}
                  className={productType === type ? "bg-blue-600" : "border-gray-600 text-gray-300"}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <div className="text-lg font-semibold">Pay ₹{buyingPrice}</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Available:</span>
              <span>630</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Required:</span>
              <div className="flex items-center gap-1">
                <span>{buyingPrice}</span>
                <RefreshCw className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">1 share</span>
              <Button variant="link" className="text-blue-400 p-0 h-auto">
                ORDER SUMMARY
              </Button>
            </div>
          </div>

          {/* Add Funds Button */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
            Add funds
          </Button>
        </div>
      </div>
    </div>
  );
}; 