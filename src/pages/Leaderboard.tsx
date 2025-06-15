
import React from 'react';
import { Leaderboard } from '@/components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Meritokratie-Rangliste
            </h1>
            <p className="text-xl text-muted-foreground">
              Die konstruktivsten Denker unserer intellektuellen Gemeinschaft
            </p>
          </div>
          
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
