
import React from 'react';
import { EnhancedLeaderboard } from '@/components/EnhancedLeaderboard';
import { useTranslation } from '@/utils/i18n';

const LeaderboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <EnhancedLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
