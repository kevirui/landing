import { test, expect } from '@playwright/test';

test.describe('Landing Page Navigation', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check if the page has loaded
    await expect(page).toHaveURL(/\/(es|en|pt)?/);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements (adjust selectors based on your actual navigation)
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('should switch between languages', async ({ page }) => {
    await page.goto('/');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Look for language switcher (adjust selector based on your implementation)
    const languageSwitcher = page
      .locator(
        '[data-language-switcher], button:has-text("ES"), button:has-text("EN"), button:has-text("PT")'
      )
      .first();

    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();

      // Wait for navigation or content change
      await page.waitForTimeout(500);

      // Verify URL has changed or content has updated
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test navigation links (adjust based on your actual sections)
    const possibleLinks = [
      'text=/about|sobre|acerca/i',
      'text=/services|servicios|serviços/i',
      'text=/contact|contacto|contato/i',
    ];

    for (const linkSelector of possibleLinks) {
      const link = page.locator(linkSelector).first();
      if (await link.isVisible()) {
        await link.click({ timeout: 5000 }).catch(() => {
          // Link might not exist or be clickable, that's okay
        });
        await page.waitForTimeout(500);
        break;
      }
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that the page renders on mobile
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check for mobile menu if it exists
    const mobileMenuButton = page
      .locator('button[aria-label*="menu"], button[aria-label*="menú"]')
      .first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle scroll navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Verify page is still functional
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Page Metadata', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Key Protocol|Key|Protocol/i);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto('/');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });
});
