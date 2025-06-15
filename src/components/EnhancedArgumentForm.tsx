
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSecureArguments } from '@/hooks/useSecureArguments';
import { Badge } from '@/components/ui/badge';
import { Target, Search, MessageSquare, CheckCircle } from 'lucide-react';

interface EnhancedArgumentFormProps {
  debateId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export const EnhancedArgumentForm = ({ debateId, parentId, onSuccess }: EnhancedArgumentFormProps) => {
  const [argumentText, setArgumentText] = useState('');
  const [argumentType, setArgumentType] = useState<'Pro' | 'Contra'>('Pro');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const { user } = useAuth();
  const { createArgument, creating } = useSecureArguments(debateId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!argumentText.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie ein Argument ein.",
        variant: "destructive"
      });
      return;
    }

    if (argumentText.length < 20) {
      toast({
        title: "Argument zu kurz",
        description: "Bitte formulieren Sie Ihr Argument ausführlicher (mindestens 20 Zeichen).",
        variant: "destructive"
      });
      return;
    }

    const result = await createArgument(argumentText, argumentType, parentId);
    
    if (result) {
      setArgumentText('');
      setShowGuidelines(false);
      onSuccess?.();
      
      toast({
        title: "Argument hinzugefügt",
        description: "Ihr Argument wird jetzt von der KI analysiert.",
      });
    }
  };

  const qualityGuidelines = [
    {
      icon: <Target className="h-4 w-4 text-blue-600" />,
      title: "Relevant",
      description: "Bleiben Sie beim Thema der Debatte"
    },
    {
      icon: <Search className="h-4 w-4 text-green-600" />,
      title: "Belegt",
      description: "Unterstützen Sie Behauptungen mit Quellen oder Beispielen"
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-orange-600" />,
      title: "Spezifisch",
      description: "Seien Sie konkret statt vage"
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
      title: "Logisch",
      description: "Vermeiden Sie Fehlschlüsse und emotionale Rhetorik"
    }
  ];

  if (!user) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">
            Melden Sie sich an, um an der Debatte teilzunehmen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Neues Argument hinzufügen</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuidelines(!showGuidelines)}
          >
            💡 Qualitäts-Tipps
          </Button>
        </CardTitle>
        {showGuidelines && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-900">
              So erstellen Sie ein starkes Argument:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {qualityGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start gap-2">
                  {guideline.icon}
                  <div>
                    <span className="font-medium text-xs">{guideline.title}:</span>
                    <p className="text-xs text-muted-foreground">{guideline.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              variant={argumentType === 'Pro' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArgumentType('Pro')}
              className="flex-1"
            >
              👍 Pro-Argument
            </Button>
            <Button
              type="button"
              variant={argumentType === 'Contra' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArgumentType('Contra')}
              className="flex-1"
            >
              👎 Contra-Argument
            </Button>
          </div>
          
          <Textarea
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value)}
            placeholder="Formulieren Sie hier Ihr Argument. Denken Sie an Relevanz, Belege, Spezifität und logische Klarheit..."
            className="min-h-[120px]"
            maxLength={2000}
          />
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {argumentText.length}/2000 Zeichen (min. 20)
            </span>
            <Button 
              type="submit" 
              disabled={creating || argumentText.length < 20}
              className="min-w-[120px]"
            >
              {creating ? 'Wird erstellt...' : 'Argument hinzufügen'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
