
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SteelManDialogProps {
  originalArgument: string;
}

export const SteelManDialog = ({ originalArgument }: SteelManDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reformulation, setReformulation] = useState('');
  const [validation, setValidation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reformulation.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('validate-steelman', {
        body: { 
          originalArgument,
          userReformulation: reformulation.trim()
        }
      });

      if (error) throw error;
      setValidation(data.validation);
    } catch (error) {
      console.error('Error validating steel-man:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setReformulation('');
    setValidation(null);
    setIsOpen(false);
  };

  const isPositiveValidation = validation && (
    validation.toLowerCase().includes('ja') && 
    !validation.toLowerCase().includes('nein')
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="h-4 w-4" />
          Gegenargument fair darstellen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Steel-Manning: Faire Darstellung des Gegenarguments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Originalargument:
              </Label>
              <p className="text-sm italic text-gray-600">"{originalArgument}"</p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="reformulation">
              Um sicherzustellen, dass du die Gegenposition verstehst, formuliere das Argument, 
              das du widerlegst, bitte in der stärksten und fairsten Weise neu:
            </Label>
            <Textarea
              id="reformulation"
              value={reformulation}
              onChange={(e) => setReformulation(e.target.value)}
              placeholder="Schreibe hier deine faire und starke Interpretation des Arguments..."
              rows={4}
              className="w-full"
            />
          </div>

          {validation && (
            <Card className={`${isPositiveValidation ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {isPositiveValidation ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <Badge 
                      variant="outline" 
                      className={`mb-2 ${isPositiveValidation ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}`}
                    >
                      KI-Bewertung
                    </Badge>
                    <p className="text-sm">{validation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetDialog}>
              Schließen
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!reformulation.trim() || loading}
            >
              {loading ? 'Prüfe...' : 'Bewerten lassen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
