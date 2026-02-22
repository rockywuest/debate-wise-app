
import { supabase } from '@/integrations/supabase/client';

interface DemoUser {
  id: string;
  username: string;
  reputation_score: number;
}

export const demoUsers: DemoUser[] = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'Dr. Elena Rodriguez', reputation_score: 150 },
  { id: '22222222-2222-2222-2222-222222222222', username: 'Prof. Marcus Chen', reputation_score: 230 },
  { id: '33333333-3333-3333-3333-333333333333', username: 'Dr. Sarah Thompson', reputation_score: 180 },
  { id: '44444444-4444-4444-4444-444444444444', username: 'Legal Scholar James Wright', reputation_score: 200 },
  { id: '55555555-5555-5555-5555-555555555555', username: 'Dr. Anna Müller', reputation_score: 160 },
  { id: '66666666-6666-6666-6666-666666666666', username: 'Wirtschaftsexperte Hans Weber', reputation_score: 140 },
  { id: '77777777-7777-7777-7777-777777777777', username: 'Prof. Lisa Anderson', reputation_score: 190 },
  { id: '88888888-8888-8888-8888-888888888888', username: 'Tech Analyst Michael Brown', reputation_score: 170 }
];

export const createDemoUsers = async () => {
  console.log('Creating demo user profiles...');
  
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(demoUsers, { onConflict: 'id' });

  if (profileError) {
    console.error('Error creating demo profiles:', profileError);
    throw profileError;
  }
  
  console.log('Demo profiles created successfully');
  return demoUsers;
};
