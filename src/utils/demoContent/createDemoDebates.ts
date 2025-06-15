
import { supabase } from '@/integrations/supabase/client';
import { seedData } from '../seedData';
import { demoUsers } from './createDemoUsers';

export const createDemoDebates = async () => {
  console.log('Creating demo debates...');
  
  const now = new Date();
  const debatesWithTimestamps = seedData.debates.map((debate, index) => ({
    ...debate,
    erstellt_von: demoUsers[index % demoUsers.length].id,
    erstellt_am: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
  }));

  const { data: createdDebates, error: debateError } = await supabase
    .from('debatten')
    .upsert(debatesWithTimestamps, { onConflict: 'titel' })
    .select();

  if (debateError) {
    console.error('Error creating debates:', debateError);
    throw debateError;
  }

  console.log('Debates created:', createdDebates?.length);
  return createdDebates || [];
};
