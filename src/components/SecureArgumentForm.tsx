
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureArguments } from '@/hooks/useSecureArguments';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedReputation } from '@/hooks/useEnhancedReputation';
import { InputValidator } from '@/utils/inputValidation';
import { Plus, Shield, AlertTriangle } from 'lucide-react';

interface SecureArgumentFormProps {
  debateId: string;
  parentId?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  onSubmit?: () => void;
}

export const SecureArgumentForm = ({
  debateId,
  parentId,
  buttonText = "Argument hinzufügen",
  buttonVariant = "default",
  onSubmit
}: SecureArgumentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [argumentText, setArgumentText] = useState('');
  const [argumentType, setArgumentType] = useState<'These' | 'Pro' | 'Contra'>('Pro');
  const [authorName, setAuthorName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceDescription, setSourceDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { createArgument, creating } = useSecureArguments(debateId);
  const { user } = useAuth();
  const { awardReputation } = useEnhancedReputation();

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate argument text
    const argumentValidation = InputValidator.validateAndSanitizeArgument(argumentText);
    if (!argumentValidation.isValid) {
      errors.push(...argumentValidation.errors);
    }

    // Validate author name if provided
    if (authorName.trim()) {
      const authorValidation = InputValidator.validateUsername(authorName);
      if (!authorValidation.isValid) {
        errors.push(...authorValidation.errors);
      }
    }

    // Validate source URL if provided
    if (sourceUrl.trim()) {
      const urlValidation = InputValidator.validateSourceUrl(sourceUrl);
      if (!urlValidation.isValid) {
        errors.push(...urlValidation.errors);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleTextChange = (value: string) => {
    setArgumentText(value);
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Sanitize inputs
      const argumentValidation = InputValidator.validateAndSanitizeArgument(argumentText);
      const authorValidation = authorName.trim() ? InputValidator.validateUsername(authorName) : { isValid: true, sanitizedValue: '' };
      
      let enhancedText = argumentValidation.sanitizedValue!;
      if (sourceUrl && sourceDescription) {
        const urlValidation = InputValidator.validateSourceUrl(sourceUrl);
        if (urlValidation.isValid) {
          enhancedText += `\n\nQuelle: ${sourceDescription} (${urlValidation.sanitizedValue})`;
        }
      }

      const result = await createArgument(
        enhancedText,
        argumentType,
        parentId,
        authorValidation.sanitizedValue || undefined
      );

      if (result && user) {
        // Award reputation with bonus for providing sources
        const hasSource = sourceUrl && sourceDescription;
        
        if (hasSource) {
          await awardReputation(user.id, 'source_provided', 'Quelle bereitgestellt', result.id);
        }
        await awardReputation(user.id, 'argument_created', 'Argument erstellt', result.id);
      }

      // Reset form
      setArgumentText('');
      setSourceUrl('');
      setSourceDescription('');
      setAuthorName('');
      setValidationErrors([]);
      setIsOpen(false);
      onSubmit?.();
    } catch (error) {
      console.error('Error creating argument:', error);
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
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Sichere Argumenterstellung</span>
              <Badge variant="secondary" className="text-xs">Validiert & Sanitisiert</Badge>
            </div>

            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Validierungsfehler:</span>
                </div>
                <ul className="text-sm text-red-700 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

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
                <Label htmlFor="argument-text">
                  Argument
                  <span className="text-xs text-muted-foreground ml-2">
                    ({argumentText.length}/2000 Zeichen)
                  </span>
                </Label>
                <Textarea
                  id="argument-text"
                  value={argumentText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Beschreiben Sie Ihr Argument ausführlich..."
                  className="min-h-[100px]"
                  maxLength={2000}
                  required
                />
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                  <Label className="text-sm font-medium">Quelle hinzufügen (+3 Reputation)</Label>
                </div>
                
                <div>
                  <Label htmlFor="source-url" className="text-sm">URL der Quelle</Label>
                  <Input
                    id="source-url"
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    maxLength={500}
                  />
                </div>

                <div>
                  <Label htmlFor="source-description" className="text-sm">Beschreibung der Quelle</Label>
                  <Input
                    id="source-description"
                    value={sourceDescription}
                    onChange={(e) => setSourceDescription(e.target.value)}
                    placeholder="z.B. Studie der Universität XY, Artikel von..."
                    maxLength={200}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="author-name">
                  Ihr Name (optional)
                  <span className="text-xs text-muted-foreground ml-2">
                    (max. 50 Zeichen)
                  </span>
                </Label>
                <Input
                  id="author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ihr Name..."
                  maxLength={50}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={creating || !argumentText.trim() || validationErrors.length > 0}
                >
                  {creating ? 'Wird erstellt...' : 'Argument hinzufügen'}
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
