import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import KotakNeoHslibTestPage from "./pages/KotakNeoHslibTestPage";
import NotFound from "./pages/NotFound";
import { KotakNeoProvider } from "./contexts/KotakNeoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <KotakNeoProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/otp" element={<OTPVerification />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/kotak-neo-hslib-test"
              element={<KotakNeoHslibTestPage />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </KotakNeoProvider>
  </QueryClientProvider>
);

export default App;
