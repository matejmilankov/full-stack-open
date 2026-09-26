import { useState } from "react";

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogUsername = blog.user?.username || blog.user;
  const isCreator = user && blogUsername === user.username;

  const toggleVisibility = () => setVisible(!visible);

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
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await removeBlog(blog.id);
  }

  return (
    <div style={blogStyle}>
      {blog.title} - {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'close' : 'view'}</button>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <p>{blog.user.name || 'Unkown user'}</p>
          {isCreator && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog