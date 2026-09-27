const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username);
    await page.getByLabel('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
}

const createBlog = async (page, { title, author, url }) => {
    await page.getByRole('button', { name: 'create blog' }).click();
    await page.getByLabel('title').fill('Test title');
    await page.getByLabel('author').fill('Test author');
    await page.getByLabel('url').fill('Test url');
    await page.getByRole('button', { name: 'create' }).click();

    await page.getByText(title);
}

module.exports = { 
    loginWith,
    createBlog 
}