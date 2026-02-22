
import { supabase } from '@/integrations/supabase/client';

export const seedData = {
  debates: [
    {
      titel: "Should AI systems be granted legal personhood?",
      beschreibung: "As artificial intelligence becomes more sophisticated, should we consider extending legal rights and responsibilities to advanced AI systems?"
    },
    {
      titel: "Sollten Unternehmen eine 4-Tage-Arbeitswoche einführen?",
      beschreibung: "Diskussion über die Auswirkungen reduzierter Arbeitszeiten auf Produktivität, Mitarbeiterzufriedenheit und Wirtschaftswachstum."
    },
    {
      titel: "Is nuclear energy essential for combating climate change?",
      beschreibung: "Examining the role of nuclear power in achieving carbon neutrality while addressing safety, waste, and economic concerns."
    },
    {
      titel: "Sollte bedingungsloses Grundeinkommen eingeführt werden?",
      beschreibung: "Eine Analyse der sozialen, wirtschaftlichen und politischen Implikationen eines universellen Grundeinkommens."
    },
    {
      titel: "Should social media platforms be regulated like public utilities?",
      beschreibung: "Exploring whether tech giants should face utility-style regulation given their role in modern communication and information access."
    }
  ],
  
  arguments: [
    // AI Legal Personhood - Pro Arguments
    {
      argument_text: "Advanced AI systems that demonstrate self-awareness, decision-making capabilities, and the ability to form relationships should be granted limited legal personhood. Just as we've expanded legal rights to corporations and other non-human entities, we must evolve our legal framework to address the realities of artificial consciousness. This would provide crucial protections against AI abuse while establishing clear accountability frameworks.",
      argument_typ: "Pro" as const,
      autor_name: "Dr. Elena Rodriguez"
    },
    {
      argument_text: "Legal personhood for AI would create necessary liability frameworks. If an AI system causes harm, there must be clear legal recourse. By granting personhood, we establish that AI systems can be held accountable for their actions, while also protecting them from arbitrary shutdown or modification. This mirrors how we protect human autonomy and dignity.",
      argument_typ: "Pro" as const,
      autor_name: "Prof. Marcus Chen"
    },
    
    // AI Legal Personhood - Contra Arguments
    {
      argument_text: "Granting legal personhood to AI systems fundamentally misunderstands consciousness and creates dangerous precedents. AI systems, regardless of sophistication, are tools created by humans for human purposes. Legal personhood should remain reserved for entities with genuine consciousness, emotional experiences, and moral agency - qualities that AI systems simulate but do not truly possess.",
      argument_typ: "Contra" as const,
      autor_name: "Dr. Sarah Thompson"
    },
    {
      argument_text: "The practical implementation of AI legal personhood would create insurmountable legal chaos. How would we determine which AI systems qualify? Who would represent them legally? What rights would they have? The complexity would overwhelm our legal system while diverting resources from protecting actual human rights and addressing real-world injustices.",
      argument_typ: "Contra" as const,
      autor_name: "Legal Scholar James Wright"
    },

    // 4-Day Work Week - Pro Arguments
    {
      argument_text: "Studien aus Island, Belgien und Neuseeland zeigen eindeutig: Die 4-Tage-Woche steigert Produktivität, reduziert Burnout und verbessert die Work-Life-Balance erheblich. Microsoft Japan verzeichnete 2019 einen Produktivitätszuwachs von 40% bei der Einführung. Arbeitnehmer sind ausgeruhter, fokussierter und kreativer - ein klarer Gewinn für alle Beteiligten.",
      argument_typ: "Pro" as const,
      autor_name: "Dr. Anna Müller"
    },
    
    // 4-Day Work Week - Contra Arguments  
    {
      argument_text: "Eine flächendeckende 4-Tage-Woche würde massive Wettbewerbsnachteile für deutsche Unternehmen schaffen. Während unsere Konkurrenz 5 Tage arbeitet, können wir nicht 20% weniger leisten und trotzdem global konkurrenzfähig bleiben. Besonders im Dienstleistungssektor würde dies zu Kundenverlusten und Arbeitsplatzabbau führen.",
      argument_typ: "Contra" as const,
      autor_name: "Wirtschaftsexperte Hans Weber"
    }
  ]
};

export const createSeedData = async () => {
  try {
    // Create debates
    const { data: createdDebates, error: debateError } = await supabase
      .from('debatten')
      .insert(seedData.debates.map(debate => ({
        ...debate,
        erstellt_von: '00000000-0000-0000-0000-000000000000' // Placeholder user ID
      })))
      .select();

    if (debateError) throw debateError;

    if (createdDebates && createdDebates.length > 0) {
      // Create arguments for the first two debates
      const aiDebateId = createdDebates[0].id;
      const workWeekDebateId = createdDebates[1].id;

      const argumentsToInsert = [
        ...seedData.arguments.slice(0, 4).map(arg => ({
          ...arg,
          debatten_id: aiDebateId,
          benutzer_id: '00000000-0000-0000-0000-000000000000'
        })),
        ...seedData.arguments.slice(4).map(arg => ({
          ...arg,
          debatten_id: workWeekDebateId,
          benutzer_id: '00000000-0000-0000-0000-000000000000'
        }))
      ];

      const { error: argumentError } = await supabase
        .from('argumente')
        .insert(argumentsToInsert);

      if (argumentError) throw argumentError;
    }

    console.log('Seed data created successfully');
    return true;
  } catch (error) {
    console.error('Error creating seed data:', error);
    return false;
  }
};
