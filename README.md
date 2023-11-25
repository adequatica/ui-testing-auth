# Testing UI with Google Authentication

## Description

[Google API for authentication](https://developers.google.com/identity/protocols/oauth2) is so complicated that it is easy to use Sign in form to authenticate a test user.

When you try to log in through Playwright or Puppeteer, Google can detect authentication by «robot», but you can prevent detection by using «stealth» plugin.

## Stack

A basic set of packages for [UI testing](https://github.com/adequatica/ui-testing) with Google authnetication:

- [Playwright](https://playwright.dev) — testing framework;
- [Playwright-extra](https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra) — modular plugin framework for Playwright;
- [Puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) — «stealth» plugin to prevent detection.

Example website for testing: [CERN](https://home.cern) (used as default URL).

## How to Use

1. Clone repository
2. Install dependencies: `npm install`
3. Install dependencies for testing framework: `npm run test:install-deps`
4. Run tests for the first time:

`USER_LOGIN='{username@gmail.com}' USER_PASS='{password}' npm run test`

5. Run tests by reusing signed in the state (skipping authentication step):

`SKIP_AUTH=true npm run test`

### Steps of Authentication

1. The authentication process by Playwright with «stealth» plugin is done before tests will start. It is regulated by `playwright.config.ts` through [globalSetup](https://playwright.dev/docs/test-advanced#global-setup-and-teardown) option. Authentication script is located at `lib/global-setup.ts` and requires user's login and password;

2. When authentication is done, the [signed in state](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state) saves at `setup/storage-state.json`;

3. When authentication is done, the tests start and reuse signed in state;

4. To speed up subsequent test runs (for example, for debugging), you may skip authentication process by `SKIP_AUTH=true` CLI option (it will work if you already have a file of a signed in state).

Read the full article about this implementation: [Google Authentication with Playwright](https://adequatica.medium.com/google-authentication-with-playwright-8233b207b71a).

**UPDATE**: In recent changes to the Playwright documentation, the [recommended authentication concept](https://playwright.dev/docs/auth#core-concepts) has been changed, but the presented implementation still works.
