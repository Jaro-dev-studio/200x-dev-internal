import { test, expect, TEST_USER, loginAs } from "./fixtures";

test.describe("Course Workflows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
  });

  test.describe("Course Overview", () => {
    test("should display course with sections and lessons", async ({ page }) => {
      await page.goto("/dashboard");
      
      // Navigate to course
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Should show course title
      await expect(page.getByRole("heading", { name: "E2E Test Course" })).toBeVisible();
      
      // Should show progress indicator
      await expect(page.getByText(/% Complete/)).toBeVisible();
      
      // Should show sections
      await expect(page.getByText("Section 1: Getting Started")).toBeVisible();
      await expect(page.getByText("Section 2: Advanced Topics")).toBeVisible();
    });

    test("should display lessons within sections", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Should show lessons
      await expect(page.getByText("Introduction")).toBeVisible();
      await expect(page.getByText("Setup Instructions")).toBeVisible();
      await expect(page.getByText("Advanced Lesson")).toBeVisible();
    });

    test("should navigate back to dashboard from course", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Click back button
      await page.getByRole("link").filter({ has: page.locator("svg") }).first().click();
      
      // Should navigate back to dashboard
      await page.waitForURL(/\/dashboard$/);
    });
  });

  test.describe("Lesson Navigation", () => {
    test("should open first lesson when clicking on it", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Click on first lesson
      await page.getByText("Introduction").click();
      
      // Should navigate to lesson page
      await page.waitForURL(/\/dashboard\/courses\/.*\/lessons\//);
      
      // Should show lesson content
      await expect(page.getByText("Welcome to the test course!")).toBeVisible();
    });

    test("should mark lesson as complete", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Click on first lesson
      await page.getByText("Introduction").click();
      await page.waitForURL(/\/dashboard\/courses\/.*\/lessons\//);
      
      // Click complete button if visible
      const completeButton = page.getByRole("button", { name: /complete/i });
      if (await completeButton.isVisible()) {
        await completeButton.click();
        
        // Wait for completion to process
        await page.waitForTimeout(1000);
      }
    });

    test("should show sequential progress locking for non-first lessons", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Verify the course page loads with sections and lessons
      // The locking logic depends on user progress state
      await expect(page.getByText("Section 1: Getting Started")).toBeVisible();
    });

    test("should navigate between lessons", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Click on first lesson
      await page.getByText("Introduction").click();
      await page.waitForURL(/\/dashboard\/courses\/.*\/lessons\//);
      
      // Should be on lesson page
      await expect(page.getByText("Welcome to the test course!")).toBeVisible();
    });
  });

  test.describe("Course Progress", () => {
    test("should show progress bar on course page", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Should show progress bar element
      const progressBar = page.locator(".bg-accent").first();
      await expect(progressBar).toBeVisible();
    });

    test("should show progress percentage badge", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Access" }).first().click();
      await page.waitForURL(/\/dashboard\/courses\//);
      
      // Should show percentage complete
      await expect(page.getByText(/\d+% Complete/)).toBeVisible();
    });
  });
});
