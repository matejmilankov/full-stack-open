import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AddBlogForm({ addBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await addBlog({ title, author, url });
    if (success) {
      navigate('/');
      setTitle('');
      setAuthor('');
      setUrl('');
    }
  }

  return (
    <>
      <h1>create new</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block' }}>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='Enter title'
          />
        </label>
        <label style={{ display: 'block' }}>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='Enter author'
          />
        </label>
        <label>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='Enter url'
          />
        </label>
        <input style={{ display: 'block' }} type="submit" value="create" />
      </form>
    </>
  )
}