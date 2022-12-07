// ADDITIONAL STEPS: Require export api key before execute test
// export APPLITOOLS_API_KEY=<your-api-key>
//

import { test, expect, Page } from "@playwright/test";
import {
  BatchInfo,
  Configuration,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
  Target,
} from "@applitools/eyes-playwright";

// This method sets up the configuration for running visual tests in the Ultrafast Grid.
// The configuration is shared by all tests in a test suite, so it belongs in a `beforeAll` method.
// If you have more than one test class, then you should abstract this configuration to avoid duplication.
test.beforeAll(async () => {
  // Create the runner for the Ultrafast Grid.
  // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
  // Warning: If you have a free account, then concurrency will be limited to 1.
  Runner = new VisualGridRunner({ testConcurrency: 1 });

  // Create a new batch for tests.
  // A batch is the collection of visual checkpoints for a test suite.
  // Batches are displayed in the dashboard, so use meaningful names.
  Batch = new BatchInfo({
    name: "Batch: demo-applitools-ai",
  });

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);

  // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
  // Other browsers are also available, like Edge and IE.
  Config.addBrowser(800, 600, BrowserType.CHROME);
  // Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
  // Config.addBrowser(1024, 768, BrowserType.SAFARI);

  // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
  // Other mobile devices are available, including iOS.
  // Config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
  // Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
});

// Applitools objects to share for all tests
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: VisualGridRunner;

// Test-specific objects
let eyes: Eyes;

test.beforeEach(async ({ page }) => {
  // Create the Applitools Eyes object connected to the VisualGridRunner and set its configuration.
  eyes = new Eyes(Runner, Config);

  // Open Eyes to start visual testing.
  // Each test should open its own Eyes for its own snapshots.
  // It is a recommended practice to set all four inputs below:
  await eyes.open(
    page, // The Playwright page object to "watch"
    "QA Hive AI Demo", // The name of the app under test
    test.info().title, // The name of the test case
    { width: 1024, height: 768 }
  ); // The viewport size for the local browser

  await page.goto("https://demo.playwright.dev/todomvc");
});

// This method performs cleanup after each test.
test.afterEach(async () => {
  // Close Eyes to tell the server it should display the results.
  await eyes.close();

  // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
  // You will need to check the Applitools dashboard for visual results per checkpoint.
  // Note that "unresolved" and "failed" visual checkpoints will not cause the Playwright test to fail.

  // If you want the Playwright test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
  // If any checkpoints are unresolved or failed, then `eyes.close()` will make the Playwright test fail.
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.only("should allow me to add todo items", async ({ page }) => {
  test.setTimeout(120 * 1000);

  // Verify the full login page loaded correctly.
  await eyes.check("Todo list page", Target.window().fully());

  // Create 1st todo.
  await page.locator(".new-todo").fill(TODO_ITEMS[0]);
  await page.locator(".new-todo").press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.locator(".view label")).toHaveText([TODO_ITEMS[0]]);

  // Create 2nd todo.
  await page.locator(".new-todo").fill(TODO_ITEMS[1]);
  await page.locator(".new-todo").press("Enter");

  // Make sure the list now has two todo items.
  await expect(page.locator(".view label")).toHaveText([
    TODO_ITEMS[0],
    TODO_ITEMS[1],
  ]);

  // Verify the full login page loaded correctly.
  await eyes.check("Todo list 2 items", Target.window().fully());

  await checkNumberOfTodosInLocalStorage(page, 2);
});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}
