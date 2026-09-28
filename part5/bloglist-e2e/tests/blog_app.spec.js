const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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
        await request.post('/api/users', {
            data: {
                name: 'Matej',
                username: 'matejmilankov',
                password: '0811'
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
            await loginWith(page, 'root', 'toor');
            await expect(page.getByText('Superuser logged in')).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'root', 'wrong');

            const errorDiv = page.locator('.error');
            await expect(errorDiv).toContainText('invalid username or password');
        });
    });

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'toor');
        });

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, {
                title: 'Test title',
                author: 'Test author',
                url: 'Test url'
            });

            const blogDiv = page.locator('.blog');
            await expect(blogDiv).toContainText('Test title');
        });

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, {
                    title: 'Test title',
                    author: 'Test author',
                    url: 'Test url'
                });
            });

            test('blog details can be viewed', async ({ page }) => {
                const blogDiv = page.locator('.blog');
                await blogDiv.getByRole('button', { name: 'view' }).click();

                await expect(blogDiv).toContainText('Test author');
                await expect(blogDiv).toContainText('Test url');
            });

            test('blog can be liked', async ({ page }) => {
                const blogDiv = page.locator('.blog');
                await blogDiv.getByRole('button', { name: 'view' }).click();
                await expect(blogDiv).toContainText('likes 0');

                await blogDiv.getByRole('button', { name: 'like' }).click();
                await expect(blogDiv).toContainText('likes 1');
            });

            test('blog can be deleted', async ({ page }) => {
                const blogDiv = page.locator('.blog');
                await blogDiv.getByRole('button', { name: 'view' }).click();

                page.on('dialog', async dialog => {
                    expect(dialog.message()).toContain('Test title');
                    await dialog.accept();
                });
                await blogDiv.getByRole('button', { name: 'remove' }).click();

                await expect(blogDiv).not.toBeVisible();
            });
        });
    });

    describe('when logged in as another user', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'toor');
            await createBlog(page, {
                title: 'Test title',
                author: 'Test author',
                url: 'Test url'
            });

            await page.getByRole('button', { name: 'logout' }).click();
            await loginWith(page, 'matejmilankov', '0811');
        });

        test('cannot see the remove button on other people\'s blogs', async ({ page }) => {
            const blogDiv = page.locator('.blog').filter({ hasText: 'Test title' });
            await blogDiv.getByRole('button', { name: 'view' }).click();

            await expect(blogDiv).toContainText('Test author');
            await expect(blogDiv.getByRole('button', { name: 'remove' })).not.toBeVisible();
        });
    })
});