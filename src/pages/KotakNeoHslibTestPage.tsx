import React from "react";
import KotakNeoHslibTest from "@/components/KotakNeoHslibTest";

const KotakNeoHslibTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            KotakNeo HSLib.js Test
          </h1>
          <p className="text-gray-400">
            Testing WebSocket connection using the working hslib.js from your
            demo files
          </p>
        </div>

        <KotakNeoHslibTest />
      </div>
    </div>
  );
};

export default KotakNeoHslibTestPage;
