
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArgumentQualityAnalysis } from './ArgumentQualityAnalysis';
import { CreateArgumentForm } from './CreateArgumentForm';
import { ArgumentRatingButtons } from './ArgumentRatingButtons';
import { ChildArgumentsPreview } from './ChildArgumentsPreview';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocalizedText, useTranslation } from '@/utils/i18n';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreHorizontal, Reply, Brain, User, Calendar } from 'lucide-react';

interface ModernArgumentCardProps {
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
  level?: number;
}

export const ModernArgumentCard = ({
  id,
  title,
  content,
  type,
  author,
  authorUserId,
  createdAt,
  debateId,
  childArguments = [],
  level = 0
}: ModernArgumentCardProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { language } = useTranslation();
  const text = useLocalizedText();

  const getTypeConfig = () => {
    switch (type) {
      case 'pro':
        return {
          icon: <ThumbsUp className="h-4 w-4" />,
          badge: 'Pro',
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
          borderColor: 'border-l-emerald-500',
          iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
        };
      case 'contra':
        return {
          icon: <ThumbsDown className="h-4 w-4" />,
          badge: 'Contra',
          badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
          borderColor: 'border-l-red-500',
          iconBg: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
        };
      default:
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          badge: 'Neutral',
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          borderColor: 'border-l-blue-500',
          iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="space-y-4">
      <Card className={`argument-card border-l-4 ${typeConfig.borderColor}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-2 rounded-full ${typeConfig.iconBg} flex-shrink-0`}>
              {typeConfig.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg leading-tight text-balance">{title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={typeConfig.badgeColor}>
                    {typeConfig.badge}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowAnalysis(!showAnalysis)}>
                        <Brain className="h-4 w-4 mr-2" />
                        {text('AI analysis', 'KI-Analyse')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowReplyForm(!showReplyForm)}>
                        <Reply className="h-4 w-4 mr-2" />
                        {text('Reply', 'Antworten')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(createdAt).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="argument-content mb-6">
            <p className="text-base leading-relaxed">{content}</p>
          </div>

          {/* KI Analysis */}
          {showAnalysis && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
              <ArgumentQualityAnalysis 
                argumentText={content} 
                debateTitle={title}
                debateDescription=""
              />
            </div>
          )}

          {/* Child Arguments Preview */}
          {childArguments.length > 0 && (
            <div className="mb-6">
              <ChildArgumentsPreview 
                childArguments={childArguments}
                onViewAll={() => {
                  console.log('Show all child arguments for:', id);
                }}
              />
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <ArgumentRatingButtons argumentId={id} authorUserId={authorUserId} />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="modern-button modern-button-ghost"
            >
              <Reply className="h-4 w-4" />
              {text('Reply', 'Antworten')}
            </Button>
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-6 pt-6 border-t bg-muted/30 -mx-6 px-6 pb-6 rounded-b-lg">
              <CreateArgumentForm 
                debateId={debateId}
                parentId={id}
                buttonText={text('Send reply', 'Antwort senden')}
                buttonVariant="default"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
