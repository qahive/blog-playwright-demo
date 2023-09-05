import { test, expect } from "@playwright/test";

test("should allow me to add todo items", async ({ page }) => {
  await page.goto("https://web-demo.qahive.com/todo-list");
  await page.getByTestId("markRemove").click();
  await page.getByTestId("inputTodo").click();
  await page.getByTestId("inputTodo").fill("Learn Playwright 101");
  await page.getByTestId("submitTodo").click();
  await page.getByTestId("markDone").click();
});
