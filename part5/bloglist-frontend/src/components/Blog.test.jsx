import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

test('renders blog info and likes, but no buttons for unauthenticated user', () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name',
            username: 'testuser'
        }
    }

    render(
        <BrowserRouter>
            <Blog blog={blog} user={null} />
        </BrowserRouter>
    );

    expect(screen.getByText('Test Blog title')).toBeDefined();
    expect(screen.getByText('http://test.com')).toBeDefined();
    expect(screen.getByText('5 likes')).toBeDefined();
    expect(screen.getByText('Added by Test name')).toBeDefined();

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull();
});

test('authenticated users who are not the blog\'s creator are shown only the like button', () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name',
            username: 'testuser'
        }
    }
    const loggedUser = {
        name: 'Matej',
        username: 'matej123'
    }

    render(
        <BrowserRouter>
            <Blog blog={blog} user={loggedUser}/>
        </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull();
});

test('blog\'s creator is also shown the delete button', () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name',
            username: 'testuser'
        }
    }
    const loggedUser = {
        name: 'Test name',
        username: 'testuser'
    }

    render(
        <BrowserRouter>
            <Blog blog={blog} user={loggedUser} />
        </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined();
});

test('clicking the like button calls the handler function', async () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5,
        user: {
            name: 'Test name',
            username: 'testuser'
        }
    }
    const loggedUser = {
        name: 'Test name',
        username: 'testuser'
    }

    const likeBlog = vi.fn();
    const user = userEvent.setup();

    render(
        <BrowserRouter>
            <Blog blog={blog} likeBlog={likeBlog} user={loggedUser} />
        </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: 'like' }));
    await user.click(screen.getByRole('button', { name: 'like' }));

    expect(likeBlog.mock.calls).toHaveLength(2);
});