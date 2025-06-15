
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArgumentQualityAnalysis } from './ArgumentQualityAnalysis';
import { CreateArgumentForm } from './CreateArgumentForm';
import { ArgumentRatingButtons } from './ArgumentRatingButtons';
import { ChildArgumentsPreview } from './ChildArgumentsPreview';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreHorizontal, Reply, Brain, Award } from 'lucide-react';

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

  const getTypeConfig = () => {
    switch (type) {
      case 'pro':
        return {
          icon: <ThumbsUp className="h-4 w-4" />,
          badge: 'Pro',
          className: 'pro-accent',
          borderColor: 'border-l-emerald-500'
        };
      case 'contra':
        return {
          icon: <ThumbsDown className="h-4 w-4" />,
          badge: 'Contra',
          className: 'contra-accent',
          borderColor: 'border-l-red-500'
        };
      default:
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          badge: 'Neutral',
          className: 'neutral-accent',
          borderColor: 'border-l-blue-500'
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <div className="space-y-4">
      <Card className={`argument-card border-l-4 ${typeConfig.borderColor} transition-all duration-200 hover:shadow-md`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${typeConfig.className}`}>
                {typeConfig.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-balance">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">von {author}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={typeConfig.className}>
                {typeConfig.badge}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border border-border">
                  <DropdownMenuItem onClick={() => setShowAnalysis(!showAnalysis)}>
                    <Brain className="h-4 w-4 mr-2" />
                    KI-Analyse
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReplyForm(!showReplyForm)}>
                    <Reply className="h-4 w-4 mr-2" />
                    Antworten
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="argument-content mb-6">
            <p className="text-base leading-relaxed">{content}</p>
          </div>

          {/* KI Analysis - Collapsible */}
          {showAnalysis && (
            <div className="mb-6">
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <ArgumentRatingButtons argumentId={id} authorUserId={authorUserId} />
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Reply className="h-4 w-4 mr-1" />
                Antworten
              </Button>
            </div>
          </div>

          {/* Reply Form - Collapsible */}
          {showReplyForm && (
            <div className="mt-6 pt-4 border-t border-border">
              <CreateArgumentForm 
                debateId={debateId}
                parentId={id}
                buttonText="Antwort senden"
                buttonVariant="default"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
