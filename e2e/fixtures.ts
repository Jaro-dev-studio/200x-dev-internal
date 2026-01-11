/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, Page } from "@playwright/test";

// Test user credentials
export const TEST_USER = {
  email: "test@example.com",
  password: "TestPassword123!",
  name: "Test User",
};

// Admin user credentials
export const ADMIN_USER = {
  email: "jaroslav.vorobey@gmail.com",
  password: "TestPassword123!",
  name: "Admin User",
};

// Custom test fixture with authentication helpers
export const test = base.extend<{
  authenticatedPage: Page;
  adminPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
    await use(page);
  },
});

// Helper function to login
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

// Helper function to logout
export async function logout(page: Page) {
  // Navigate to settings and find logout button, or go to a logout endpoint
  await page.goto("/auth/login");
}

// Helper function to register a new user
export async function registerUser(
  page: Page,
  email: string,
  name: string,
  password: string
) {
  await page.goto("/auth/register");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}

export { expect };
