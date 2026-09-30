import Blog from "./Blog";

export function Blogs({ blogs, likeBlog, removeBlog, user }) {
    return (
        <>
            <h1>blogs</h1>
            {blogs
                .slice()
                .sort((curr, next) => next.likes - curr.likes)
                .map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        likeBlog={likeBlog}
                        removeBlog={removeBlog}
                        user={user}
                    />
                )
            }
        </>
    )
}