// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import { chromium } from 'playwright-extra';
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { baseURL } from '../playwright.config';
import { testUser } from './test-user';

const setupVideoDirectory = './test-results/global-setup';
const setupTracesArchivePath = './test-results/global-setup/traces.zip';

// Add the plugin to playwright
chromium.use(StealthPlugin());

// Global setup
// https://playwright.dev/docs/test-advanced#global-setup-and-teardown
async function globalSetup(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  // globalSetup does not apply playwright.e2e.config options =>
  // we need to create an additional context to pass ignoreHTTPSErrors option,
  // if your testing site does not work over HTTPS
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    recordVideo: { dir: setupVideoDirectory },
  });

  const page = await context.newPage();

  // This «try» is for debugging reasonss only.
  // If your authentication process will fail, you get traces and video records
  // https://playwright.dev/docs/api/class-tracing
  try {
    await context.tracing.start({
      sources: true,
      snapshots: true,
      screenshots: true,
    });

    // Open log in page on tested site
    await page.goto(`${baseURL}/user/login`);
    await page.getByText('Google').click();
    // Click redirects page to Google auth form,
    // parse https://accounts.google.com/ page
    const html = await page.locator('body').innerHTML();

    // Determine type of Google sign in form
    if (html.includes('aria-label="Google"')) {
      // Old Google sign in form
      await page.fill('#Email', testUser.login);
      await page.locator('#next').click();
      await page.fill('#password', testUser.password);
      await page.locator('#submit').click();
    } else {
      // New Google sign in form
      await page.fill('input[type="email"]', testUser.login);
      await page.locator('#identifierNext >> button').click();
      await page.fill('#password >> input[type="password"]', testUser.password);
      await page.locator('button >> nth=1').click();
    }

    // Wait for redirect back to home page after authentication
    await page.waitForURL(`${baseURL}/?check_logged_in=1`);
    // Save signed in state
    // https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-storage-state
    await page.context().storageState({ path: './setup/storage-state.json' });
  } catch (error) {
    await context.tracing.stop({ path: setupTracesArchivePath });

    throw error;
  }

  await browser.close();
}

export default globalSetup;
