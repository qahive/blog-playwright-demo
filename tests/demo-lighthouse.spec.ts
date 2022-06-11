import { expect, test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

const os = require('os');
const fs = require('fs');
const path = require('path');
const appPrefix = 'pl-lh';

test.only('able to check client side performance testing', async ({ playwright }) => {
  test.setTimeout(0);
  let tmpDir = os.tmpdir();
  tmpDir = fs.mkdtempSync(path.join(tmpDir, appPrefix));
  const context = await playwright['chromium'].launchPersistentContext(tmpDir, {
    args: ['--remote-debugging-port=9222'],
    headless: false
  });

  const page = await context.newPage();

  await page.goto('https://demoqa.com/login');
  await page.fill('id=userName', 'demoqahive');
  await page.fill('id=password', 'T@stpw120');
  await Promise.all([
    page.waitForNavigation(),
    page.click('id=login')
  ]);
  expect(page.locator('id=userName-label').nth(0)).toBeVisible();
  await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 20,
      accessibility: 20,
      'best-practices': 20,
    },
    reports: {
      formats: {
        html: true,
        csv: true,
      }
    }
  });
});
