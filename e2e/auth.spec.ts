import { test, expect, TEST_USER } from "./fixtures";

test.describe("Authentication Workflows", () => {
  test.describe("Login", () => {
    test("should login successfully with valid credentials", async ({ page }) => {
      // Navigate to login page
      await page.goto("/auth/login");

      // Verify login form is displayed
      await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

      // Fill in credentials
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await page.waitForURL(/\/dashboard/);
      await expect(page.getByText(`Welcome back, ${TEST_USER.name}`)).toBeVisible();
    });

    test("should show error with invalid credentials", async ({ page }) => {
      await page.goto("/auth/login");

      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.getByText("Invalid email or password")).toBeVisible();

      // Should stay on login page
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("should redirect to login when accessing protected routes", async ({ page }) => {
      // Try to access dashboard without being logged in
      await page.goto("/dashboard");

      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("should redirect to original destination after login", async ({ page }) => {
      // Try to access settings page
      await page.goto("/dashboard/settings");

      // Should redirect to login with callback
      await expect(page).toHaveURL(/\/auth\/login\?callbackUrl/);

      // Login
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);
      await page.click('button[type="submit"]');

      // Should redirect back to settings
      await page.waitForURL(/\/dashboard\/settings/);
    });
  });

  test.describe("Registration", () => {
    test("should register a new user successfully", async ({ page }) => {
      const uniqueEmail = `new-user-${Date.now()}@example.com`;

      await page.goto("/auth/register");

      // Verify registration form is displayed
      await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();

      // Fill in registration form
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="name"]', "New Test User");
      await page.fill('input[name="password"]', "SecurePassword123!");

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to dashboard after successful registration
      await page.waitForURL(/\/dashboard/);
      await expect(page.getByText("Welcome back, New Test User")).toBeVisible();
    });

    test("should show error when registering with existing email", async ({ page }) => {
      await page.goto("/auth/register");

      // Try to register with existing email
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="name"]', "Duplicate User");
      await page.fill('input[name="password"]', "SecurePassword123!");
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.getByText("An account with this email already exists")).toBeVisible();
    });

    test("should validate password length", async ({ page }) => {
      await page.goto("/auth/register");

      await page.fill('input[name="email"]', `short-pass-${Date.now()}@example.com`);
      await page.fill('input[name="name"]', "Test User");
      await page.fill('input[name="password"]', "short"); // Less than 8 characters
      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
    });

    test("should have link to login page", async ({ page }) => {
      await page.goto("/auth/register");

      // Click on sign in link
      await page.click('a[href="/auth/login"]');

      // Should navigate to login page
      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });

  test.describe("Navigation between auth pages", () => {
    test("should navigate from login to register", async ({ page }) => {
      await page.goto("/auth/login");

      // Click on sign up link
      await page.click('a[href="/auth/register"]');

      // Should navigate to register page
      await expect(page).toHaveURL(/\/auth\/register/);
    });
  });
});
