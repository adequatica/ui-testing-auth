import { Page, Locator } from '@playwright/test';

export class CernToolbar {
  private page: Page;
  private toolbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = page.locator('#cern-toolbar');
  }

  async waitForToolbarVisibility(): Promise<void> {
    await this.toolbar.waitFor({ state: 'visible' });
  }

  async getLocatorText(text: string): Promise<void> {
    // New locator API from v1.27.0 https://playwright.dev/docs/locators#locate-by-text
    await this.page.getByText(text);
  }
}
