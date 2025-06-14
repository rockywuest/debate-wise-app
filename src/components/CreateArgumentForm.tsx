
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

interface CreateArgumentFormProps {
  debateId: string;
  parentId?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost";
}

export const CreateArgumentForm = ({ 
  debateId, 
  parentId, 
  buttonText = "Neues Argument hinzufügen",
  buttonVariant = "default"
}: CreateArgumentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [argumentText, setArgumentText] = useState('');
  const [argumentTyp, setArgumentTyp] = useState<'These' | 'Pro' | 'Contra'>('Pro');
  const [autorName, setAutorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createArgument } = useArguments(debateId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!argumentText.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Argumenttext ein.",
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
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {parentId ? 'Antwort hinzufügen' : 'Neues Argument erstellen'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="argumentTyp">Argumenttyp</Label>
            <Select value={argumentTyp} onValueChange={(value: 'These' | 'Pro' | 'Contra') => setArgumentTyp(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="These">These</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Contra">Contra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="argumentText">Argument *</Label>
            <Textarea
              id="argumentText"
              value={argumentText}
              onChange={(e) => setArgumentText(e.target.value)}
              placeholder="Geben Sie Ihr Argument ein..."
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autorName">Autor (optional)</Label>
            <Input
              id="autorName"
              value={autorName}
              onChange={(e) => setAutorName(e.target.value)}
              placeholder="Ihr Name..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Erstelle...' : 'Argument hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
