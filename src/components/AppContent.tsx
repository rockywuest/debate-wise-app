
import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Navigation } from "./Navigation";
import Landing from "../pages/Landing";
import Index from "../pages/Index";
import Debate from "../pages/Debate";
import DebateDetail from "../pages/DebateDetail";
import Auth from "../pages/Auth";
import Leaderboard from "../pages/Leaderboard";
import Imprint from "../pages/Imprint";
import Privacy from "../pages/Privacy";
import NotFound from "../pages/NotFound";
import Analytics from "../pages/Analytics";
import { useAnalytics } from "../hooks/useAnalytics";

export const AppContent = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track initial page load
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/imprint" element={<Imprint />} />
      <Route path="/privacy" element={<Privacy />} />
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
      <Route path="/analytics" element={
        <>
          <Navigation />
          <Analytics />
        </>
      } />
      <Route path="*" element={
        <>
          <Navigation />
          <NotFound />
        </>
      } />
    </Routes>
  );
};
