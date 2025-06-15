
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useArguments } from '@/hooks/useArguments';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedReputation } from '@/hooks/useEnhancedReputation';
import { Link, FileText, Plus } from 'lucide-react';

interface EnhancedArgumentFormProps {
  debateId: string;
  parentId?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  onSubmit?: () => void;
}

export const EnhancedArgumentForm = ({
  debateId,
  parentId,
  buttonText = "Argument hinzufügen",
  buttonVariant = "default",
  onSubmit
}: EnhancedArgumentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [argumentText, setArgumentText] = useState('');
  const [argumentType, setArgumentType] = useState<'These' | 'Pro' | 'Contra'>('Pro');
  const [authorName, setAuthorName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceDescription, setSourceDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createArgument } = useArguments(debateId);
  const { user } = useAuth();
  const { awardReputation } = useEnhancedReputation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentText.trim()) return;

    setIsSubmitting(true);
    try {
      // Create argument with enhanced text including source
      let enhancedText = argumentText;
      if (sourceUrl && sourceDescription) {
        enhancedText += `\n\nQuelle: ${sourceDescription} (${sourceUrl})`;
      }

      const result = await createArgument(
        enhancedText,
        argumentType,
        parentId,
        authorName || undefined
      );

      if (result && user) {
        // Award reputation with bonus for providing sources
        const baseReason = 'Argument erstellt';
        const hasSource = sourceUrl && sourceDescription;
        
        if (hasSource) {
          await awardReputation(user.id, 'source_provided', 'Quelle bereitgestellt', result.id);
        }
        await awardReputation(user.id, 'argument_created', baseReason, result.id);
      }

      // Reset form
      setArgumentText('');
      setSourceUrl('');
      setSourceDescription('');
      setAuthorName('');
      setIsOpen(false);
      onSubmit?.();
    } catch (error) {
      console.error('Error creating argument:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={buttonVariant}
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        {buttonText}
      </Button>

      {isOpen && (
        <Card className="mt-4 border-2 border-primary/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="argument-type">Typ des Arguments</Label>
                <Select value={argumentType} onValueChange={(value: 'These' | 'Pro' | 'Contra') => setArgumentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pro">Pro-Argument</SelectItem>
                    <SelectItem value="Contra">Contra-Argument</SelectItem>
                    <SelectItem value="These">Neutrale These</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="argument-text">Argument</Label>
                <Textarea
                  id="argument-text"
                  value={argumentText}
                  onChange={(e) => setArgumentText(e.target.value)}
                  placeholder="Beschreiben Sie Ihr Argument..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-medium">Quelle hinzufügen (optional)</Label>
                  <Badge variant="secondary" className="text-xs">+3 Reputation</Badge>
                </div>
                
                <div>
                  <Label htmlFor="source-url" className="text-sm">URL der Quelle</Label>
                  <Input
                    id="source-url"
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="source-description" className="text-sm">Beschreibung der Quelle</Label>
                  <Input
                    id="source-description"
                    value={sourceDescription}
                    onChange={(e) => setSourceDescription(e.target.value)}
                    placeholder="z.B. Studie der Universität XY, Artikel von..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="author-name">Ihr Name (optional)</Label>
                <Input
                  id="author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ihr Name..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting || !argumentText.trim()}>
                  {isSubmitting ? 'Wird erstellt...' : 'Argument hinzufügen'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};
