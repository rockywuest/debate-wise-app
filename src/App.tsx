
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Navigation } from "./components/Navigation";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Debate from "./pages/Debate";
import DebateDetail from "./pages/DebateDetail";
import Auth from "./pages/Auth";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <>
                <Navigation />
                <Index />
              </>
            } />
            <Route path="/debates" element={
              <>
                <Navigation />
                <Debate />
              </>
            } />
            <Route path="/debate/:id" element={
              <>
                <Navigation />
                <DebateDetail />
              </>
            } />
            <Route path="/auth" element={
              <>
                <Navigation />
                <Auth />
              </>
            } />
            <Route path="/leaderboard" element={
              <>
                <Navigation />
                <Leaderboard />
              </>
            } />
            <Route path="*" element={
              <>
                <Navigation />
                <NotFound />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
