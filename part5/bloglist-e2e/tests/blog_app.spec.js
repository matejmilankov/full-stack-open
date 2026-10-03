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
        await page.getByRole('link', { name: 'login' }).click()

        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    });

    describe('login', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/login');
        });
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'root', 'toor');
            await expect(page.getByRole('button', { name: 'logout' })).toBeVisible();
        });

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'root', 'wrong');

            const errorDiv = page.locator('.error');
            await expect(errorDiv).toContainText('invalid username or password');
        });
    });

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/login');
            await loginWith(page, 'root', 'toor');
        });

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, {
                title: 'Test title',
                author: 'Test author',
                url: 'Test url'
            });

            const blogList = page.locator('ul');
            await expect(blogList).toContainText('Test title');
        });

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, {
                    title: 'Test title',
                    author: 'Test author',
                    url: 'Test url'
                });
            });

            test('blog can be liked', async ({ page }) => {
                const blogList = page.locator('ul');
                await blogList.getByRole('link', { name: 'Test title by Test author' }).click();
                await expect(page.getByText('0 likes')).toBeVisible();

                await page.getByRole('button', { name: 'like' }).click();
                await expect(page.getByText('1 likes')).toBeVisible();
            });

            test('blog can be deleted', async ({ page }) => {
                page.on('dialog', async dialog => {
                    expect(dialog.message()).toContain('Test title');
                    await dialog.accept();
                });

                const blogList = page.locator('ul');
                const blogLink = blogList.getByRole('link', { name: 'Test title by Test author' });

                await blogLink.click();
                await page.getByRole('button', { name: 'remove' }).click();

                await page.waitForURL('/');
                await expect(blogLink).not.toBeVisible();
            });
        });

        describe('and few blogs exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, {
                    title: 'Test title 1',
                    author: 'Test author 1',
                    url: 'Test url 1'
                });
                await createBlog(page, {
                    title: 'Test title 2',
                    author: 'Test author 2',
                    url: 'Test url 2'
                });
                await createBlog(page, {
                    title: 'Test title 3',
                    author: 'Test author 3',
                    url: 'Test url 3'
                });
            });

            test('existing blogs are sorted by likes', async ({ page }) => {
                const blog1 = page.locator('ul').filter({ hasText: 'Test title 1' });
                const blog2 = page.locator('ul').filter({ hasText: 'Test title 2' });

                // blog1 = 1 likes
                await blog1.getByRole('link', { name: 'Test title 1 by Test author 1' }).click();
                await page.getByRole('button', { name: 'like' }).click();
                await expect(page.getByText('1 likes')).toBeVisible();
                await page.goto('/');

                // blog2 = 2 likes
                await blog2.getByRole('link', { name: 'Test title 2 by Test author 2' }).click();
                await page.getByRole('button', { name: 'like' }).click();
                await expect(page.getByText('1 likes')).toBeVisible();
                await page.getByRole('button', { name: 'like' }).click();
                await expect(page.getByText('2 likes')).toBeVisible();
                await page.goto('/');

                await expect(page.locator('li').first()).toBeVisible();
                const sortedBlogs = await page.locator('li').all();

                await expect(sortedBlogs[0]).toContainText('Test title 2');
                await expect(sortedBlogs[1]).toContainText('Test title 1');
                await expect(sortedBlogs[2]).toContainText('Test title 3');
            });

        });
    });

    describe('when logged in as another user', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/login');
            await loginWith(page, 'root', 'toor');
            await createBlog(page, {
                title: 'Test title',
                author: 'Test author',
                url: 'Test url'
            });

            await page.getByRole('button', { name: 'logout' }).click();
            await page.getByRole('link', { name: 'login' }).click();
            await loginWith(page, 'matejmilankov', '0811');
        });

        test('cannot see the remove button on other people\'s blogs', async ({ page }) => {
            const blogList = page.locator('ul');
            await blogList.getByRole('link', { name: 'Test title by Test author' }).click();

            await expect(page.getByText('Test author : Test title')).toBeVisible();
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
        });
    })
});