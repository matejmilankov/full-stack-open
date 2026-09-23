import { useState } from "react";

export function LoginForm({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(username, password);
        setUsername('');
        setPassword('');
    }

    return (
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
            <input style={{ display: 'block' }} type="submit" />
        </form>
    )
}