
import { createDemoUsers } from './demoContent/createDemoUsers';
import { createDemoDebates } from './demoContent/createDemoDebates';
import { createDemoArguments } from './demoContent/createDemoArguments';
import { createDemoRatings } from './demoContent/createDemoRatings';
import { createReputationTransactions } from './demoContent/createReputationTransactions';

export const createDemoContent = async () => {
  try {
    console.log('Starting demo content creation...');

    // Step 1: Create demo user profiles
    await createDemoUsers();

    // Step 2: Create debates with realistic timestamps
    const createdDebates = await createDemoDebates();

    // Step 3: Create arguments with proper user assignments
    const createdArguments = await createDemoArguments(createdDebates);

    // Step 4: Add argument ratings
    await createDemoRatings(createdArguments);

    // Step 5: Add reputation transactions
    await createReputationTransactions(createdArguments);

    console.log('Demo content creation completed successfully!');
    return true;
  } catch (error) {
    console.error('Error creating demo content:', error);
    return false;
  }
};
