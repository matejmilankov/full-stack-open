import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <label style={{ display: 'block' }}>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <input style={{ display: 'block' }} type="submit" value="login" />
      </form>
    </>
  )
}