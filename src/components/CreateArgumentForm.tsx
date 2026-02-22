
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useArguments } from '@/hooks/useArguments';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

interface CreateArgumentFormProps {
  debateId: string;
  parentId?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost";
}

export const CreateArgumentForm = ({ 
  debateId, 
  parentId, 
  buttonText,
  buttonVariant = "default"
}: CreateArgumentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [argumentText, setArgumentText] = useState('');
  const [argumentTyp, setArgumentTyp] = useState<'These' | 'Pro' | 'Contra'>('Pro');
  const [autorName, setAutorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createArgument } = useArguments(debateId);
  const { toast } = useToast();
  const { language } = useTranslation();
  const text = (en: string, de: string) => (language === 'de' ? de : en);
  const resolvedButtonText = buttonText ?? text('Add argument', 'Neues Argument hinzufugen');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!argumentText.trim()) {
      toast({
        title: text('Error', 'Fehler'),
        description: text('Please enter argument text.', 'Bitte geben Sie einen Argumenttext ein.'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createArgument(
        argumentText.trim(),
        argumentTyp,
        parentId,
        autorName.trim() || undefined
      );
      if (result) {
        setArgumentText('');
        setArgumentTyp('Pro');
        setAutorName('');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error creating argument:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="gap-2">
          <Plus className="h-4 w-4" />
          {resolvedButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {parentId ? text('Add reply', 'Antwort hinzufugen') : text('Create new argument', 'Neues Argument erstellen')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="argumentTyp">{text('Argument type', 'Argumenttyp')}</Label>
            <Select value={argumentTyp} onValueChange={(value: 'These' | 'Pro' | 'Contra') => setArgumentTyp(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="These">{text('Thesis', 'These')}</SelectItem>
                <SelectItem value="Pro">{text('Pro', 'Pro')}</SelectItem>
                <SelectItem value="Contra">{text('Contra', 'Contra')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="argumentText">{text('Argument *', 'Argument *')}</Label>
            <Textarea
              id="argumentText"
              value={argumentText}
              onChange={(e) => setArgumentText(e.target.value)}
              placeholder={text('Enter your argument...', 'Geben Sie Ihr Argument ein...')}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autorName">{text('Author (optional)', 'Autor (optional)')}</Label>
            <Input
              id="autorName"
              value={autorName}
              onChange={(e) => setAutorName(e.target.value)}
              placeholder={text('Your name...', 'Ihr Name...')}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              {text('Cancel', 'Abbrechen')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? text('Creating...', 'Erstelle...') : text('Add argument', 'Argument hinzufugen')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
