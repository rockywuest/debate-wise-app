
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";
import { LanguageConsistencyProvider } from "@/components/LanguageConsistencyProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { MandatoryOnboarding } from "@/components/MandatoryOnboarding";
import { PostLoginRedirect } from "@/components/PostLoginRedirect";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Debates from "./pages/Debates";
import DebateDetail from "./pages/DebateDetail";
import Leaderboard from "./pages/Leaderboard";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageConsistencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <PostLoginRedirect />
            <MandatoryOnboarding />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/debates" element={<Debates />} />
              <Route path="/debates/:id" element={<DebateDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageConsistencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
