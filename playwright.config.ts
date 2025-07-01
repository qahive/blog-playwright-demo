import * as path from "path";
import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  // fullyParallel: true,
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["json", { outputFile: "test-results/summary.json" }], ["html"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    headless: false,

    permissions: ["camera"],
    channel: "chromium",
    ...devices["Desktop Chrome"],
    launchOptions: {
      args: [
        // LIGHTHOUSE
        "--remote-debugging-port=9222",

        // Video WEB CAM
        "--allow-file-access-from-files", // allows getUserMedia() to be called from file:// URLs
        "--use-fake-ui-for-media-stream", // flag avoids grant the camera
        "--use-fake-device-for-media-stream", // flag allow fake media stream
        `--use-file-for-fake-video-capture=${path.join(
          __dirname,
          "resources",
          "demo.y4m"
        )}`,
      ],
    },
  },
};

export default config;
