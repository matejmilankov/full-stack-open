import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { AddBlogForm } from "./AddBlogForm";

test('clicking button for creating blog calls event handler', async () => {
    const addBlog = vi.fn();
    const user = userEvent.setup();

    render(<AddBlogForm addBlog={addBlog} />);

    const titleInput = screen.getByPlaceholderText('Enter title');
    const authorInput = screen.getByPlaceholderText('Enter author');
    const urlInput = screen.getByPlaceholderText('Enter url');
    const addButton = screen.getByText('create');

    await user.type(titleInput, 'Naslov');
    await user.type(authorInput, 'Autor');
    await user.type(urlInput, 'Link do');
    await user.click(addButton);

    expect(addBlog.mock.calls).toHaveLength(1);
    expect(addBlog.mock.calls[0][0].title).toBe('Naslov');
    expect(addBlog.mock.calls[0][0].author).toBe('Autor');
    expect(addBlog.mock.calls[0][0].url).toBe('Link do');
});