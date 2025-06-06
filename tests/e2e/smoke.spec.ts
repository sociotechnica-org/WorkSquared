import { test, expect } from '@playwright/test';

test.describe('Work Squared App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Check if the app container exists
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should have correct title', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Work Squared/i);
  });

  test('should create a new todo', async ({ page }) => {
    await page.goto('/');
    
    // Type in the todo input
    const input = page.locator('.new-todo');
    await input.fill('Test todo from Playwright');
    await input.press('Enter');
    
    // Check if the todo appears in the list
    await expect(page.locator('.todo-list li')).toContainText('Test todo from Playwright');
  });

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/');
    
    // Create a todo first
    const input = page.locator('.new-todo');
    await input.fill('Todo to complete');
    await input.press('Enter');
    
    // Toggle the todo
    const toggle = page.locator('.todo-list li .toggle').first();
    await toggle.click();
    
    // Check if it's marked as completed
    await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/);
  });

  test('should sync across tabs', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Navigate both pages
    await page1.goto('/');
    await page2.goto('/');
    
    // Create a todo in page 1
    const input1 = page1.locator('.new-todo');
    await input1.fill('Cross-tab sync test');
    await input1.press('Enter');
    
    // Check if it appears in page 2
    await expect(page2.locator('.todo-list li')).toContainText('Cross-tab sync test');
    
    await context.close();
  });
});