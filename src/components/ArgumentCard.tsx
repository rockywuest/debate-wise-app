
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SummaryDialog } from './SummaryDialog';
import { ArgumentQualityAnalysis } from './ArgumentQualityAnalysis';
import { SteelManDialog } from './SteelManDialog';
import { CreateArgumentForm } from './CreateArgumentForm';
import { ArgumentRatingButtons } from './ArgumentRatingButtons';
import { ReputationDisplay } from './ReputationDisplay';
import { formatLocalizedDate, useLocalizedText, useTranslation } from '@/utils/i18n';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ArgumentCardProps {
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

export const ArgumentCard = ({
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
}: ArgumentCardProps) => {
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

  const childArgumentTexts = childArguments.map(arg => `${arg.title}: ${arg.content}`);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={getTypeBadgeColor()}>
            {type === 'pro' ? 'Pro' : type === 'contra' ? 'Contra' : 'Neutral'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {text('by', 'von')} {author} • {formatLocalizedDate(createdAt, language)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{content}</p>
        
        {/* Enhanced AI analysis for multidimensional quality checks */}
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

        {/* Optimized Rating Buttons - now using enhanced security */}
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
          
          {/* Steel-manning button for contra arguments */}
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
