
import { supabase } from '@/integrations/supabase/client';
import { seedData } from './seedData';

interface DemoUser {
  id: string;
  username: string;
  reputation_score: number;
}

export const createDemoContent = async () => {
  try {
    console.log('Starting demo content creation...');

    // Step 1: Create demo user profiles
    const demoUsers: DemoUser[] = [
      { id: '11111111-1111-1111-1111-111111111111', username: 'Dr. Elena Rodriguez', reputation_score: 150 },
      { id: '22222222-2222-2222-2222-222222222222', username: 'Prof. Marcus Chen', reputation_score: 230 },
      { id: '33333333-3333-3333-3333-333333333333', username: 'Dr. Sarah Thompson', reputation_score: 180 },
      { id: '44444444-4444-4444-4444-444444444444', username: 'Legal Scholar James Wright', reputation_score: 200 },
      { id: '55555555-5555-5555-5555-555555555555', username: 'Dr. Anna Müller', reputation_score: 160 },
      { id: '66666666-6666-6666-6666-666666666666', username: 'Wirtschaftsexperte Hans Weber', reputation_score: 140 },
      { id: '77777777-7777-7777-7777-777777777777', username: 'Prof. Lisa Anderson', reputation_score: 190 },
      { id: '88888888-8888-8888-8888-888888888888', username: 'Tech Analyst Michael Brown', reputation_score: 170 }
    ];

    // Insert demo user profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(demoUsers, { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating demo profiles:', profileError);
    } else {
      console.log('Demo profiles created successfully');
    }

    // Step 2: Create debates with realistic timestamps
    const now = new Date();
    const debatesWithTimestamps = seedData.debates.map((debate, index) => ({
      ...debate,
      erstellt_von: demoUsers[index % demoUsers.length].id,
      erstellt_am: new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000).toISOString() // Spread over days
    }));

    const { data: createdDebates, error: debateError } = await supabase
      .from('debatten')
      .upsert(debatesWithTimestamps, { onConflict: 'titel' })
      .select();

    if (debateError) {
      console.error('Error creating debates:', debateError);
      return false;
    }

    console.log('Debates created:', createdDebates?.length);

    if (createdDebates && createdDebates.length > 0) {
      // Step 3: Create arguments with proper user assignments
      const argumentsWithUsers = [
        // AI Legal Personhood arguments
        {
          ...seedData.arguments[0],
          debatten_id: createdDebates[0].id,
          benutzer_id: demoUsers[0].id, // Dr. Elena Rodriguez
          erstellt_am: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString()
        },
        {
          ...seedData.arguments[1],
          debatten_id: createdDebates[0].id,
          benutzer_id: demoUsers[1].id, // Prof. Marcus Chen
          erstellt_am: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString()
        },
        {
          ...seedData.arguments[2],
          debatten_id: createdDebates[0].id,
          benutzer_id: demoUsers[2].id, // Dr. Sarah Thompson
          erstellt_am: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString()
        },
        {
          ...seedData.arguments[3],
          debatten_id: createdDebates[0].id,
          benutzer_id: demoUsers[3].id, // James Wright
          erstellt_am: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString()
        },
        // 4-Day Work Week arguments
        {
          ...seedData.arguments[4],
          debatten_id: createdDebates[1].id,
          benutzer_id: demoUsers[4].id, // Dr. Anna Müller
          erstellt_am: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          ...seedData.arguments[5],
          debatten_id: createdDebates[1].id,
          benutzer_id: demoUsers[5].id, // Hans Weber
          erstellt_am: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Add some additional arguments for other debates
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
      } else {
        console.log('Arguments created:', createdArguments?.length);
      }

      // Step 4: Add some argument ratings to demonstrate the system
      if (createdArguments && createdArguments.length > 0) {
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
        } else {
          console.log('Sample ratings created');
        }

        // Step 5: Add reputation transactions
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
        } else {
          console.log('Reputation transactions created');
        }
      }
    }

    console.log('Demo content creation completed successfully!');
    return true;
  } catch (error) {
    console.error('Error creating demo content:', error);
    return false;
  }
};
