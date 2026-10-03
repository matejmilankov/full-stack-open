import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Stack } from '@mui/material';

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
        <Stack direction='column' spacing={2} sx={{ alignItems: 'flex-start' }}>
          <TextField
            label='title'
            size='small'
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='Enter title'
          />

          <TextField
            label='author'
            size='small'
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='Enter author'
          />

          <TextField
            label='url'
            size='small'
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='Enter url'
          />

          <Button sx={{ display: 'block' }} type="submit" variant='contained'>
            create
          </Button>
        </Stack>
      </form>
    </>
  )
}