
import { supabase } from '@/integrations/supabase/client';
import { demoUsers } from './createDemoUsers';

interface CreatedArgument {
  id: string;
}

export const createReputationTransactions = async (createdArguments: CreatedArgument[]) => {
  console.log('Creating reputation transactions...');
  
  if (!createdArguments || createdArguments.length === 0) {
    console.log('No arguments found, skipping reputation transactions');
    return;
  }

  const reputationTransactions = [
    {
      user_id: demoUsers[0].id,
      points: 25,
      reason: 'Argument als einsichtig bewertet und Punkt zugestanden',
      related_argument_id: createdArguments[0].id,
      granted_by_user_id: demoUsers[1].id
    },
    {
      user_id: demoUsers[1].id,
      points: 5,
      reason: 'Argument als einsichtig bewertet',
      related_argument_id: createdArguments[1].id,
      granted_by_user_id: demoUsers[0].id
    },
    {
      user_id: demoUsers[2].id,
      points: 5,
      reason: 'Argument als einsichtig bewertet',
      related_argument_id: createdArguments[2].id,
      granted_by_user_id: demoUsers[4].id
    }
  ];

  const { error: transactionError } = await supabase
    .from('reputation_transactions')
    .upsert(reputationTransactions, { onConflict: 'id' });

  if (transactionError) {
    console.error('Error creating reputation transactions:', transactionError);
    throw transactionError;
  }

  console.log('Reputation transactions created');
};
