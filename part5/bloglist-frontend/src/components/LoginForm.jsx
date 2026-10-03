import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

export function LoginForm({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await handleLogin(username, password)) {
      navigate('/');
      setUsername('');
      setPassword('');
    }
  }

  return (
    <>
      <h1>Login to application</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ display: 'block', mb: 2 }}
          variant='standard'
          label='username'
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          variant='standard'
          label='password'
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button sx={{ display: 'block', marginTop: 2 }} type="submit" variant='contained'>
          login
        </Button>
      </form>
    </>
  )
}