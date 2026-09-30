import { useState, useEffect, useRef } from 'react';
import { LoginForm } from './components/LoginForm';
import { AddBlogForm } from './components/AddBlogForm';
import { Notification } from './components/Notification';
import { Togglable } from './components/Togglable';
import { Routes, Route, Link } from 'react-router-dom';
import blogService from './services/blogs';
import loginService from './services/login';
import { Blogs } from './components/BLogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await blogService.getAll();
      setBlogs(response);
    }

    fetchBlogs();
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

      return true;
    } catch (err) {
      const errorMessage = err.response?.data.error || 'Server side error happend. Please try again later';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage(null), 3000);

      return false;
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
      const blogWithUser = {
        ...newBlog,
        user: user
      }

      setBlogs(prevBlogs => [...prevBlogs, blogWithUser]);
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

  const likeBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.like(blogObject);
      setBlogs(prevBlogs => prevBlogs.map(blog => (
        blog.id === updatedBlog.id ? updatedBlog : blog
      )));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error liking blog';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const removeBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error deleting blog';
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <>
      {message && <Notification message={message} />}
      <div>
        <Link to="/" style={padding}>blogs</Link>
        {user === null ? (
          <Link to="/login" style={padding}>login</Link>
        ) : (
          <button onClick={handleLogout}>logout</button>
        )
      }
      </div>
      <Routes>
        <Route
          path='/'
          element={
            <Blogs
              blogs={blogs}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
              user={user}
            />
          }
        />
        <Route path='/login' element={<LoginForm handleLogin={handleLogin} />} />
      </Routes>
    </>
  )
}

export default App