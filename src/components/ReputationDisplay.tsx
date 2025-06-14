
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

interface ReputationDisplayProps {
  score: number;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ReputationDisplay = ({ 
  score, 
  username, 
  size = 'md', 
  showIcon = true 
}: ReputationDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 100) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    if (score >= 50) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (score >= 20) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    if (score >= 0) return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };

  const getTitle = (score: number) => {
    if (score >= 100) return 'Meisterdebattierer';
    if (score >= 50) return 'Erfahrener Debattierer';
    if (score >= 20) return 'Aktiver Teilnehmer';
    if (score >= 0) return 'Debattierender';
    return 'Anfänger';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="flex items-center gap-2">
      {username && (
        <span className={`font-medium ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'}`}>
          {username}
        </span>
      )}
      <Badge 
        className={`${getScoreColor(score)} ${sizeClasses[size]} flex items-center gap-1`}
        title={getTitle(score)}
      >
        {showIcon && <Star className="h-3 w-3" />}
        {score}
      </Badge>
    </div>
  );
};
