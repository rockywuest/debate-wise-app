
import React, { useState } from 'react';
import { ArgumentCard } from '@/components/ArgumentCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Mock data for demonstration
const mockArguments = [
  {
    id: '1',
    title: 'Klimawandel erfordert sofortige Maßnahmen',
    content: 'Die wissenschaftlichen Belege zeigen eindeutig, dass der Klimawandel eine existenzielle Bedrohung darstellt. Wir müssen jetzt handeln, um katastrophale Folgen zu vermeiden.',
    type: 'pro' as const,
    author: 'Dr. Schmidt',
    createdAt: '2024-01-15',
    childArguments: [
      {
        id: '2',
        title: 'Wirtschaftliche Folgen sind zu hoch',
        content: 'Drastische Klimamaßnahmen würden Millionen von Arbeitsplätzen kosten und die Wirtschaft schwer schädigen.',
        type: 'contra' as const
      },
      {
        id: '3',
        title: 'Technologie kann das Problem lösen',
        content: 'Neue Technologien wie Carbon Capture können eine Lösung bieten, ohne die Wirtschaft zu schädigen.',
        type: 'neutral' as const
      },
      {
        id: '4',
        title: 'Grüne Arbeitsplätze entstehen',
        content: 'Der Übergang zu erneuerbaren Energien schafft neue, zukunftssichere Arbeitsplätze in wachsenden Branchen.',
        type: 'pro' as const
      }
    ]
  },
  {
    id: '5',
    title: 'Kernenergie ist notwendig für Klimaziele',
    content: 'Ohne Kernenergie können wir die CO2-Ziele nicht erreichen. Erneuerbare Energien allein reichen nicht aus.',
    type: 'pro' as const,
    author: 'Prof. Müller',
    createdAt: '2024-01-14',
    childArguments: [
      {
        id: '6',
        title: 'Sicherheitsrisiken sind zu hoch',
        content: 'Die Risiken von Nuklearunfällen und radioaktivem Abfall überwiegen die Klimavorteile.',
        type: 'contra' as const
      }
    ]
  }
];

const Debate = () => {
  const [debateArguments, setDebateArguments] = useState(mockArguments);

  const handleReply = (parentId: string) => {
    console.log('Replying to argument:', parentId);
    // Hier würde die Logik für das Erstellen einer Antwort implementiert
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Debatte: Klimapolitik und Energiewende
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Strukturierte Diskussion mit KI-gestützter Thread-Zusammenfassung
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Neues Argument hinzufügen
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {debateArguments.map((argument) => (
            <ArgumentCard
              key={argument.id}
              {...argument}
              onReply={handleReply}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Debate;
