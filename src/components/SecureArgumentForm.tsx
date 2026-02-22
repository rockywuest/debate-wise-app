
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
import { useLocalizedText } from '@/utils/i18n';
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
  buttonText,
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
  const text = useLocalizedText();
  const resolvedButtonText = buttonText ?? text('Add argument', 'Argument hinzufugen');

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
          enhancedText += `\n\n${text('Source', 'Quelle')}: ${sourceDescription} (${urlValidation.sanitizedValue})`;
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
          await awardReputation(user.id, 'source_provided', result.id);
        }
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
        {resolvedButtonText}
      </Button>

      {isOpen && (
        <Card className="mt-4 border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{text('Secure argument creation', 'Sichere Argumenterstellung')}</span>
              <Badge variant="secondary" className="text-xs">{text('Validated & sanitized', 'Validiert & sanitisiert')}</Badge>
            </div>

            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">{text('Validation errors:', 'Validierungsfehler:')}</span>
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
                <Label htmlFor="argument-type">{text('Argument type', 'Typ des Arguments')}</Label>
                <Select value={argumentType} onValueChange={(value: 'These' | 'Pro' | 'Contra') => setArgumentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pro">{text('Pro argument', 'Pro-Argument')}</SelectItem>
                    <SelectItem value="Contra">{text('Contra argument', 'Contra-Argument')}</SelectItem>
                    <SelectItem value="These">{text('Neutral thesis', 'Neutrale These')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="argument-text">
                  {text('Argument', 'Argument')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({argumentText.length}/2000 {text('characters', 'Zeichen')})
                  </span>
                </Label>
                <Textarea
                  id="argument-text"
                  value={argumentText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={text('Describe your argument in detail...', 'Beschreiben Sie Ihr Argument ausfuhrlich...')}
                  className="min-h-[100px]"
                  maxLength={2000}
                  required
                />
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{text('Optional', 'Optional')}</Badge>
                  <Label className="text-sm font-medium">{text('Add source (+10 reputation)', 'Quelle hinzufugen (+10 Reputation)')}</Label>
                </div>
                
                <div>
                  <Label htmlFor="source-url" className="text-sm">{text('Source URL', 'URL der Quelle')}</Label>
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
                  <Label htmlFor="source-description" className="text-sm">{text('Source description', 'Beschreibung der Quelle')}</Label>
                  <Input
                    id="source-description"
                    value={sourceDescription}
                    onChange={(e) => setSourceDescription(e.target.value)}
                    placeholder={text('e.g. university study, published article...', 'z.B. Studie der Universitat XY, Artikel von...')}
                    maxLength={200}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="author-name">
                  {text('Your name (optional)', 'Ihr Name (optional)')}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({text('max. 50 characters', 'max. 50 Zeichen')})
                  </span>
                </Label>
                <Input
                  id="author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={text('Your name...', 'Ihr Name...')}
                  maxLength={50}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={creating || !argumentText.trim() || validationErrors.length > 0}
                >
                  {creating ? text('Creating...', 'Wird erstellt...') : text('Add argument', 'Argument hinzufugen')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  {text('Cancel', 'Abbrechen')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};
