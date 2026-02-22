import { expect, test, type Page } from '@playwright/test';

const seedClientState = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('debatewise-onboarding-completed', 'true');
    window.localStorage.setItem('debate-wise-language', 'en');
    window.localStorage.setItem('debate-platform-language', 'en');
  });
};

const mockSupabase = async (page: Page) => {
  await page.route('**/auth/v1/**', async (route) => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
      return;
    }

    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' })
    });
  });

  await page.route('**/rest/v1/debatten**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.route('**/rest/v1/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });
};

test.describe('Core E2E flows', () => {
  test.beforeEach(async ({ page }) => {
    await seedClientState(page);
    await mockSupabase(page);
  });

  test('auth page switches between sign-in and sign-up modes', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { name: 'Sign In', level: 3 })).toBeVisible();
    await page.getByRole('button', { name: "Don't have an account? Sign up" }).click();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign Up', level: 3 })).toBeVisible();
  });

  test('guest debates route renders and exposes sign-in call to action', async ({ page }) => {
    await page.goto('/debates');

    await expect(page.getByRole('heading', { name: 'Intelligent Debates', level: 1 })).toBeVisible();
    const signInButtons = page.getByRole('button', { name: 'Sign In' });
    await expect(signInButtons).toHaveCount(2);
    await expect(signInButtons.last()).toBeVisible();
  });

  test('language toggle updates from EN to DE in the navigation', async ({ page }) => {
    await page.goto('/auth');

    const languageToggle = page.getByRole('button', { name: 'EN' });
    await expect(languageToggle).toBeVisible();
    await languageToggle.click();
    await expect(page.getByRole('button', { name: 'DE', exact: true })).toBeVisible();
  });
});
