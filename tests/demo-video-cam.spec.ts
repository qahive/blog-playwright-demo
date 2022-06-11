import { test, expect, Page } from '@playwright/test';

// Please create the demo.y4m file by running this command first
// $ ffmpeg -i demo-video.mp4  demo.y4m
test('able to use fake web cam', async ({ page }) => {
  await page.goto('https://davidwalsh.name/demo/camera.php');
  await page.pause();
});
