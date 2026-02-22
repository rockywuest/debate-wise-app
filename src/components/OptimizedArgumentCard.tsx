
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SummaryDialog } from './SummaryDialog';
import { ArgumentQualityAnalysis } from './ArgumentQualityAnalysis';
import { SteelManDialog } from './SteelManDialog';
import { CreateArgumentForm } from './CreateArgumentForm';
import { useOptimizedReputation } from '@/hooks/useOptimizedReputation';
import { ReputationDisplay } from './ReputationDisplay';
import { formatLocalizedDate, useLocalizedText, useTranslation } from '@/utils/i18n';
import { MessageSquare, ThumbsUp, ThumbsDown, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimizedArgumentCardProps {
  id: string;
  title: string;
  content: string;
  type: 'pro' | 'contra' | 'neutral';
  author?: string;
  authorUserId: string;
  createdAt: string;
  debateId: string;
  authorReputation?: number;
  childArguments?: Array<{
    id: string;
    title: string;
    content: string;
    type: 'pro' | 'contra' | 'neutral';
  }>;
}

export const OptimizedArgumentCard = ({
  id,
  title,
  content,
  type,
  author,
  authorUserId,
  createdAt,
  debateId,
  authorReputation = 0,
  childArguments = []
}: OptimizedArgumentCardProps) => {
  const { rateArgument, loading: ratingLoading } = useOptimizedReputation();
  const { language } = useTranslation();
  const text = useLocalizedText();

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

  const handleRating = async (ratingType: 'insightful' | 'concede_point') => {
    await rateArgument(id, ratingType);
  };

  const childArgumentTexts = childArguments.map(arg => `${arg.title}: ${arg.content}`);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeBadgeColor()}>
              {type === 'pro' ? 'Pro' : type === 'contra' ? 'Contra' : 'Neutral'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {text('by', 'von')} {author} • {formatLocalizedDate(createdAt, language)}
            </p>
            <ReputationDisplay score={authorReputation} size="sm" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{content}</p>
        
        {/* Optimized KI-Analyse */}
        <ArgumentQualityAnalysis 
          argumentText={content} 
          debateTitle={title}
          debateDescription=""
        />
        
        {childArguments.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">
              {text('Replies', 'Antworten')} ({childArguments.length})
            </h4>
            <div className="space-y-2">
              {childArguments.slice(0, 2).map((child) => (
                <div key={child.id} className="text-sm p-2 bg-background rounded border-l-2 border-gray-300">
                  <div className="flex items-center gap-1 mb-1">
                    {child.type === 'pro' ? (
                      <ThumbsUp className="h-3 w-3 text-green-600" />
                    ) : child.type === 'contra' ? (
                      <ThumbsDown className="h-3 w-3 text-red-600" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-blue-600" />
                    )}
                    <span className="font-medium">{child.title}</span>
                  </div>
                  <p className="text-muted-foreground">{child.content}</p>
                </div>
              ))}
              {childArguments.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  ... {text('and', 'und')} {childArguments.length - 2} {text('more replies', 'weitere Antworten')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Optimized Rating Buttons */}
        <div className="mt-4 border-t pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRating('insightful')}
              disabled={ratingLoading}
              className="flex items-center gap-1"
            >
              <Award className="h-3 w-3" />
              {text('Insightful (+5)', 'Einsichtig (+5)')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRating('concede_point')}
              disabled={ratingLoading}
              className="flex items-center gap-1"
            >
              <Target className="h-3 w-3" />
              {text('Concede point (+20)', 'Punkt zugestehen (+20)')}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <CreateArgumentForm 
            debateId={debateId}
            parentId={id}
            buttonText={text('Reply', 'Antworten')}
            buttonVariant="outline"
          />
          
          {type === 'contra' && (
            <SteelManDialog originalArgument={content} />
          )}
          
          {childArguments.length > 0 && (
            <SummaryDialog
              parentArgument={`${title}: ${content}`}
              childArguments={childArgumentTexts}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
