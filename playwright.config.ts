import { PlaywrightTestConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://home.cern';

/**
 * See https://playwright.dev/docs/test-configuration
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* The maximum number of test failures for the whole test suite run. */
  maxFailures: process.env.CI ? 10 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'html',
      {
        open: process.env.CI ? 'never' : 'on-failure',
      },
    ],
  ],
  /* See https://playwright.dev/docs/test-advanced#global-setup-and-teardown */
  globalSetup: process.env.SKIP_AUTH ? '' : './lib/global-setup',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    /* See https://playwright.dev/docs/auth#reuse-signed-in-state */
    storageState: './setup/storage-state.json',
  },
  /* Configure projects for major browsers. */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*.spec.ts/,
    },
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
};

export { baseURL };
export default config;
