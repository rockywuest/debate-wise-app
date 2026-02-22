
import React from 'react';
import { EnhancedLeaderboard } from '@/components/EnhancedLeaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-fw-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <EnhancedLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
