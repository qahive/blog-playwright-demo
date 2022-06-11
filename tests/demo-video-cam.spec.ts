import { test, expect, Page } from '@playwright/test';

test('able to use fake web cam', async ({ page }) => {
  await page.goto('https://davidwalsh.name/demo/camera.php');
  await page.pause();
});
