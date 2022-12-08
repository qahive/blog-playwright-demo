// ADDITIONAL STEPS: Require export api key before execute test
// export APPLITOOLS_API_KEY=<your-api-key>
//

import { test, expect, Page } from "@playwright/test";
import {
  BatchInfo,
  Configuration,
  VisualGridRunner,
  BrowserType,
  Eyes,
  Target,
} from "@applitools/eyes-playwright";

// Applitools objects to share for all tests
let Batch: BatchInfo;
let Config: Configuration;
let Runner: VisualGridRunner;

let eyes: Eyes; // Test-specific objects

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

  Config.addBrowser(1024, 768, BrowserType.CHROME);
});

test.beforeEach(async ({ page }) => {
  // Create the Applitools Eyes object connected to the VisualGridRunner and set its configuration.
  eyes = new Eyes(Runner, Config);
  await eyes.open(
    page, // The Playwright page object to "watch"
    "QA Hive AI Demo", // The name of the app under test
    test.info().title, // The name of the test case
    { width: 1024, height: 768 }
  ); // The viewport size for the local browser

  await page.goto("https://demo.playwright.dev/todomvc");
});

test.afterEach(async () => {
  await eyes.close();
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.only("should allow me to add todo items", async ({ page }) => {
  test.setTimeout(120 * 1000);

  // Verify the page loaded correctly.
  await eyes.check("Todo list page", Target.window().fully());

  // Create 1st todo.
  await page.locator(".new-todo").fill(TODO_ITEMS[0]);
  await page.locator(".new-todo").press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.locator(".view label")).toHaveText([TODO_ITEMS[0]]);
});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}
