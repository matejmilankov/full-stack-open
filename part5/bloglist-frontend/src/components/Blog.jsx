import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div style={blogStyle}>
      {blog.title} - {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'close' : 'view'}</button>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <div>
            likes {blog.likes}
            <button>like</button>
          </div>
          <p>{blog.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog