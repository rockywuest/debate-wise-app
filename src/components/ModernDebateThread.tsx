
import React from 'react';
import { ModernArgumentCard } from './ModernArgumentCard';

interface Argument {
  id: string;
  argument_text: string;
  argument_typ: 'pro' | 'contra' | 'neutral';
  autor_name?: string;
  benutzer_id: string;
  erstellt_am: string;
  eltern_id?: string;
  children?: Argument[];
}

interface ModernDebateThreadProps {
  arguments: Argument[];
  debateId: string;
  level?: number;
}

export const ModernDebateThread = ({ arguments: args, debateId, level = 0 }: ModernDebateThreadProps) => {
  const getIndentationClass = (level: number) => {
    if (level === 0) return '';
    
    const indentClasses = {
      1: 'ml-8 pl-6 border-l-2 border-neutral-200 dark:border-neutral-700',
      2: 'ml-8 pl-6 border-l-2 border-neutral-300 dark:border-neutral-600',
      3: 'ml-8 pl-6 border-l-2 border-neutral-400 dark:border-neutral-500',
    };
    
    const maxLevel = Math.min(level, 3);
    return indentClasses[maxLevel as keyof typeof indentClasses] || indentClasses[3];
  };

  return (
    <div className={`space-y-6 ${getIndentationClass(level)}`}>
      {args.map((argument) => (
        <div key={argument.id} className="relative">
          {/* Connection indicator for nested replies */}
          {level > 0 && (
            <div className="absolute -left-4 top-6 w-3 h-3 rounded-full bg-background border-2 border-neutral-300 dark:border-neutral-600" />
          )}
          
          <ModernArgumentCard
            id={argument.id}
            title={argument.argument_text.substring(0, 80) + (argument.argument_text.length > 80 ? '...' : '')}
            content={argument.argument_text}
            type={argument.argument_typ}
            author={argument.autor_name || 'Anonym'}
            authorUserId={argument.benutzer_id}
            createdAt={argument.erstellt_am}
            debateId={debateId}
            childArguments={argument.children?.map(child => ({
              id: child.id,
              title: child.argument_text.substring(0, 50) + (child.argument_text.length > 50 ? '...' : ''),
              content: child.argument_text,
              type: child.argument_typ
            }))}
            level={level}
          />
          
          {/* Render nested children */}
          {argument.children && argument.children.length > 0 && (
            <div className="mt-6">
              <ModernDebateThread 
                arguments={argument.children} 
                debateId={debateId} 
                level={level + 1} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
