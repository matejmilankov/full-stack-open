import { useState } from "react"

export function AddBlogForm({ addBlog }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        await addBlog(title, author, url);
        setTitle('');
        setAuthor('');
        setUrl('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label style={{ display: 'block' }}>
                title
                <input
                    type="text"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </label>
            <label style={{ display: 'block' }}>
                author
                <input
                    type="text"
                    value={author}
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </label>
            <label>
                url
                <input
                    type="text"
                    value={url}
                    onChange={({ target }) => setUrl(target.value)}
                />
            </label>
            <input style={{ display: 'block' }} type="submit" value="create" />
        </form>
    )
}