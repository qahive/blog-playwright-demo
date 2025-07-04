import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
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

    // example incorrect assertion (2 should be correct)
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    // Create one todo item.
    // invalid locator (should be .new-todo)
    await page.locator(".new").fill(TODO_ITEMS[0]);
    await page.locator(".new").press("Enter");

    // Check that input is empty.
    await expect(page.locator(".new")).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test("should append new items to the bottom of the list", async ({
    page,
  }) => {
    // Create 3 items.
    await createDefaultTodos(page);

    // Check test using different methods.
    // invalid assertion (should be 3)
    await expect(page.locator(".todo-count")).toHaveText("1 items left");
    await expect(page.locator(".todo-count")).toContainText("3");
    await expect(page.locator(".todo-count")).toHaveText(/3/);

    // Check all items in one call.
    await expect(page.locator(".view label")).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });
});

async function createDefaultTodos(page: Page) {
  for (const item of TODO_ITEMS) {
    await page.locator(".new-todo").fill(item);
    await page.locator(".new-todo").press("Enter");
  }
}

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}

async function checkNumberOfCompletedTodosInLocalStorage(
  page: Page,
  expected: number
) {
  return await page.waitForFunction((e) => {
    return (
      JSON.parse(localStorage["react-todos"]).filter(
        (todo: any) => todo.completed
      ).length === e
    );
  }, expected);
}

async function checkTodosInLocalStorage(page: Page, title: string) {
  return await page.waitForFunction((t) => {
    return JSON.parse(localStorage["react-todos"])
      .map((todo: any) => todo.title)
      .includes(t);
  }, title);
}
