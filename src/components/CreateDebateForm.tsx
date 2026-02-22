
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useDebates } from '@/hooks/useDebates';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

export const CreateDebateForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [titel, setTitel] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createDebate } = useDebates();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titel.trim()) {
      toast({
        title: t('createDebate.errorTitle'),
        description: t('createDebate.errorDescription'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createDebate(titel.trim(), beschreibung.trim() || undefined);
      if (result) {
        setTitel('');
        setBeschreibung('');
        setIsOpen(false);
        toast({
          title: t('createDebate.successTitle'),
          description: t('createDebate.successDescription')
        });
      }
    } catch (error) {
      console.error('Error creating debate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('createDebate.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('createDebate.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titel">{t('createDebate.name')}</Label>
            <Input
              id="titel"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              placeholder={t('createDebate.namePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="beschreibung">{t('createDebate.description')}</Label>
            <Textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder={t('createDebate.descriptionPlaceholder')}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              {t('createDebate.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('createDebate.creating') : t('createDebate.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
