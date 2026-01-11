import { test, expect, ADMIN_USER, TEST_USER, loginAs } from "./fixtures";

test.describe("Admin Workflows", () => {
  test.describe("Admin Access Control", () => {
    test("should allow admin to access admin dashboard", async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
      
      await page.goto("/admin");
      
      // Should show Admin Dashboard
      await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
    });

    test("should redirect non-admin users away from admin routes", async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
      
      await page.goto("/admin");
      
      // Should redirect to dashboard (not admin)
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page).not.toHaveURL(/\/admin/);
    });

    test("should redirect unauthenticated users to login from admin routes", async ({ page }) => {
      await page.goto("/admin");
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });

  test.describe("Admin Dashboard Overview", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
    });

    test("should display admin statistics cards", async ({ page }) => {
      await page.goto("/admin");
      
      // Should show stat cards
      await expect(page.getByText("Total Courses")).toBeVisible();
      await expect(page.getByText("Total Products")).toBeVisible();
      await expect(page.getByText("Total Users")).toBeVisible();
      await expect(page.getByText("Total Purchases")).toBeVisible();
      await expect(page.getByText("Total Revenue")).toBeVisible();
    });

    test("should display quick actions", async ({ page }) => {
      await page.goto("/admin");
      
      // Should show Quick Actions section
      await expect(page.getByText("Quick Actions")).toBeVisible();
      
      // Should have action buttons
      await expect(page.getByRole("link", { name: "View All Courses" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Create New Course" })).toBeVisible();
      await expect(page.getByRole("link", { name: "View All Products" })).toBeVisible();
    });

    test("should navigate to courses management", async ({ page }) => {
      await page.goto("/admin");
      
      await page.getByRole("link", { name: "View All Courses" }).click();
      
      await expect(page).toHaveURL(/\/admin\/courses$/);
      await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
    });
  });

  test.describe("Admin Courses Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
    });

    test("should display list of courses", async ({ page }) => {
      await page.goto("/admin/courses");
      
      // Should show courses page
      await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
      
      // Should show the test course
      await expect(page.getByText("E2E Test Course")).toBeVisible();
    });

    test("should show course details in list", async ({ page }) => {
      await page.goto("/admin/courses");
      
      // Should show price
      await expect(page.getByText("$99.00")).toBeVisible();
      
      // Should show sections count
      await expect(page.getByText(/\d+ sections/)).toBeVisible();
      
      // Should show published status
      await expect(page.getByText("Published")).toBeVisible();
    });

    test("should navigate to course editor", async ({ page }) => {
      await page.goto("/admin/courses");
      
      // Click edit button
      await page.getByRole("link", { name: "Edit" }).first().click();
      
      // Should navigate to course edit page
      await expect(page).toHaveURL(/\/admin\/courses\/[^/]+$/);
    });

    test("should navigate to new course page", async ({ page }) => {
      await page.goto("/admin/courses");
      
      // Click new course button
      await page.getByRole("link", { name: "New Course" }).click();
      
      // Should navigate to new course page
      await expect(page).toHaveURL(/\/admin\/courses\/new/);
    });
  });

  test.describe("Admin Products Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
    });

    test("should display list of products", async ({ page }) => {
      await page.goto("/admin/products");
      
      // Should show products page heading
      await expect(page.getByRole("heading", { name: /Products/i })).toBeVisible();
      
      // Should show the test product
      await expect(page.getByText("E2E Test Product")).toBeVisible();
    });

    test("should navigate to new product page", async ({ page }) => {
      await page.goto("/admin/products");
      
      // Click new product button
      await page.getByRole("link", { name: /New Product/i }).click();
      
      // Should navigate to new product page
      await expect(page).toHaveURL(/\/admin\/products\/new/);
    });
  });

  test.describe("Admin Users Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
    });

    test("should display users list", async ({ page }) => {
      await page.goto("/admin/users");
      
      // Should show users page
      await expect(page.getByRole("heading", { name: /Users/i })).toBeVisible();
      
      // Should show test users
      await expect(page.getByText(TEST_USER.email)).toBeVisible();
      await expect(page.getByText(ADMIN_USER.email)).toBeVisible();
    });
  });
});
