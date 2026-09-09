import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 1000 },
  { name: 'tablet', width: 768, height: 1000 },
  { name: 'desktop', width: 1440, height: 1000 },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    let state = 42;
    Math.random = () => {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  });
});

for (const viewport of viewports) {
  test(`approved diagrams match at ${viewport.width}px`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.evaluate(async () => { await document.fonts.ready; });

    const review = page.locator('.diagram');
    const decision = page.locator('.decision-diagram');
    await expect(review).toBeVisible();
    await expect(decision).toBeVisible();
    await expect(review).toHaveScreenshot(`review-gate-${viewport.name}.png`);
    await expect(decision).toHaveScreenshot(`risk-decision-${viewport.name}.png`);
    expect(errors).toEqual([]);
  });
}

test('every chart compatibility constructor renders in Chromium', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(async () => { await document.fonts.ready; });

  const names = ['Bar', 'StackedBar', 'Pie', 'Line', 'Combined', 'XY', 'Radar'];
  for (const name of names) {
    const chart = page.locator(`[data-chart-name="${name}"] > svg`);
    await expect(chart).toBeVisible();
    expect(await chart.locator('*').count(), `${name} should render SVG content`).toBeGreaterThan(5);
  }
  await expect(page.locator('.chart-grid')).toHaveScreenshot('chart-compatibility-gallery.png');
  expect(errors).toEqual([]);
});
