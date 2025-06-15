
import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  if (childArguments.length === 0) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pro':
        return <ThumbsUp className="h-3 w-3 text-green-600" />;
      case 'contra':
        return <ThumbsDown className="h-3 w-3 text-red-600" />;
      default:
        return <MessageSquare className="h-3 w-3 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pro':
        return 'border-l-green-400 bg-green-50/50';
      case 'contra':
        return 'border-l-red-400 bg-red-50/50';
      default:
        return 'border-l-blue-400 bg-blue-50/50';
    }
  };

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Antworten ({childArguments.length})
        </h4>
        {childArguments.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-xs h-6 px-2"
          >
            Alle anzeigen
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {childArguments.slice(0, 2).map((child) => (
          <div 
            key={child.id} 
            className={`text-sm p-3 bg-background rounded border-l-4 ${getTypeColor(child.type)} hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start gap-2 mb-1">
              {getTypeIcon(child.type)}
              <span className="font-medium text-sm leading-tight">{child.title}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed ml-5">
              {child.content.length > 120 ? child.content.substring(0, 120) + '...' : child.content}
            </p>
          </div>
        ))}
        
        {childArguments.length > 2 && (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full border">
              + {childArguments.length - 2} weitere Antworten
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
