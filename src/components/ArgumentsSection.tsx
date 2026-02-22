
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ModernDebateThread } from './ModernDebateThread';
import { useTranslation } from '@/utils/i18n';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

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

interface ArgumentsSectionProps {
  type: 'pro' | 'contra' | 'neutral';
  arguments: Argument[];
  debateId: string;
}

export const ArgumentsSection = ({ type, arguments: args, debateId }: ArgumentsSectionProps) => {
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);

  if (args.length === 0) return null;

  const getSectionConfig = () => {
    switch (type) {
      case 'pro':
        return {
          icon: <ThumbsUp className="h-5 w-5" />,
          title: text('Pro arguments', 'Pro-Argumente'),
          titleColor: 'text-emerald-700 dark:text-emerald-400',
          sectionClass: 'pro-section'
        };
      case 'contra':
        return {
          icon: <ThumbsDown className="h-5 w-5" />,
          title: text('Contra arguments', 'Contra-Argumente'),
          titleColor: 'text-red-700 dark:text-red-400',
          sectionClass: 'contra-section'
        };
      default:
        return {
          icon: <MessageSquare className="h-5 w-5" />,
          title: text('Neutral arguments', 'Neutrale Argumente'),
          titleColor: 'text-blue-700 dark:text-blue-400',
          sectionClass: 'neutral-section'
        };
    }
  };

  const config = getSectionConfig();

  return (
    <section className={config.sectionClass}>
      <div className="section-header">
        <div className="section-icon">
          {config.icon}
        </div>
        <h2 className={`text-2xl font-bold ${config.titleColor}`}>
          {config.title}
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {args.length}
        </Badge>
      </div>
      <ModernDebateThread arguments={args} debateId={debateId} />
    </section>
  );
};
