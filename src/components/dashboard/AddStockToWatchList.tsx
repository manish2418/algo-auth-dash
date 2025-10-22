import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiService from "@/lib/api";

interface AddStockToWatchlistProps {
  isAddToWatchlistModalOpen: boolean;
  setIsAddToWatchlistModalOpen: any;
  onClose: () => void;
  stock: any;
  onAdd: (watchlist: string) => void;
}

const AddStockToWatchlist: React.FC<AddStockToWatchlistProps> = ({
  isAddToWatchlistModalOpen,
  setIsAddToWatchlistModalOpen,
  stock,
  onAdd,
}) => {
  const [selectedWatchlist, setSelectedWatchlist] = useState("");

  if (!isAddToWatchlistModalOpen || !stock) return null;

  const handleAdd = async () => {
    if (!selectedWatchlist) return alert("Please select a watchlist");
    const data = {
      user_id: "user_001",
      watchlist_id: `watchlist_00${selectedWatchlist}`,
      stocks: [stock],
    };
    const updatingWatchlist = await apiService.addStocksToWatchlist(data);
    setIsAddToWatchlistModalOpen(false);
    setSelectedWatchlist("");
  };
  const onClose = () => {
    setIsAddToWatchlistModalOpen(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-white mb-3">
          Add Stock to Watchlist
        </h2>

        <p className="text-gray-300 text-sm mb-4">
          Do you want to add <span className="font-semibold">{stock.name}</span>{" "}
          ({stock.symbol}) to one of your watchlists?
        </p>

        {/* Watchlist Selector */}
        <select
          value={selectedWatchlist}
          onChange={(e) => setSelectedWatchlist(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 mb-4"
        >
          <option value="">Select a Watchlist</option>
          <option value="1">Watchlist 1</option>
          <option value="2">Watchlist 2</option>
          <option value="3">Watchlist 3</option>
          <option value="4">Watchlist 4</option>
          <option value="5">Watchlist 5</option>
        </select>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </Button>

          <Button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddStockToWatchlist;
