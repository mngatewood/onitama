import { test as teardown } from '@playwright/test';
import { emptyDatabase } from './test-helpers';

// placeholder
teardown('delete database', async () => {
	emptyDatabase();
});