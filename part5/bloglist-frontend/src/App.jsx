import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedBlogUser');
    if(userJSON) {
      const user = JSON.parse(userJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch(err) {
      console.log(err.response.data.error);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    blogService.setToken(null);
    setUser(null);
  }

  return (
    <>
      {user === null ? (
        <>
          <h1>login to application</h1>
          <LoginForm handleLogin={handleLogin} />
        </>
      ) : (
        <div>
          <h2>blogs</h2>
          <div>
            <button onClick={handleLogout}>logout</button>
            <p>{user.name} logged in</p>
          </div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </>
  )
}

export default App