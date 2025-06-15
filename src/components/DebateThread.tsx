
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
    
    if (level === 0) {
      return baseClasses;
    }
    
    // Create progressive visual hierarchy with connection lines
    const levelStyles = {
      1: "ml-6 pl-4 border-l-2 border-blue-300 bg-gradient-to-r from-blue-50/40 to-transparent rounded-r-lg",
      2: "ml-6 pl-4 border-l-2 border-purple-300 bg-gradient-to-r from-purple-50/30 to-transparent rounded-r-lg", 
      3: "ml-6 pl-4 border-l-2 border-green-300 bg-gradient-to-r from-green-50/30 to-transparent rounded-r-lg",
      4: "ml-6 pl-4 border-l-2 border-amber-300 bg-gradient-to-r from-amber-50/20 to-transparent rounded-r-lg"
    };
    
    const maxLevel = Math.min(level, 4);
    return `${baseClasses} ${levelStyles[maxLevel as keyof typeof levelStyles]}`;
  };

  const getConnectionIndicator = (level: number) => {
    if (level === 0) return null;
    
    const colors = {
      1: "border-blue-300",
      2: "border-purple-300", 
      3: "border-green-300",
      4: "border-amber-300"
    };
    
    const maxLevel = Math.min(level, 4);
    
    return (
      <div className={`absolute -left-1 top-4 w-3 h-3 rounded-full border-2 ${colors[maxLevel as keyof typeof colors]} bg-white`} />
    );
  };

  return (
    <div className={getThreadStyles(level)}>
      {args.map((argument, index) => (
        <div key={argument.id} className="relative">
          {level > 0 && getConnectionIndicator(level)}
          
          <div className={level > 0 ? "relative" : ""}>
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
          </div>
          
          {argument.children && argument.children.length > 0 && (
            <div className="mt-3">
              <DebateThread 
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
