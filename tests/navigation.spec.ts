import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

test('home loads and navigation works', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Top10Maison/i);
  await page.getByRole('link', { name: /Categories/i }).click();
  await expect(page).toHaveURL(/\/categories\//);
});

test('404 page appears for unknown route', async ({ page }) => {
  await page.goto(`${BASE_URL}/not-a-real-page-xyz`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Page not found/i);
});

test('contact form can be filled', async ({ page }) => {
  await page.goto(`${BASE_URL}/contact/`);
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Message').fill('Hello from Playwright test.');
  await expect(page.getByLabel('Message')).toHaveValue(/Hello from Playwright test/);
});

test('mobile menu toggles aria-expanded', async ({ page }) => {
  await page.goto(BASE_URL);
  const button = page.getByRole('button', { name: /menu/i });
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});
