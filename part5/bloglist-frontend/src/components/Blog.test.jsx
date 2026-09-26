import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import { expect } from 'vitest';

test('check blog title and author', () => {
    const blog = {
        title: 'Test Blog title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 5
    }

    render(<Blog blog={blog}/>);

    const title = screen.getByText('Test Blog title', { exact: false });
    const author = screen.getByText('Test Author', { exact: false });
    const url = screen.queryByText('http://test.com');
    const likes = screen.queryByText('likes 5');

    expect(title).toBeDefined();
    expect(author).toBeDefined();

    expect(url).toBeNull();
    expect(likes).toBeNull();
});