const Blog = ({ blog, likeBlog, removeBlog, user }) => {

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
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await removeBlog(blog.id);
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>
      <p>{blog.user?.name || 'Unkown user'}</p>
      {isCreator && <button onClick={handleRemove}>remove</button>}
    </div>
  )
}

export default Blog