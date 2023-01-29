# Testing UI with Google auth

## Description

[Google API for authentication](https://developers.google.com/identity/protocols/oauth2) is so complicated, that it is easily to use a sign in form to authenticate by a test user from UI tests.

Google can detect authentication by «robots», when you try to sign in through Playwright, Puppeteer, WebDriverIO, etc. But you can prevent detection by using «stealth» plugin.

### Steps of auth

1. The authentication process by Playwright with «stealth» plugin is done before tests will start. It is regulated by `playwright.config.ts` through [globalSetup](https://playwright.dev/docs/test-advanced#global-setup-and-teardown) option. Authentication script is located at `lib/authentication-setup.ts` and requires user's login and password.

2. When authentication is done the [sign in state](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state) saves at `setup/storage-state.json`

3. When authentication is done the tests start and [reuse signed in state](https://playwright.dev/docs/auth#reuse-signed-in-state).

4. To speed up subsequent test runs (for example for debugging) you may skip authentication process by `SKIP_AUTH=true` CLI option (it will work only if you have a file of a signed in state).

## Stack

[A basic set of packages to test UI](https://github.com/adequatica/ui-testing) with Google auth:

- [Playwright](https://playwright.dev) — testing framework;
- [Playwright-extra](https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra) — modular plugin framework for Playwright;
- [Puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) – «stealth» plugin to prevent detection.

Example web site for testing: [CERN](https://home.cern).

## How to Use

1. Clone repository
2. Intall dependencies: `npm install`
3. Intall dependencies for testing framework: `npm run test:install-deps`
4. Run tests for the first time:

`USER_LOGIN='{username@gmail.com}' USER_PASS='{password}' npm run test`

5. Run tests with [reusing signed in state](https://playwright.dev/docs/auth#reuse-signed-in-state): 

`SKIP_AUTH=true npm run test`
