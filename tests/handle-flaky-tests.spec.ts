import { test, expect, Page } from '@playwright/test';
import waitForNetworkSettled from '../network-settle';

test('Handle flaky modal', async ({ page }) => {  
  test.setTimeout(20 * 1000);
  await page.goto('https://getbootstrap.com/docs/5.2/components/modal/', {waitUntil: 'networkidle'});

  await waitForNetworkSettled(page, async () => {
    await page.locator('button[data-bs-target="#exampleModalLive"]').click();
    // await page.goto('https://getbootstrap.com/docs/5.2/components/modal/', {waitUntil: 'domcontentloaded'});
  });

  /*
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        transition: none !important;
      }
    `,
  });
  */
  for(let i = 0; i < 10; i++) {
    //await page.locator('button[data-bs-target="#exampleModalLive"]').click();
    
    // Handle by auto wait - auto wait for 'stable'
    // await page.locator('#exampleModalLive button.btn-secondary').click();
    
    // Invalid
    // await page.locator('#exampleModalLive button.btn-secondary').waitFor();
    // await page.locator('#exampleModalLive button.btn-secondary').click({force: true});

    // Solution 2
    await page.locator('button[data-bs-target="#exampleModalLive"]').click();
    // const x = await page.locator('#exampleModalLive button.btn-secondary').click({trial: true});
    
    await page.locator('#exampleModalLive button.btn-secondary').click();
    await page.locator('#exampleModalLive button.btn-secondary').waitFor({state: 'hidden'});
  }

  // Wait for animation
  // https://github.com/microsoft/playwright/issues/15660
});

test('Handle flaky dropdown opacity', async ({ page }) => {
  // https://getbootstrap.com/docs/5.2/components/dropdowns/
  await page.goto('https://getbootstrap.com/docs/5.2/components/dropdowns/', { waitUntil: 'domcontentloaded' });
  test.setTimeout(600 * 1000);
  page.waitForLoadState('networkidle');
  for(let i = 0; i < 300; i++) {
    await page.locator('button.dropdown-toggle').nth(1).click();
    await page.locator('ul.dropdown-menu').nth(1).click();
  }
});

// opacity
// https://getbootstrap.com/docs/5.2/utilities/opacity/

async function waitForAnimationEnd(page: Page, selector: string) {
  await page.locator(selector).waitFor();
  return page
    .locator(selector)
    .evaluate((element) =>
      Promise.all(
        element
          .getAnimations()
          .map((animation) => animation.finished)
      )
    )
}

// https://github.com/microsoft/playwright/issues/4055
async function waitForAnimation(frame, selector) {
  return frame.$eval(selector, el => new Promise((res, _) => {
    const onEnd = () => {
      console.debug('Anmailtion End')
      el.removeEventListener('animationend', onEnd)
      return;
    }
    el.addEventListener("animationend", onEnd)
  }))
}
