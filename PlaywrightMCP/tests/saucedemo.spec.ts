import { expect, test } from '@playwright/test';
import { SauceDemoInventoryPage, SauceDemoLoginPage } from '../pages/sauceDemoPage';

test.describe('SauceDemo scenarios', () => {
  test('login button is clickable and locked-out user shows an error', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);

    await loginPage.goto();
    await expect(loginPage.loginButton).toBeEnabled();

    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('add to cart functionality works for a valid user', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const inventoryPage = new SauceDemoInventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(inventoryPage.title).toHaveText('Swag Labs');
    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  });
});
