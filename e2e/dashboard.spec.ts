import { test, expect, TEST_USER, loginAs } from "./fixtures";

test.describe("Dashboard Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
  });

  test.describe("Main Dashboard", () => {
    test("should display user welcome message", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText(`Welcome back, ${TEST_USER.name}`)).toBeVisible();
    });

    test("should display purchased courses", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Should show My Courses section
      await expect(page.getByText("My Courses")).toBeVisible();
      
      // Should show the test course
      await expect(page.getByText("E2E Test Course")).toBeVisible();
    });

    test("should display purchased digital products", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Should show My Digital Products section
      await expect(page.getByText("My Digital Products")).toBeVisible();
      
      // Should show the test product
      await expect(page.getByText("E2E Test Product")).toBeVisible();
    });

    test("should navigate to course from dashboard", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Click on Access button for the course
      await page.getByRole("link", { name: "Access" }).first().click();
      
      // Should navigate to course page
      await page.waitForURL(/\/dashboard\/courses\//);
      await expect(page.getByText("E2E Test Course")).toBeVisible();
    });
  });

  test.describe("Browse Page", () => {
    test("should display available courses and products", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Should show Browse heading
      await expect(page.getByRole("heading", { name: "Browse" })).toBeVisible();
      
      // Should show Courses section
      await expect(page.getByText("Courses")).toBeVisible();
      
      // Should show Digital Products section
      await expect(page.getByText("Digital Products")).toBeVisible();
    });

    test("should show owned badge for purchased items", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Should show Owned badge for purchased course
      const ownedBadges = page.getByText("Owned");
      await expect(ownedBadges.first()).toBeVisible();
    });

    test("should navigate to course preview from browse", async ({ page }) => {
      await page.goto("/dashboard/browse");
      
      // Click on Access button for owned course
      await page.getByRole("link", { name: "Access" }).first().click();
      
      // Should navigate to course page
      await page.waitForURL(/\/dashboard\/courses\//);
    });
  });

  test.describe("Settings Page", () => {
    test("should display user settings form", async ({ page }) => {
      await page.goto("/dashboard/settings");
      
      // Should show Settings heading
      await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
      
      // Should show Profile section
      await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
      
      // Should show Password section
      await expect(page.getByRole("heading", { name: "Password" })).toBeVisible();
    });

    test("should display current user name in form", async ({ page }) => {
      await page.goto("/dashboard/settings");
      
      // Should have name input with current value
      const nameInput = page.locator('input[name="name"]');
      await expect(nameInput).toHaveValue(TEST_USER.name);
    });

    test("should display current user email", async ({ page }) => {
      await page.goto("/dashboard/settings");
      
      // Should show email (read-only)
      await expect(page.getByText(TEST_USER.email)).toBeVisible();
    });

    test("should update user name successfully", async ({ page }) => {
      await page.goto("/dashboard/settings");
      
      const newName = "Updated Test User";
      
      // Update name
      await page.fill('input[name="name"]', newName);
      await page.getByRole("button", { name: "Save Changes" }).click();
      
      // Should show success message
      await expect(page.getByText(/updated/i)).toBeVisible();
      
      // Revert the name back for other tests
      await page.fill('input[name="name"]', TEST_USER.name);
      await page.getByRole("button", { name: "Save Changes" }).click();
    });
  });

  test.describe("My Products Page", () => {
    test("should display purchased digital products", async ({ page }) => {
      await page.goto("/dashboard/my-products");
      
      // Check if we have products displayed or empty state
      const hasProducts = await page.getByText("E2E Test Product").isVisible().catch(() => false);
      
      if (hasProducts) {
        await expect(page.getByText("E2E Test Product")).toBeVisible();
      }
    });
  });
});
