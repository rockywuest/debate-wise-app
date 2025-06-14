
import React from 'react';
import { Leaderboard } from '@/components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Reputations-Rangliste
            </h1>
            <p className="text-xl text-muted-foreground">
              Die konstruktivsten Debattierer unserer Gemeinschaft
            </p>
          </div>
          
          <Leaderboard />
          
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Wie funktioniert das Reputations-System?</h2>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div>🌟 <strong>+5 Punkte:</strong> Wenn Ihr Argument als "einsichtig" bewertet wird</div>
              <div>🏆 <strong>+10 Punkte:</strong> Wenn die KI Ihren Steel-Manning-Versuch als fair bestätigt</div>
              <div>💎 <strong>+20 Punkte:</strong> Wenn jemand Ihnen einen Punkt in der Debatte zugesteht</div>
              <div>⚠️ <strong>-2 Punkte:</strong> Wenn die KI logische Fehlschlüsse in Ihrem Argument erkennt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
