
import { supabase } from '@/integrations/supabase/client';
import { seedData } from '../seedData';
import { demoUsers } from './createDemoUsers';

export const createDemoArguments = async (createdDebates: any[]) => {
  console.log('Creating demo arguments...');
  
  if (!createdDebates || createdDebates.length === 0) {
    console.log('No debates found, skipping arguments creation');
    return [];
  }

  const now = new Date();
  
  const argumentsWithUsers = [
    // AI Legal Personhood arguments
    {
      ...seedData.arguments[0],
      debatten_id: createdDebates[0].id,
      benutzer_id: demoUsers[0].id,
      erstellt_am: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString()
    },
    {
      ...seedData.arguments[1],
      debatten_id: createdDebates[0].id,
      benutzer_id: demoUsers[1].id,
      erstellt_am: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString()
    },
    {
      ...seedData.arguments[2],
      debatten_id: createdDebates[0].id,
      benutzer_id: demoUsers[2].id,
      erstellt_am: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString()
    },
    {
      ...seedData.arguments[3],
      debatten_id: createdDebates[0].id,
      benutzer_id: demoUsers[3].id,
      erstellt_am: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString()
    },
    // 4-Day Work Week arguments
    {
      ...seedData.arguments[4],
      debatten_id: createdDebates[1].id,
      benutzer_id: demoUsers[4].id,
      erstellt_am: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      ...seedData.arguments[5],
      debatten_id: createdDebates[1].id,
      benutzer_id: demoUsers[5].id,
      erstellt_am: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Additional arguments for other debates
  const additionalArguments = [
    {
      argument_text: "Nuclear energy provides reliable baseload power that renewable sources like wind and solar cannot match. While safety concerns are valid, modern reactor designs are significantly safer than older generations, and the climate crisis requires all low-carbon options.",
      argument_typ: "Pro" as const,
      autor_name: "Prof. Lisa Anderson",
      debatten_id: createdDebates[2].id,
      benutzer_id: demoUsers[6].id,
      erstellt_am: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      argument_text: "The long-term radioactive waste problem remains unsolved, and the massive capital costs make nuclear economically unviable compared to rapidly declining renewable costs. We should focus resources on storage technologies and grid improvements instead.",
      argument_typ: "Contra" as const,
      autor_name: "Tech Analyst Michael Brown",
      debatten_id: createdDebates[2].id,
      benutzer_id: demoUsers[7].id,
      erstellt_am: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      argument_text: "Ein bedingungsloses Grundeinkommen würde die Bürokratie des Sozialsystems drastisch vereinfachen und Menschen mehr Freiheit geben, sich weiterzubilden oder kreative Arbeit zu verfolgen. Pilotprojekte zeigen positive Effekte auf Gesundheit und Bildung.",
      argument_typ: "Pro" as const,
      autor_name: "Dr. Elena Rodriguez",
      debatten_id: createdDebates[3].id,
      benutzer_id: demoUsers[0].id,
      erstellt_am: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  const allArguments = [...argumentsWithUsers, ...additionalArguments];

  const { data: createdArguments, error: argumentError } = await supabase
    .from('argumente')
    .upsert(allArguments, { onConflict: 'id' })
    .select();

  if (argumentError) {
    console.error('Error creating arguments:', argumentError);
    throw argumentError;
  }

  console.log('Arguments created:', createdArguments?.length);
  return createdArguments || [];
};
