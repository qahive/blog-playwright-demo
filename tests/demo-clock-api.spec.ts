import { test, expect } from "@playwright/test";

test("should able to control the clock", async ({ page }) => {
  await page.goto("https://web-demo.qahive.com/todo-list");

  // Set date time
  await page.clock.install();
  // await page.clock.install({ time: new Date("2024-02-02T08:00:00") });

  // Pause the time once reached that point.
  // await page.clock.pauseAt(new Date("2024-02-02T10:00:00"));

  // Fast foward the time
  await page.clock.fastForward("30:00");
});
