import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  X,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { WatchlistStock } from "@/types/dashboard";
import { useKotakNeoContext } from "@/contexts/KotakNeoContext";
import apiService from "@/lib/api";
import { OrderPayload } from "@/lib/api";
interface OrderOverlayProps {
  selectedStock: WatchlistStock | null;
  onClose: () => void;
}

/**
 * Order Overlay Component with Kotak Neo Integration
 *
 * Right-side overlay that appears when a stock is selected for buying.
 * Contains order form with quantity, price, order type, and product type.
 * Integrates with Kotak Neo socket for real-time order placement.
 */
export const OrderOverlay = ({ selectedStock, onClose }: OrderOverlayProps) => {
  const [orderType, setOrderType] = useState("Limit");
  const [productType, setProductType] = useState("Cash");
  const [quantity, setQuantity] = useState("1");
  const [buyingPrice, setBuyingPrice] = useState(selectedStock?.price || "0");
  const [exchange, setExchange] = useState("NSE");
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "placing" | "success" | "error"
  >("idle");
  const [orderMessage, setOrderMessage] = useState("");
  const [funds, setFunds] = useState("0");
  const { isConnected, orders, marketData } = useKotakNeoContext();
  const [isBuying, setIsBuying] = useState(true);
  const [scalpAmount, setScalpAmount] = useState(0);
  //Checking Funds
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

  // Update buying price when selected stock changes
  useEffect(() => {
    if (selectedStock?.price) {
      setBuyingPrice(selectedStock.price);
    }
  }, [selectedStock]);
  const currentStock = marketData.get(selectedStock?.tok) || selectedStock;
  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!selectedStock || !isConnected) {
      setOrderStatus("error");
      setOrderMessage("Not connected to Kotak Neo or no stock selected");
      return;
    }

    setOrderStatus("placing");
    setOrderMessage("Placing order...");
    console.log(currentStock, "CURRENT STOCK");
    try {
      let backendOrderPayload: OrderPayload = {
        am: "NO", // default for now
        dq: "0",
        es: exchange === "NSE" ? "nse_cm" : "bse_cm",
        mp: "0",
        pc: productType == "Cash" ? "CNC" : productType,
        pf: "N",
        pr: orderType == "Limit" ? buyingPrice : "0",
        pt: orderType == "Limit" ? "L" : "MKT",
        qt: quantity.toString(),
        rt: "DAY",
        tp: "0",
        ts: currentStock.name,
        tt: isBuying ? "B" : "S",
      };
      const placedOrder = await apiService.placeOrder(backendOrderPayload);
      console.log(placedOrder, "PLACED ORDER");
      // Simulate order placement success (in real implementation, this would come from socket)
      setTimeout(() => {
        setOrderStatus("success");
        setOrderMessage("Order placed successfully!");
      }, 1000);
      if (scalpAmount > 0 && isBuying) {
        backendOrderPayload.pr = String(
          parseFloat(currentStock?.ltp) + parseFloat(scalpAmount)
        );
        backendOrderPayload.tt = "S";
      }
      console.log(backendOrderPayload, "SELLING PAYLOAD");
      const placeOrder = await apiService.placeOrder(backendOrderPayload);
      console.log(placedOrder, "PLACED ORDER");
      // Simulate order placement success (in real implementation, this would come from socket)
      setTimeout(() => {
        setOrderStatus("success");
        setOrderMessage("Order placed successfully!");
      }, 1000);
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage("Failed to place order");
      console.error("Order placement error:", error);
    }
  };

  // Reset order status after delay
  useEffect(() => {
    if (orderStatus === "success" || orderStatus === "error") {
      const timer = setTimeout(() => {
        setOrderStatus("idle");
        setOrderMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

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
              <h3 className="text-lg font-semibold">{selectedStock?.symbol}</h3>
              <div className="flex items-center gap-4 mt-1">
                <RadioGroup
                  value={exchange}
                  onValueChange={setExchange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NSE" id="nse" />
                    <Label htmlFor="nse" className="text-sm">
                      NSE
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BSE" id="bse" />
                    <Label htmlFor="bse" className="text-sm">
                      BSE
                    </Label>
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
          <div className="text-2xl font-bold">
            {currentStock?.ltp || currentStock?.price}
          </div>
          <div
            className={`text-sm flex items-center gap-1 ${
              selectedStock?.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {selectedStock?.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{currentStock?.change}</span>
            <span>{currentStock?.changePercent}%</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-4 p-2 rounded-lg bg-gray-700">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">
                  Connected to Kotak Neo
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm">Not connected</span>
              </>
            )}
          </div>
        </div>

        {/* Order Tabs */}
        <Tabs
          defaultValue="buy"
          onValueChange={(value) => setIsBuying(value === "buy")}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-green-600"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-red-600"
            >
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Order Form */}
        <div className="space-y-4">
          {/* Quantity */}
          <div>
            <Label htmlFor="quantity" className="text-sm text-gray-300">
              Quantity
            </Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white mt-1"
              type="number"
              min="1"
            />
          </div>

          {/* Buying Price */}
          <div>
            <Label htmlFor="price" className="text-sm text-gray-300">
              Buying price
            </Label>
            <div className="relative mt-1">
              <Input
                id="price"
                value={buyingPrice}
                onChange={(e) => setBuyingPrice(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-8"
                type="number"
                step="0.01"
                disabled={orderType == "Market"}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400"
                onClick={() => setBuyingPrice(selectedStock.price || "0")}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="price" className="text-sm text-gray-300">
              Scalp price
            </Label>
            <div className="relative mt-1">
              <Input
                id="price"
                value={scalpAmount}
                onChange={(e) => setScalpAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-8"
                type="number"
                step="0.01"
                // disabled={orderType == "Market"}
              />
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">
              Order Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {["Limit", "Market", "SL-LMT", "SL-MKT"].map((type) => (
                <Button
                  key={type}
                  variant={orderType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType(type)}
                  className={
                    orderType === type
                      ? "bg-blue-600"
                      : "border-gray-600 text-gray-300"
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Type */}
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">
              Product Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {["Cash", "NRML", "MIS"].map((type) => (
                <Button
                  key={type}
                  variant={productType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProductType(type)}
                  className={
                    productType === type
                      ? "bg-blue-600"
                      : "border-gray-600 text-gray-300"
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <div className="text-lg font-semibold">
              Pay ₹{(parseFloat(buyingPrice) * parseInt(quantity)).toFixed(2)}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Available:</span>
              <span>{parseFloat(funds).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Required:</span>
              <div className="flex items-center gap-1">
                <span>
                  {(parseFloat(buyingPrice) * parseInt(quantity)).toFixed(2)}
                </span>
                <RefreshCw className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">
                {quantity} share{parseInt(quantity) > 1 ? "s" : ""}
              </span>
              <Button variant="link" className="text-blue-400 p-0 h-auto">
                ORDER SUMMARY
              </Button>
            </div>
          </div>

          {/* Order Status */}
          {orderStatus !== "idle" && (
            <div
              className={`p-3 rounded-lg ${
                orderStatus === "success"
                  ? "bg-green-900 text-green-300"
                  : orderStatus === "error"
                  ? "bg-red-900 text-red-300"
                  : "bg-yellow-900 text-yellow-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {orderStatus === "success" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {orderStatus === "error" && <AlertCircle className="h-4 w-4" />}
                {orderStatus === "placing" && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                <span className="text-sm">{orderMessage}</span>
              </div>
            </div>
          )}

          {/* Place Order Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            onClick={handlePlaceOrder}
            disabled={!isConnected || orderStatus === "placing"}
          >
            {orderStatus === "placing" ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};
