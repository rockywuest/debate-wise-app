
import { supabase } from '@/integrations/supabase/client';
import { demoUsers } from './createDemoUsers';

interface CreatedArgument {
  id: string;
}

export const createDemoRatings = async (createdArguments: CreatedArgument[]) => {
  console.log('Creating demo ratings...');
  
  if (!createdArguments || createdArguments.length === 0) {
    console.log('No arguments found, skipping ratings creation');
    return;
  }

  const sampleRatings = [
    {
      argument_id: createdArguments[0].id,
      rated_by_user_id: demoUsers[1].id,
      rating_type: 'insightful'
    },
    {
      argument_id: createdArguments[0].id,
      rated_by_user_id: demoUsers[2].id,
      rating_type: 'concede_point'
    },
    {
      argument_id: createdArguments[1].id,
      rated_by_user_id: demoUsers[0].id,
      rating_type: 'insightful'
    },
    {
      argument_id: createdArguments[2].id,
      rated_by_user_id: demoUsers[4].id,
      rating_type: 'insightful'
    }
  ];

  const { error: ratingError } = await supabase
    .from('argument_ratings')
    .upsert(sampleRatings, { onConflict: 'argument_id,rated_by_user_id,rating_type' });

  if (ratingError) {
    console.error('Error creating ratings:', ratingError);
    throw ratingError;
  }

  console.log('Sample ratings created');
};
