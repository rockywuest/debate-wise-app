
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown,
  Activity
} from 'lucide-react';

interface DebateCardProps {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  language?: 'de' | 'en';
}

interface DebateMetadata {
  argumentCount: number;
  participantCount: number;
  lastActivity: string;
  proCount: number;
  contraCount: number;
  isActive: boolean;
}

export const DebateCard = ({ 
  id, 
  title, 
  description, 
  createdAt, 
  language = 'de' 
}: DebateCardProps) => {
  const [metadata, setMetadata] = useState<DebateMetadata>({
    argumentCount: 0,
    participantCount: 0,
    lastActivity: createdAt,
    proCount: 0,
    contraCount: 0,
    isActive: false
  });
  const [loading, setLoading] = useState(true);

  const translations = {
    de: {
      participate: 'Teilnehmen',
      arguments: 'Argumente',
      participants: 'Teilnehmer',
      lastActive: 'Zuletzt aktiv',
      active: 'Aktiv',
      inactive: 'Ruhend',
      pro: 'Pro',
      contra: 'Contra'
    },
    en: {
      participate: 'Participate',
      arguments: 'Arguments',
      participants: 'Participants',
      lastActive: 'Last active',
      active: 'Active',
      inactive: 'Inactive',
      pro: 'Pro',
      contra: 'Contra'
    }
  };

  const t = translations[language];

  const fetchDebateMetadata = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get argument statistics
      const { data: argumentsData, error: argError } = await supabase
        .from('argumente')
        .select('benutzer_id, argument_typ, erstellt_am')
        .eq('debatten_id', id);

      if (argError) throw argError;

      const argumentCount = argumentsData?.length || 0;
      const participantCount = new Set(argumentsData?.map(arg => arg.benutzer_id)).size;
      const lastActivity = argumentsData?.length > 0 
        ? Math.max(...argumentsData.map(arg => new Date(arg.erstellt_am).getTime()))
        : new Date(createdAt).getTime();
      
      const proCount = argumentsData?.filter(arg => arg.argument_typ === 'Pro').length || 0;
      const contraCount = argumentsData?.filter(arg => arg.argument_typ === 'Contra').length || 0;
      
      // Consider active if there was activity in the last 7 days
      const isActive = Date.now() - lastActivity < 7 * 24 * 60 * 60 * 1000;

      setMetadata({
        argumentCount,
        participantCount,
        lastActivity: new Date(lastActivity).toISOString(),
        proCount,
        contraCount,
        isActive
      });
    } catch (error) {
      console.error('Error fetching debate metadata:', error);
    } finally {
      setLoading(false);
    }
  }, [createdAt, id]);

  useEffect(() => {
    fetchDebateMetadata();
  }, [fetchDebateMetadata]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === 'de' ? 'Vor wenigen Minuten' : 'A few minutes ago';
    if (diffInHours < 24) return language === 'de' ? `Vor ${diffInHours}h` : `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return language === 'de' ? `Vor ${diffInDays}d` : `${diffInDays}d ago`;
    
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500/20 hover:border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <Badge 
                variant={metadata.isActive ? "default" : "secondary"}
                className={`text-xs ${metadata.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
              >
                <Activity className="h-3 w-3 mr-1" />
                {metadata.isActive ? t.active : t.inactive}
              </Badge>
            </div>
            {description && (
              <CardDescription className="text-base line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{metadata.argumentCount} {t.arguments}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{metadata.participantCount} {t.participants}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <span className="text-green-700">{metadata.proCount} {t.pro}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                <span className="text-red-700">{metadata.contraCount} {t.contra}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{t.lastActive}: {formatRelativeTime(metadata.lastActivity)}</span>
          </div>
          
          <Link to={`/debates/${id}`}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              {t.participate}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
