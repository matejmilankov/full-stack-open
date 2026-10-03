import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Link, Stack, Button } from "@mui/material";

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const navigate = useNavigate();

  if (!blog) return null;

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
    <>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h5" component='h5'>
                {blog.title}
              </Typography>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                by {blog.author}
              </Typography>

              <Link href={blog.url} target='_blank'>
                {blog.url}
              </Link>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Added by {blog.user?.name || 'Unkown user'}
              </Typography>

              <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle1">
                  {blog.likes} likes
                </Typography>
                {user && (
                  <Button
                    onClick={handleLike}
                    variant="outlined"
                    size='small'>
                    like
                  </Button>
                )}
                {isCreator && (
                  <Button
                    onClick={handleRemove}
                    variant="outlined"
                    size='small'
                    color="error">
                    remove
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* <div>
        <h1>{blog.author} : {blog.title}</h1>
        <a href={blog.url}>{blog.url}</a>
        <div>
          likes {blog.likes}
          {user && <button onClick={handleLike}>like</button>}
        </div>
        <p>Added by {blog.user?.name || 'Unkown user'}</p>
        {isCreator && <button onClick={handleRemove}>remove</button>}
      </div> */}
    </>
  )
}

export default Blog