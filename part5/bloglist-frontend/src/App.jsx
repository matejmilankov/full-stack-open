import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import { Blogs } from './components/BLogs';
import { LoginForm } from './components/LoginForm';
import { AddBlogForm } from './components/AddBlogForm';
import { Notification } from './components/Notification';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogUser');
    if(loggedUser) {
      const userObj = JSON.parse(loggedUser);
      blogService.setToken(userObj.token);
      return userObj;
    }

    return null;
  });
  const [message, setMessage] = useState(null);

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
      const userObj = JSON.parse(userJSON);
      blogService.setToken(userObj.token);
      setUser(userObj);
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

  const match = useMatch('/blogs/:id');
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null;

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color='inherit' component={Link} to='/'>
            blogs
          </Button>
          {user === null ? (
            <Button color='inherit' component={Link} to='/login'>
              login
            </Button>
          ) : (
            <>
              <Button color='inherit' component={Link} to='/create'>
                new blog
              </Button>
              <Button color='inherit' onClick={handleLogout}>logout</Button>
            </>
          )
          }
        </Toolbar>
      </AppBar>

      {message && <Notification message={message} />}

      <Routes>
        <Route path='/' element={<Blogs blogs={blogs} />} />
        <Route
          path='/blogs/:id'
          element={
            <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user} />
          }
        />
        <Route path='/login' element={<LoginForm handleLogin={handleLogin} />} />
        <Route path='/create' element={
          user
            ? <AddBlogForm addBlog={addBlog} />
            : <Navigate replace to={'/login'} />
        }
        />
      </Routes>
    </Container>
  )
}

export default App