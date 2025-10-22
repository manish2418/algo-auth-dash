import React, { createContext, useContext, ReactNode } from "react";
import {
  useKotakNeoHslib,
  UseKotakNeoHslibReturn,
} from "@/hooks/useKotakNeoHslib";

interface KotakNeoContextType extends UseKotakNeoHslibReturn {
  // Additional context-specific methods can be added here
}

const KotakNeoContext = createContext<KotakNeoContextType | undefined>(
  undefined
);

interface KotakNeoProviderProps {
  children: ReactNode;
}

export const KotakNeoProvider: React.FC<KotakNeoProviderProps> = ({
  children,
}) => {
  const socketData = useKotakNeoHslib();
  return (
    <KotakNeoContext.Provider value={socketData}>
      {children}
    </KotakNeoContext.Provider>
  );
};

export const useKotakNeoContext = (): KotakNeoContextType => {
  const context = useContext(KotakNeoContext);
  if (context === undefined) {
    throw new Error(
      "useKotakNeoContext must be used within a KotakNeoProvider"
    );
  }
  return context;
};

export default KotakNeoContext;
