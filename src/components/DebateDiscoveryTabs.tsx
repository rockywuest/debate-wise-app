
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Clock } from 'lucide-react';

interface DebateDiscoveryTabsProps {
  activeTab: 'trending' | 'active' | 'recent';
  onTabChange: (tab: 'trending' | 'active' | 'recent') => void;
  language: 'de' | 'en';
}

export const DebateDiscoveryTabs = ({ activeTab, onTabChange, language }: DebateDiscoveryTabsProps) => {
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'trending':
        return <Flame className="h-4 w-4" />;
      case 'active':
        return <TrendingUp className="h-4 w-4" />;
      case 'recent':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'trending':
        return language === 'de' ? 'Trending' : 'Trending';
      case 'active':
        return language === 'de' ? 'Aktiv' : 'Active';
      case 'recent':
        return language === 'de' ? 'Neueste' : 'Recent';
      default:
        return '';
    }
  };

  return (
    <div className="flex gap-1">
      {(['trending', 'active', 'recent'] as const).map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange(tab)}
          className="gap-1"
        >
          {getTabIcon(tab)}
          {getTabTitle(tab)}
        </Button>
      ))}
    </div>
  );
};
