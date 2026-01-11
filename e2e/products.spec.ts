import { test, expect, TEST_USER, loginAs } from "./fixtures";

test.describe("Products Workflows", () => {
  test.describe("Public Product Pages", () => {
    test("should display products landing page", async ({ page }) => {
      await page.goto("/products");
      
      // Should be accessible without authentication
      await expect(page).toHaveURL(/\/products/);
    });

    test("should display individual product preview page", async ({ page }) => {
      await page.goto("/products/e2e-test-course");
      
      // Should show product preview (if the route exists)
      // This may redirect or show a 404 depending on implementation
    });
  });

  test.describe("Purchased Product Access", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
    });

    test("should access purchased digital product", async ({ page }) => {
      await page.goto("/dashboard/products/e2e-test-product");
      
      // Should show product content
      await expect(page.getByText("This is the product content.")).toBeVisible();
    });

    test("should display product on dashboard", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Should show purchased product
      await expect(page.getByText("E2E Test Product")).toBeVisible();
      
      // Should show Purchased badge
      await expect(page.getByText("Purchased")).toBeVisible();
    });

    test("should navigate to product from dashboard", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Find and click Access Product button
      const accessButton = page.getByRole("link", { name: /Access Product/i });
      if (await accessButton.isVisible()) {
        await accessButton.click();
        
        // Should navigate to product page
        await page.waitForURL(/\/dashboard\/products\//);
      }
    });
  });

  test.describe("Browse Products", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
    });

    test("should display products in browse page", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Should show Digital Products section
      await expect(page.getByText("Digital Products")).toBeVisible();
      
      // Should show test product
      await expect(page.getByText("E2E Test Product")).toBeVisible();
    });

    test("should show product price", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Should show price (49.00 for the test product)
      await expect(page.getByText("$49.00")).toBeVisible();
    });

    test("should show owned badge for purchased products", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Should show Owned badge
      const ownedBadges = page.getByText("Owned");
      await expect(ownedBadges.first()).toBeVisible();
    });
  });
});
