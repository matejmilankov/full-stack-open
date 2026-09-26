import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

test('check blog title and author', () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5
    }

    render(<Blog blog={blog} />);

    const title = screen.getByText('Test Blog title', { exact: false });
    const author = screen.getByText('Test Author', { exact: false });
    const url = screen.queryByText('http://test.com');
    const likes = screen.queryByText('likes 5');

    expect(title).toBeDefined();
    expect(author).toBeDefined();

    expect(url).toBeNull();
    expect(likes).toBeNull();
});

test('url and likes are shown when button is clicked', async () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name'
        }
    }

    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const url = screen.getByText('http://test.com');
    const likes = screen.getByText('likes 5');

    expect(url).toBeDefined();
    expect(likes).toBeDefined();
});

test('clicking button likes calls event handler twice', async () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name'
        }
    }

    const likeBlog = vi.fn();

    render(<Blog blog={blog} likeBlog={likeBlog} />);

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeBlog.mock.calls).toHaveLength(2);
});