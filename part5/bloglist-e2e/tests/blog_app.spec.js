const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset');
        await request.post('/api/users', {
            data: {
                name: 'Superuser',
                username: 'root',
                password: 'toor'
            }
        });

        await page.goto('/');
    });

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    });

    describe('login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('username').fill('root');
            await page.getByLabel('password').fill('toor');
            await page.getByRole('button', { name: 'login' }).click();

            await expect(page.getByText('Superuser logged in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill('root');
            await page.getByLabel('password').fill('wrong');
            await page.getByRole('button', { name: 'login' }).click();

            const errorDiv = page.locator('.error');
            await expect(errorDiv).toContainText('invalid username or password');
        });
    });
});