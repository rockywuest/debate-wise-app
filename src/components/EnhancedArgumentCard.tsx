
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArgumentQualityAnalysis } from './ArgumentQualityAnalysis';
import { SteelManDialog } from './SteelManDialog';
import { CreateArgumentForm } from './CreateArgumentForm';
import { ArgumentRatingButtons } from './ArgumentRatingButtons';
import { ChildArgumentsPreview } from './ChildArgumentsPreview';
import { ReputationDisplay } from './ReputationDisplay';
import { useEnhancedReputation } from '@/hooks/useEnhancedReputation';
import { useTranslation } from '@/utils/i18n';
import { MessageSquare, ThumbsUp, ThumbsDown, Award, TrendingUp } from 'lucide-react';
import type { ArgumentAnalysis } from '@/types/analysis';

interface EnhancedArgumentCardProps {
  id: string;
  title: string;
  content: string;
  type: 'pro' | 'contra' | 'neutral';
  author?: string;
  authorUserId: string;
  createdAt: string;
  debateId: string;
  childArguments?: Array<{
    id: string;
    title: string;
    content: string;
    type: 'pro' | 'contra' | 'neutral';
  }>;
  onReply?: (parentId: string) => void;
}

export const EnhancedArgumentCard = ({
  id,
  title,
  content,
  type,
  author,
  authorUserId,
  createdAt,
  debateId,
  childArguments = [],
  onReply
}: EnhancedArgumentCardProps) => {
  const { awardReputation, calculateQualityScore } = useEnhancedReputation();
  const { language } = useTranslation();
  const [qualityScore, setQualityScore] = React.useState<number>(0);
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  const getTypeIcon = () => {
    switch (type) {
      case 'pro':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'contra':
        return <ThumbsDown className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeBadgeColor = () => {
    switch (type) {
      case 'pro':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'contra':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const getQualityBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', label: text('Excellent', 'Exzellent'), icon: <Award className="h-3 w-3" /> };
    if (score >= 60) return { color: 'bg-blue-100 text-blue-800', label: text('Good', 'Gut'), icon: <TrendingUp className="h-3 w-3" /> };
    if (score >= 40) return { color: 'bg-yellow-100 text-yellow-800', label: text('Average', 'Durchschnittlich'), icon: null };
    return { color: 'bg-red-100 text-red-800', label: text('Needs improvement', 'Verbesserungsbedarf'), icon: null };
  };

  const handleQualityAnalysis = (analysis: ArgumentAnalysis) => {
    const score = calculateQualityScore(analysis);
    setQualityScore(score);

    // Award reputation based on quality
    if (score >= 70) {
      awardReputation(authorUserId, 'high_quality_argument', id);
    }

    // Apply penalty for fallacies
    if (analysis?.fehlschluss?.status !== 'Keiner' && analysis?.fehlschluss?.status !== 'None') {
      awardReputation(authorUserId, 'fallacy_penalty', id);
    }
  };

  const handleSteelManSuccess = () => {
    awardReputation(authorUserId, 'steel_manning', id);
  };

  const qualityBadge = getQualityBadge(qualityScore);

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={getTypeBadgeColor()}>
              {type === 'pro' ? 'Pro' : type === 'contra' ? 'Contra' : 'Neutral'}
            </Badge>
            {qualityScore > 0 && (
              <Badge className={`${qualityBadge.color} flex items-center gap-1`}>
                {qualityBadge.icon}
                {qualityBadge.label} ({qualityScore}%)
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {text('by', 'von')} {author} • {new Date(createdAt).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 leading-relaxed">{content}</p>
        
        {/* Multidimensional AI analysis with reputation integration */}
        <ArgumentQualityAnalysis 
          argumentText={content} 
          debateTitle={title}
          debateDescription=""
          onAnalysisComplete={handleQualityAnalysis}
        />
        
        {/* Improved child arguments preview */}
        <ChildArgumentsPreview 
          childArguments={childArguments}
          onViewAll={() => {
            // This would scroll to or expand all child arguments
            console.log('Show all child arguments for:', id);
          }}
        />

        {/* Enhanced rating system */}
        <div className="mt-4 border-t pt-4">
          <ArgumentRatingButtons argumentId={id} authorUserId={authorUserId} />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <CreateArgumentForm 
            debateId={debateId}
            parentId={id}
            buttonText={text('Reply', 'Antworten')}
            buttonVariant="outline"
          />
          
          {/* Steel-manning with reputation reward */}
          {type === 'contra' && (
            <SteelManDialog 
              originalArgument={content} 
              onSuccess={handleSteelManSuccess}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
