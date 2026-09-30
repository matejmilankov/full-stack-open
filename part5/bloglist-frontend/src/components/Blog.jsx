import { useNavigate } from "react-router-dom";

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const navigate = useNavigate();

  if(!blog) return null;

  const blogUsername = blog.user?.username || blog.user;
  const isCreator = user && blogUsername === user.username;

  // prilikom dodavanja novog korisnika
  // post endpoint vrati objekat sa polje user koji nije populate-ovan
  // zato bi blog.user.id bio undefined, pa uvodim optional chaining
  const handleLike = async (event) => {
    event.preventDefault();
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      url: blog.url,
      author: blog.author,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    }
    await likeBlog(updatedBlog);
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await removeBlog(blog.id);
      navigate('/');
    }
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        {user && <button onClick={handleLike}>like</button>}
      </div>
      <p>Added by {blog.user?.name || 'Unkown user'}</p>
      {isCreator && <button onClick={handleRemove}>remove</button>}
    </div>
  )
}

export default Blog