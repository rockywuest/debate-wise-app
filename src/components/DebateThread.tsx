
import React from 'react';
import { EnhancedArgumentCard } from './EnhancedArgumentCard';

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

interface DebateThreadProps {
  arguments: Argument[];
  debateId: string;
  level?: number;
}

export const DebateThread = ({ arguments: args, debateId, level = 0 }: DebateThreadProps) => {
  const getThreadStyles = (level: number) => {
    const baseClasses = "space-y-4";
    const levelClasses = {
      0: "",
      1: "ml-4 pl-4 border-l-2 border-blue-200 bg-blue-50/30",
      2: "ml-4 pl-4 border-l-2 border-purple-200 bg-purple-50/20",
      3: "ml-4 pl-4 border-l-2 border-green-200 bg-green-50/20"
    };
    
    return `${baseClasses} ${levelClasses[Math.min(level, 3) as keyof typeof levelClasses]}`;
  };

  return (
    <div className={getThreadStyles(level)}>
      {args.map((argument) => (
        <div key={argument.id}>
          <EnhancedArgumentCard
            id={argument.id}
            title={argument.argument_text.substring(0, 50) + (argument.argument_text.length > 50 ? '...' : '')}
            content={argument.argument_text}
            type={argument.argument_typ}
            author={argument.autor_name || 'Anonym'}
            authorUserId={argument.benutzer_id}
            createdAt={argument.erstellt_am}
            debateId={debateId}
          />
          
          {argument.children && argument.children.length > 0 && (
            <DebateThread 
              arguments={argument.children} 
              debateId={debateId} 
              level={level + 1} 
            />
          )}
        </div>
      ))}
    </div>
  );
};
