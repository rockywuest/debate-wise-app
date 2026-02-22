
import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalizedText } from '@/utils/i18n';

interface ChildArgument {
  id: string;
  title: string;
  content: string;
  type: 'pro' | 'contra' | 'neutral';
}

interface ChildArgumentsPreviewProps {
  childArguments: ChildArgument[];
  onViewAll?: () => void;
}

export const ChildArgumentsPreview = ({ childArguments, onViewAll }: ChildArgumentsPreviewProps) => {
  const text = useLocalizedText();

  if (childArguments.length === 0) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pro':
        return <ThumbsUp className="h-3 w-3 text-emerald-600" />;
      case 'contra':
        return <ThumbsDown className="h-3 w-3 text-red-600" />;
      default:
        return <MessageSquare className="h-3 w-3 text-blue-600" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'pro':
        return 'border-l-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20';
      case 'contra':
        return 'border-l-red-400 bg-red-50/50 dark:bg-red-950/20';
      default:
        return 'border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">
              {childArguments.length} {childArguments.length === 1 ? text('reply', 'Antwort') : text('replies', 'Antworten')}
            </h4>
          </div>
          {childArguments.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-xs h-auto px-2 py-1 text-muted-foreground hover:text-foreground"
            >
              {text('View all', 'Alle anzeigen')}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {childArguments.slice(0, 2).map((child) => (
            <div 
              key={child.id} 
              className={`p-3 bg-background rounded-md border-l-3 ${getTypeStyle(child.type)} transition-colors hover:bg-accent/50`}
            >
              <div className="flex items-start gap-2 mb-2">
                {getTypeIcon(child.type)}
                <h5 className="font-medium text-sm leading-tight">{child.title}</h5>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed ml-5">
                {child.content.length > 120 ? child.content.substring(0, 120) + '...' : child.content}
              </p>
            </div>
          ))}
          
          {childArguments.length > 2 && (
            <div className="text-center py-2">
              <span className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border">
                + {childArguments.length - 2} {text('more', 'weitere')} {childArguments.length - 2 === 1 ? text('reply', 'Antwort') : text('replies', 'Antworten')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
