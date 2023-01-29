import { test, Page } from '@playwright/test';
import { testUser } from '../lib/test-user';
import { CernToolbar } from '../models/toolbar';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Sing in on home page', async () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await page.goto('/');
  });

  test('Should have toolbar', async () => {
    const toolbar = new CernToolbar(page);
    await toolbar.waitForToolbarVisibility();
  });

  test('Should have signed in user', async () => {
    const toolbar = new CernToolbar(page);
    await toolbar.getLocatorText(`Signed in as:${testUser.login} (Drupal)`);
  });

  test('Should have sign out', async () => {
    const toolbar = new CernToolbar(page);
    await toolbar.getLocatorText('Sign out');
  });
});
