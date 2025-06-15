
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebateCard } from './DebateCard';
import { DebateDiscoveryTabs } from './DebateDiscoveryTabs';
import { DebateMetrics } from './DebateMetrics';
import { DebateLoadingSkeleton } from './DebateLoadingSkeleton';
import { DebateEmptyState } from './DebateEmptyState';
import { useTrendingDebates } from '@/hooks/useTrendingDebates';
import { useTranslation } from '@/utils/i18n';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrendingDebates = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'active' | 'recent'>('trending');
  const { trendingDebates, loading } = useTrendingDebates(activeTab);
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const handleAddArgument = () => {
    navigate('/debates');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5" />
            {language === 'de' ? 'Entdecke Debatten' : 'Discover Debates'}
          </CardTitle>
          
          <DebateDiscoveryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            language={language}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <DebateLoadingSkeleton />
        ) : trendingDebates.length === 0 ? (
          <DebateEmptyState 
            language={language} 
            onAddArgument={handleAddArgument}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingDebates.map((debate) => (
              <div key={debate.id} className="space-y-2">
                <DebateCard
                  id={debate.id}
                  title={debate.titel}
                  description={debate.beschreibung}
                  createdAt={debate.erstellt_am}
                  language={language}
                />
                <DebateMetrics debate={debate} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
