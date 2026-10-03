import { Link } from "react-router-dom";

export function Blogs({ blogs }) {
    return (
        <>
            <h1>blogs</h1>
            <ul>
                {blogs
                    .slice()
                    .sort((curr, next) => next.likes - curr.likes)
                    .map(blog =>
                        <li key={blog.id}>
                            <Link to={`/blogs/${blog.id}`}>
                                {blog.title} by {blog.author}
                            </Link>
                        </li>
                    )
                }
            </ul>
        </>
    )
}