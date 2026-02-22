
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/navigation/Navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/utils/i18n";

const MandatoryOnboarding = lazy(() => import("@/components/MandatoryOnboarding").then((module) => ({ default: module.MandatoryOnboarding })));
const PostLoginRedirect = lazy(() => import("@/components/PostLoginRedirect").then((module) => ({ default: module.PostLoginRedirect })));

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Debates = lazy(() => import("./pages/Debates"));
const DebateDetail = lazy(() => import("./pages/DebateDetail"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteLoading = () => (
  <div className="min-h-[30vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navigation />
            <Suspense fallback={<RouteLoading />}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
