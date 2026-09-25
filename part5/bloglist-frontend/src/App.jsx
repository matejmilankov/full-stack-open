import { useState, useEffect, useRef } from 'react';
import { LoginForm } from './components/LoginForm';
import { AddBlogForm } from './components/AddBlogForm';
import { Notification } from './components/Notification';
import { Togglable } from './components/Togglable';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedBlogUser');
    if (userJSON) {
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
    } catch (err) {
      const errorMessage = err.response?.data.error || 'Server side error happend. Please try again later';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    blogService.setToken(null);
    setUser(null);
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(prevBlogs => [...prevBlogs, newBlog]);
      setMessage({ text: `a new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
      blogFormRef.current.toggleVisibility();

      return true;
    } catch (err) {
      const errorMessage = err.response?.data.error || 'Server side error happend. Please try again later';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage(null), 3000);

      return false;
    }
  }

  return (
    <>
      {message && <Notification message={message}/>}
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

          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <div>
              <h1>create new</h1>
              <AddBlogForm addBlog={addBlog} />
            </div>
          </Togglable>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </>
  )
}

export default App