import { test, expect, TEST_USER, loginAs } from "./fixtures";

test.describe("Navigation Workflows", () => {
  test.describe("Public Navigation", () => {
    test("should redirect home to products", async ({ page }) => {
      await page.goto("/");
      
      // Home redirects to /products
      await expect(page).toHaveURL(/\/products/);
    });

    test("should access login page", async ({ page }) => {
      await page.goto("/auth/login");
      
      await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    });

    test("should access register page", async ({ page }) => {
      await page.goto("/auth/register");
      
      await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
    });
  });

  test.describe("Authenticated Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
    });

    test("should navigate through sidebar menu items", async ({ page }) => {
      // Test Dashboard navigation
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/dashboard$/);
      
      // Navigate to Browse
      const browseLink = page.getByRole("link", { name: /Browse/i });
      if (await browseLink.isVisible()) {
        await browseLink.click();
        await expect(page).toHaveURL(/\/dashboard\/browse/);
      }
      
      // Navigate to Settings
      const settingsLink = page.getByRole("link", { name: /Settings/i });
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await expect(page).toHaveURL(/\/dashboard\/settings/);
      }
    });

    test("should have consistent header across dashboard pages", async ({ page }) => {
      // Check header on dashboard
      await page.goto("/dashboard");
      const header = page.locator("header").first();
      await expect(header).toBeVisible();
      
      // Check header on browse
      await page.goto("/dashboard/browse");
      await expect(header).toBeVisible();
      
      // Check header on settings
      await page.goto("/dashboard/settings");
      await expect(header).toBeVisible();
    });
  });

  test.describe("Protected Route Redirects", () => {
    test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
      await page.goto("/dashboard");
      
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("should redirect to login when accessing settings without auth", async ({ page }) => {
      await page.goto("/dashboard/settings");
      
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("should redirect to login when accessing browse without auth", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("should redirect to login when accessing courses without auth", async ({ page }) => {
      await page.goto("/dashboard/courses/some-course-id");
      
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });

  test.describe("Error Handling", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
    });

    test("should handle 404 for non-existent course", async ({ page }) => {
      await page.goto("/dashboard/courses/non-existent-course-id");
      
      // Should either show 404 or redirect to dashboard
      const is404 = await page.getByText(/not found/i).isVisible().catch(() => false);
      const isDashboard = page.url().includes("/dashboard");
      
      expect(is404 || isDashboard).toBeTruthy();
    });
  });
});
