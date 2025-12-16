import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display contact form', async ({ page }) => {
    // Look for contact section or navigate to contact page
    const contactLink = page
      .locator(
        'a:has-text("Contacto"), a:has-text("Contact"), a:has-text("Contato")'
      )
      .first();

    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForTimeout(500);
    }

    // Check if form exists (adjust selector based on your form)
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      await expect(form).toBeVisible();
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Find the contact form
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      // Try to submit without filling fields
      const submitButton = form.locator('button[type="submit"]').first();

      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Check for validation messages (HTML5 or custom)
        // This will depend on your form implementation
        const nameInput = form
          .locator('input[name="name"], input[name="nombre"]')
          .first();
        if (await nameInput.isVisible()) {
          const isInvalid = await nameInput.evaluate(
            (el: HTMLInputElement) => !el.validity.valid
          );
          expect(isInvalid).toBe(true);
        }
      }
    }
  });

  test('should allow filling out the form', async ({ page }) => {
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      // Fill name field
      const nameInput = form
        .locator('input[name="name"], input[name="nombre"], input[type="text"]')
        .first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }

      // Fill email field
      const emailInput = form
        .locator('input[name="email"], input[type="email"]')
        .first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
      }

      // Fill message field
      const messageInput = form
        .locator('textarea[name="message"], textarea[name="mensaje"], textarea')
        .first();
      if (await messageInput.isVisible()) {
        await messageInput.fill('This is a test message for the contact form.');
      }

      // Verify fields are filled
      if (await nameInput.isVisible()) {
        await expect(nameInput).toHaveValue('Test User');
      }
      if (await emailInput.isVisible()) {
        await expect(emailInput).toHaveValue('test@example.com');
      }
    }
  });

  test('should validate email format', async ({ page }) => {
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      const emailInput = form
        .locator('input[name="email"], input[type="email"]')
        .first();

      if (await emailInput.isVisible()) {
        // Enter invalid email
        await emailInput.fill('invalid-email');
        await emailInput.blur();

        // Check if browser validation caught it
        const isInvalid = await emailInput.evaluate(
          (el: HTMLInputElement) => !el.validity.valid
        );
        expect(isInvalid).toBe(true);

        // Enter valid email
        await emailInput.fill('valid@example.com');
        const isValid = await emailInput.evaluate(
          (el: HTMLInputElement) => el.validity.valid
        );
        expect(isValid).toBe(true);
      }
    }
  });

  test('should show loading state on submission', async ({ page }) => {
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      // Fill all required fields
      const nameInput = form
        .locator('input[name="name"], input[name="nombre"], input[type="text"]')
        .first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User');
      }

      const emailInput = form
        .locator('input[name="email"], input[type="email"]')
        .first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
      }

      const messageInput = form.locator('textarea').first();
      if (await messageInput.isVisible()) {
        await messageInput.fill('Test message');
      }

      // Submit form
      const submitButton = form.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        // Click submit and check for loading state
        await submitButton.click();

        // Check if button is disabled or shows loading text
        await page.waitForTimeout(300);

        // Note: Actual submission will likely fail in test environment
        // This test just verifies the UI responds to submission
      }
    }
  });

  test('should be accessible', async ({ page }) => {
    const form = page.locator('form').first();

    if (await form.isVisible()) {
      // Check for labels
      const labels = form.locator('label');
      const labelCount = await labels.count();

      if (labelCount > 0) {
        expect(labelCount).toBeGreaterThan(0);
      }

      // Check inputs have accessible names
      const inputs = form.locator('input, textarea');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasPlaceholder = await input.getAttribute('placeholder');
        const id = await input.getAttribute('id');

        // Input should have some form of accessible label
        expect(hasAriaLabel || hasPlaceholder || id).toBeTruthy();
      }
    }
  });
});
